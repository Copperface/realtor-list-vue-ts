<template>
  <v-toolbar app dark class="primary">
    <v-toolbar-side-icon class="hidden-md-and-up" @click="handleClickShowSideMenu"></v-toolbar-side-icon>
    <v-toolbar-title>Список риэлторов</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat to="/card/create">
        <v-icon left>create</v-icon>Новый риэлтор
      </v-btn>
      <v-btn flat to="/">
        <v-icon left>list</v-icon>Список риэлторов
      </v-btn>
    </v-toolbar-items>
    <v-text-field
      v-model="searchQuery"
      class="xs12 sm12 md4"
      v-if="showSearchField"
      @blur="handleBlurSearchField"
      @click:append="handleClickSearchField"
      @keyup.enter="handleClickSearchField"
      autofocus
      light
      placeholder="Поиск..."
      append-icon="search"
      hide-details
      solo
    ></v-text-field>
    <v-btn v-else @click="handleClickShowSearch" icon>
      <v-icon>search</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import EventBus from '@/utils/EventBus';

@Component({})
export default class AppHeader extends Vue {
  public showSideMenu: boolean = true;
  public showSearchField: boolean = false;
  public searchQuery: string = '';

  public handleClickShowSearch(): void {
    this.showSearchField = true;
  }

  public handleBlurSearchField(): void {
    this.showSearchField = false;
  }

  public handleClickSearchField(): void {
    this.searchQuery &&
      this.$router.push({ path: '/', query: { search: this.searchQuery } });
    this.showSearchField = false;
    this.searchQuery = '';
  }

  public handleClickShowSideMenu(): void {
    EventBus.$emit('clickShowSideMenu');
  }
}
</script>