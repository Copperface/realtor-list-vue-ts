<template>
  <v-navigation-drawer v-model="showSideMenu" absolute temporary>
    <v-list class="pa-1">
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>Список риэлторов</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-list class="pt-0" dense>
      <v-divider></v-divider>
      <v-list-tile v-for="item in MENU_ITEMS" :key="item.title" :to="item.to">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import EventBus from '@/utils/EventBus';

@Component({})
export default class SideMenu extends Vue {
  public readonly MENU_ITEMS = [
    { title: 'Новый риэлтор', icon: 'create', to: '/card/create' },
    { title: 'Список риэлторов', icon: 'list', to: '/' },
  ];

  public showSideMenu: boolean = false;

  public created(): void {
    EventBus.$on('clickShowSideMenu', () => {
      this.toggleSideMenu();
    });
  }

  public toggleSideMenu(): void {
    this.showSideMenu = !this.showSideMenu;
  }
}
</script>
