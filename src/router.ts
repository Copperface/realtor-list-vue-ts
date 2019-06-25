import Vue from 'vue';
import Router from 'vue-router';
import RealtorsList from './views/RealtorsList.vue';
import RealtorCard from './views/RealtorCard.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'RealtorsList',
      component: RealtorsList,
      props: (route) => ({ query: route.query }),
    },
    {
      path: '/card/:method/:id?',
      name: 'RealtorCard',
      component: RealtorCard,
      props: true,
    },
  ],
});
