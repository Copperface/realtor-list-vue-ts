<template>
  <v-app>
    <SideMenu/>
    <AppHeader/>
    <v-content app>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-content>
    <AppFooter/>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import SideMenu from '@/components/SideMenu.vue';

@Component({
  components: {
    AppHeader,
    AppFooter,
    SideMenu,
  },
})
export default class App extends Vue {}
</script>
