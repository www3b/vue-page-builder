import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { setupDataSync } from '@/composables/useDataSync';
import Container from '@/components/ui/Container.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.component('Container', Container);

setupDataSync(pinia);

app.mount('#app');
