<template>
  <vue-content-loading :width="300" :height="15">
    <circle cx="15" cy="5" r="5" />
    <rect x="25" y="0" rx="4" ry="4" width="100" height="10" />
  </vue-content-loading>
</template>

<script>
import VueContentLoading from 'vue-content-loading'

export default {
  components: {
    VueContentLoading
  }
}
</script>

<style>

</style>
