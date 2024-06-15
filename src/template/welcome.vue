<script>
export default {
  data() {
    return {
      msg: 'Hello World!',
      value: 50,
      vueVersion: window.Vue.version,
      elementUiVersion: window.ELEMENT.version,
    }
  },
  computed: {
    background() {
      return `linear-gradient(to right, pink ${this.value}%, crimson 100%)`
    },
  },
}
</script>

<template>
  <div>
    <h1>Vue: {{ vueVersion }}</h1>
    <h1>Element-UI: {{ elementUiVersion }}</h1>
    <h1>{{ msg }}</h1>
    <input v-model="msg" />
    <br />
    <br />
    <input v-model="value" type="range" min="0" max="100" step="1" />
    <div class="bar" :style="{ background }"></div>
    <br />
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </div>
</template>

<style scoped>
.bar {
  margin-top: 10px;
  height: 40px;
  border-radius: 5px;
}
</style>
