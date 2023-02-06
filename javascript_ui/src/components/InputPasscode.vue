<template>
  <div
    class="justify-center items-center text-center"
    style="margin: 20px 200px"
  >
    <b
      >If you are a researcher, enter passcode to go to settings page, otherwise
      click the "GO BACK" button</b
    >

    <div class="row passcode-row">
      <div class="col q-pa-sm">
        <q-btn class="full-width full-height" color="primary" label="1"></q-btn>
      </div>
      <div class="col q-pa-sm">
        <q-btn class="full-width full-height" color="primary" label="2"></q-btn>
      </div>
      <div class="col q-pa-sm">
        <q-btn class="full-width full-height" color="primary" label="3"></q-btn>
      </div>
    </div>

    <div class="row passcode-row">
      <div class="col q-pa-sm">
        <q-btn class="full-width full-height" color="primary" label="4"></q-btn>
      </div>
      <div class="col q-pa-sm">
        <q-btn class="full-width full-height" color="primary" label="5"></q-btn>
      </div>
      <div class="col q-pa-sm">
        <q-btn class="full-width full-height" color="primary" label="6"></q-btn>
      </div>
    </div>

    <div class="row passcode-row">
      <div class="col q-pa-sm">
        <q-btn class="full-width full-height" color="primary" label="7"></q-btn>
      </div>
      <div class="col q-pa-sm">
        <q-btn class="full-width full-height" color="primary" label="8"></q-btn>
      </div>
      <div class="col q-pa-sm">
        <q-btn class="full-width full-height" color="primary" label="9"></q-btn>
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
        <q-btn class="full-width full-height" color="primary" label="0"></q-btn>
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

<style lang="scss" scoped>
.passcode-row {
  height: 70px;
}
</style>
