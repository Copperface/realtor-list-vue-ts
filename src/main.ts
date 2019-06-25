import Vue from 'vue';
import App from './App.vue';
import router from './router';
import UUID from 'vue-uuid';
import '@/plugins/vuetify';

Vue.config.productionTip = false;
Vue.use(UUID);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
