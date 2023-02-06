<template>
  <div
    class="justify-center items-center text-center"
    style="margin: 20px 200px"
  >
    <b
      >If you are a researcher, enter passcode to go to settings page, otherwise
      click the "GO BACK" button</b
    >

    <div class="row">
      <q-input
        filled
        bottom-slots
        class="full-width"
        v-model="passcode"
        label="passcode"
        type="password"
        counter
        maxlength="4"
      >
        <template v-slot:append>
          <q-btn round dense flat @click="backspacePasscode" icon="backspace" />
        </template>
      </q-input>
    </div>

    <div class="row passcode-row">
      <div class="col q-pa-sm">
        <q-btn
          class="full-width full-height"
          color="primary"
          @click="appendPasscode('1')"
          label="1"
        ></q-btn>
      </div>
      <div class="col q-pa-sm">
        <q-btn
          class="full-width full-height"
          color="primary"
          @click="appendPasscode('2')"
          label="2"
        ></q-btn>
      </div>
      <div class="col q-pa-sm">
        <q-btn
          class="full-width full-height"
          color="primary"
          @click="appendPasscode('3')"
          label="3"
        ></q-btn>
      </div>
    </div>

    <div class="row passcode-row">
      <div class="col q-pa-sm">
        <q-btn
          class="full-width full-height"
          color="primary"
          @click="appendPasscode('4')"
          label="4"
        ></q-btn>
      </div>
      <div class="col q-pa-sm">
        <q-btn
          class="full-width full-height"
          color="primary"
          @click="appendPasscode('5')"
          label="5"
        ></q-btn>
      </div>
      <div class="col q-pa-sm">
        <q-btn
          class="full-width full-height"
          color="primary"
          @click="appendPasscode('6')"
          label="6"
        ></q-btn>
      </div>
    </div>

    <div class="row passcode-row">
      <div class="col q-pa-sm">
        <q-btn
          class="full-width full-height"
          color="primary"
          @click="appendPasscode('7')"
          label="7"
        ></q-btn>
      </div>
      <div class="col q-pa-sm">
        <q-btn
          class="full-width full-height"
          color="primary"
          @click="appendPasscode('8')"
          label="8"
        ></q-btn>
      </div>
      <div class="col q-pa-sm">
        <q-btn
          class="full-width full-height"
          color="primary"
          @click="appendPasscode('9')"
          label="9"
        ></q-btn>
      </div>
    </div>

    <div class="row passcode-row">
      <div class="col q-pa-sm">
        <q-btn
          class="full-width full-height"
          color="info"
          label="Go Back"
          to="/"
        ></q-btn>
      </div>
      <div class="col q-pa-sm">
        <q-btn
          class="full-width full-height"
          color="primary"
          @click="appendPasscode('0')"
          label="0"
        ></q-btn>
      </div>
      <div class="col q-pa-sm">
        <q-btn
          class="full-width full-height"
          color="positive"
          label="Submit"
        ></q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'InputPasscode',
  setup() {
    let passcode = ref('');

    const backspacePasscode = () => {
      // Remove last character of passcode
      passcode.value = passcode.value.slice(0, -1);
    };

    const appendPasscode = (char: string) => {
      passcode.value = passcode.value.concat(char);
    };

    return { passcode, backspacePasscode, appendPasscode };
  },
});
</script>

<style lang="scss" scoped>
.passcode-row {
  height: 70px;
}
</style>
