import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/pages/Home.vue';
import TabPage from '@/pages/TabPage.vue';

const router = createRouter({
  linkExactActiveClass: 'btn--active',
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home },
    { path: '/:tabSlug', component: TabPage },
  ],
});

export default router;
