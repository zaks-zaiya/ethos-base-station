<template>
  <q-card class="contact-card bg-primary text-white">
    <q-card-section>
      <div>
        <q-icon name="email" />
        {{ email }}
      </div>
      <div class="q-mt-sm">
        <q-icon name="phone" />
        {{ phone }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    let email = process.env.CONTACTEMAIL;
    let phone = process.env.CONTACTPHONE;
    return { email, phone };
  },
});
</script>

<style lang="scss" scoped>
.contact-card {
  width: 400px;
}
</style>
