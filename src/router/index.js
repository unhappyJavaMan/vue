import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      children: [
        {
          path: 'option1',
          name: 'option1',
          component: () => import('../components/Option1View.vue')
        },
        {
          path: 'option2',
          name: 'option2',
          component: () => import('../components/Option2View.vue')
        }
      ]
    },
  ]
})

export default router