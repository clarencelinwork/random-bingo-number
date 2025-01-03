<!-- src/App.vue -->
<template>
  <div class="app-container">
    <NumberDraw/>
  </div>
</template>

<script>
import NumberDraw from './components/NumberDraw.vue'

export default {
  name: 'App',
  components: {
    NumberDraw
  }
}
</script>

<style>
.app-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f7fa;
}
</style>