<template>
  <q-layout view="lHh Lpr lFf" class="bg-blue-grey-2">
    <!-- Register Modals -->
    <modal-no-connection />
    <!-- Main layout -->
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

import ModalNoConnection from 'components/ModalNoConnection.vue';

export default defineComponent({
  name: 'MainLayout',
  components: { ModalNoConnection },
  setup() {
    return {};
  },
});
</script>
