<template>
  <q-layout view="lHh Lpr lFf" class="bg-blue-grey-2">
    <q-header flat class="transparent">
      <q-toolbar>
        <img src="ethos.svg" height="30" />
        <q-toolbar-title></q-toolbar-title>
        <q-btn square color="secondary" icon="settings" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    return {};
  },
});
</script>
