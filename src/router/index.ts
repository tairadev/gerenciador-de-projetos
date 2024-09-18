import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import NewProject from '../views/NewProject.vue';
import SearchView from '../views/SearchView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/novo',
    name: 'new-project',
    component: NewProject,
  },
  {
    path: '/editar/:id',
    name: 'edit-project',
    component: NewProject,
    props: true,
  },
  {
    path: '/busca',
    name: 'search',
    component: SearchView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
