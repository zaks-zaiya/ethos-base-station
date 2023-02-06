<template>
  <q-layout view="lHh Lpr lFf" class="bg-blue-grey-2">
    <!-- Register Modals -->
    <modal-no-connection />
    <!-- Main layout -->
    <q-header flat class="transparent">
      <q-toolbar>
        <img src="ethos.svg" height="30" />
        <q-btn
          v-if="$route.path !== '/'"
          to="/"
          color="info"
          label="go back to home"
          icon="home"
          class="q-ml-md"
        />
        <q-toolbar-title></q-toolbar-title>
        <q-btn color="secondary" label="help" class="q-mr-md" />
        <q-btn color="secondary" icon="settings" to="settings" />
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
});
</script>
