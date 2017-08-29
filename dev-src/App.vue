<template>
  <div id="app">
    <LineChart></LineChart>
    <BarChart></BarChart>
  </div>
</template>

<script>
import LineChart from './charts/LineChart.vue'
import BarChart from './charts/BarChart.vue'
export default {
  name: 'app',
  components: {
    LineChart,
    BarChart
  }
}
</script>

<style lang="scss">
body{
  margin:0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
