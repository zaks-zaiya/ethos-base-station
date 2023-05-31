<template>
  <div class="justify-center items-center text-center" style="margin: 20px 10%">
    <b class="fontsize-14"
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
        :error="isIncorrectPasscode"
        error-message="Incorrect passcode, try again"
      >
        <template v-slot:append>
          <q-btn round dense flat @click="backspacePasscode" icon="backspace" />
        </template>
      </q-input>
    </div>

    <div
      class="row passcode-row"
      v-for="(row, index) in passcodeInputLayout"
      :key="index"
    >
      <div class="col q-pa-sm" v-for="key in row" :key="key">
        <q-btn
          v-if="key == 'go back'"
          class="full-width full-height"
          color="info"
          :label="key"
          to="/"
        ></q-btn>
        <q-btn
          v-else-if="key == 'submit'"
          class="full-width full-height"
          color="positive"
          :label="key"
          @click="checkPasscode"
        ></q-btn>
        <q-btn
          v-else
          class="full-width full-height"
          color="primary"
          @click="appendPasscode(key)"
          :label="key"
        ></q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'InputPasscode',
  setup(props, { emit }) {
    const passcode = ref('');

    const passcodeInputLayout = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['go back', '0', 'submit'],
    ];
    const isIncorrectPasscode = ref(false);

    const backspacePasscode = () => {
      // Remove last character of passcode
      passcode.value = passcode.value.slice(0, -1);
    };

    const appendPasscode = (char: string) => {
      // Append character to end of passcode
      passcode.value = passcode.value.concat(char);
    };

    const checkPasscode = () => {
      // Passcode is correct
      if (passcode.value == process.env.SETTINGSPASSCODE) {
        isIncorrectPasscode.value = false;
        // Submit 'success' event to indicate passcode submitted successfully
        emit('success');
      }
      // Passcode is incorrect
      else {
        // Display error and clear passcode
        isIncorrectPasscode.value = true;
        passcode.value = '';
      }
    };

    return {
      passcode,
      passcodeInputLayout,
      isIncorrectPasscode,
      backspacePasscode,
      appendPasscode,
      checkPasscode,
    };
  },
});
</script>

<style lang="scss" scoped>
.passcode-row {
  height: calc(#{$remaining-height} / 6);
}
</style>
