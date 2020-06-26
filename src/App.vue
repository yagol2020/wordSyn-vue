<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import NavMenu from "@/components/common/NavMenu";

export default {
  name: "App",
  components: { NavMenu }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 10px;*/
}
.div_foot {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
