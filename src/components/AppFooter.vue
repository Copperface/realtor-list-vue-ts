    
<template>
  <v-bottom-nav class="primary" :value="true" dark absolute app>
    <v-btn to="/card/create" dark>
      <span>Новый риэлтор</span>
      <v-icon>create</v-icon>
    </v-btn>
    <v-btn to="/" dark>
      <span>Список риэлторов</span>
      <v-icon>list</v-icon>
    </v-btn>
  </v-bottom-nav>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class AppFooter extends Vue {}
</script>
