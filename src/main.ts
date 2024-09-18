import { createApp } from 'vue';
import './style.scss';
import { vMask } from './plugins/Directives';
import App from './App.vue';
import router from './router';

const app = createApp(App)
  .directive('mask', vMask)
  .use(router);

router.isReady().then(() => {
  app.mount('#app');
});
