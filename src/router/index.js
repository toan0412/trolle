import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomePage/Home.vue')
    },
    {
      path: '/member',
      name: 'member',
      component: () => import('../views/MemberPage/Member.vue')
    },
  ]
})

export default router
