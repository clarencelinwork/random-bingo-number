<!-- src/App.vue -->
<template>
  <div class="app-container">
    <NumberDraw />
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
  min-height: 100vh;
  background-color: #f5f7fa;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

/* 重置一些基本樣式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style>