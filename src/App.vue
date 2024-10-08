<script setup></script>

<template>
  <div style="background-color: red; width: 100%; height: 20hv">
    <p v-if="isOnline">You are online!</p>
    <p v-else>You are offline!</p>
  </div>
  <router-view></router-view>
</template>

<script>
export default {
  data() {
    return {
      isOnline: navigator.onLine
    }
  },
  created() {
    window.addEventListener('online', this.updateOnlineStatus)
    window.addEventListener('offline', this.updateOnlineStatus)
  },
  beforeUnmount() {
    window.removeEventListener('online', this.updateOnlineStatus)
    window.removeEventListener('offline', this.updateOnlineStatus)
  },
  methods: {
    updateOnlineStatus() {
      this.isOnline = navigator.onLine
    }
  }
}
</script>

<style scoped></style>
