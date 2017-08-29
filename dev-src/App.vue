<template>
  <div id="app">
    <LineChart></LineChart>
  </div>
</template>

<script>
import LineChart from './line-chart/LineChart.vue'
export default {
  name: 'app',
  components: {
    LineChart
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
