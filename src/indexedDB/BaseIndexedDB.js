const oneHourToMilisecond = 1000 * 60 * 60;

function getHourDifference(dateTime1, dateTime2) {
  const differenceInMilliseconds = dateTime2.getTime() - dateTime1.getTime();
  const differenceInHours = differenceInMilliseconds / (oneHourToMilisecond);
  return differenceInHours;
}

var indexedDBConnection = null;
var objectStoreIndexedDB = null;

class BaseIndexedDB {
  constructor({ storeName, primaryKey, suffixKey = 'TenantID', cacheHour = 24 }) {
    this.storeName = storeName;
    this.primaryKey = primaryKey;
    this.suffixKey = suffixKey;
    this.cacheHour = cacheHour;
    if (!objectStoreIndexedDB) objectStoreIndexedDB = []
    objectStoreIndexedDB.push({
      primaryKey,
      storeName,
      suffixKey
    })
  }

  openDatabase() {
    return new Promise((resolve, reject) => {
      // let UserInfo = $store.getters && $store.getters.userInfor && $store.getters.userInfor.UserInfo;
      let UserInfo = ""
      let suffixValue = UserInfo && UserInfo[this.suffixKey] || localStorage.getItem(this.suffixKey) || "";
      if (!this.storeName.includes(suffixValue)) this.storeName = `${this.storeName}_${suffixValue}`;

      if (indexedDBConnection) {
        resolve(indexedDBConnection)
        return;
      }

      const request = indexedDB.open('AMIS_Payroll', 1);

      request.onsuccess = async (event) => {
        indexedDBConnection = event.target.result
        resolve(event.target.result)
        console.log("Database opened successfully");
      };

      request.onerror = (event) => {
        reject(event.target.error);
        console.error("Error opening database:", event.target.error);
      };

      request.onupgradeneeded = (event) => {
        this.deleteDatabase();
        const db = event.target.result;
        objectStoreIndexedDB.forEach(({ primaryKey, storeName, suffixKey }) => {
          let suffixValue = UserInfo && UserInfo[suffixKey] || localStorage.getItem(suffixKey) || "";
          if (!storeName.includes(suffixValue)) storeName = `${storeName}_${suffixValue}`;
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: primaryKey || "ID" });
          }
        });
      };
    })
  }

  setExpired(data) {
    // let { userInfor } = $store.getters;
    let { userInfor } = {};

    if (userInfor) {
      let { CurrentTimeServer } = userInfor.UserOptions;
      data.Expired = new Date(CurrentTimeServer).getTime() + this.cacheHour * oneHourToMilisecond;
    } else {
      data.Expired = Date.now() + this.cacheHour * oneHourToMilisecond;
    }
    // Convert object to serializable
    return JSON.parse(JSON.stringify(data));
  }

  async addData(data) {
    try {
      data = this.setExpired(data); // Ensure data is serializable
      if (!this.primaryKey) data.ID = 1;
      await this.openDatabase();
      const tx = indexedDBConnection.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.put(data);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve();
          console.log("Data added successfully");
          this.closeDatabase();
        };

        request.onerror = (event) => {
          reject(event.target.error);
          console.error("Error adding data:", event.target.error);
        };

        tx.oncomplete = () => { };
      });
    } catch (err) {
      this.deleteDatabase();
      console.error(err);
    }
  }

  async updateData(data) {
    try {
      data = this.setExpired(data); // Ensure data is serializable
      if (!this.primaryKey) data.ID = 1;
      await this.openDatabase();
      const tx = indexedDBConnection.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.put(data);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve();
          console.log("Data updated successfully");
          this.closeDatabase();
        };

        request.onerror = (event) => {
          reject(event.target.error);
          console.error("Error updating data:", event.target.error);
        };

        tx.oncomplete = () => { };
      });
    } catch (err) {
      this.deleteDatabase();
      console.error(err);
    }
  }

  async saveData(data, isExpire = true, upsert = true) {
    try {
      if (isExpire) {
        data = this.setExpired(data); // Ensure data is serializable
      }
      if (!this.primaryKey) data.ID = 1;
      await this.openDatabase();
      let dataIndexedDB = await this.findData(data[this.primaryKey], true);
      if (dataIndexedDB) {
        await this.updateData(data);
      } else if (upsert) {
        await this.addData(data);
      }
    } catch (err) {
      this.deleteDatabase();
      console.log('BaseIndexedDB error');
    }
  }


  async deleteData(id) {
    try {
      await this.openDatabase()
      const tx = indexedDBConnection.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.delete(id || 1);

      return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
          resolve();
          console.log("Data deleted successfully");
          this.closeDatabase();
        };

        request.onerror = (event) => {
          reject(event.target.error);
          console.error("Error deleting data:", event.target.error);
        };

        tx.oncomplete = () => { };
      })
    } catch (err) {
      this.deleteDatabase();
      console.log('BaseIndexedDB error')
    }
  }

  async findData(id, resetDataIfExist = false) {
    try {
      await this.openDatabase()
      const tx = indexedDBConnection.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.get(id || 1);

      return new Promise((resolve, reject) => {
        let data = null;
        request.onsuccess = (event) => {
          data = event.target.result;
          if (data && data.Expired) {
            let { Expired } = data;
            let { userInfor } = $store.getters;
            if (!userInfor) {
              resolve(null);
              return;
            }
            let { CurrentTimeServer } = userInfor.UserOptions;
            let hourDiff = getHourDifference(new Date(Expired), new Date(CurrentTimeServer))
            if (hourDiff >= 0) resolve(resetDataIfExist ? data : null);
          }
          resolve(data);
          console.log("Data get successfully");
          this.closeDatabase();
        };

        request.onerror = (event) => {
          reject(event.target.error);
          console.error("Error get data:", event.target.error);
        };

        tx.oncomplete = () => { };
      });
    } catch (err) {
      this.deleteDatabase();
      console.log('BaseIndexedDB error')
      return null;
    }
  }

  async getAllData() {
    try {
      await this.openDatabase()
      const tx = indexedDBConnection.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);

      return new Promise((resolve, reject) => {
        const data = [];
        store.openCursor().onsuccess = (event) => {
          let cursor = event.target.result;
          if (cursor) {
            data.push(cursor.value);
            cursor.continue();
          }
        };

        tx.oncomplete = () => {
          resolve(data);
          this.closeDatabase();
        };
      });
    } catch (err) {
      this.deleteDatabase();
      console.log('BaseIndexedDB error')
      return null;
    }
  }
  deleteDatabase() {
    try {
      if (!this.closeDatabase()) return;
      let request = indexedDB.deleteDatabase("AMIS_Payroll");
      request.onsuccess = (e) => {
        console.log('Success deleting database');
      };
      request.onerror = (event) => {
        console.error('Error deleting database:', event.target.error);
      };
    } catch (err) {
      console.log('Delete IndexedDB error')
    }
  }
  closeDatabase() {
    if (!indexedDBConnection) return false;
    indexedDBConnection.close();
    indexedDBConnection = null;
    console.log("Database closed successfully")
    return true;
  }
}

export default BaseIndexedDB;