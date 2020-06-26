<template>
  <div>
    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu router :default-active="activeIndex" @select="handleSelect">
          <el-menu-item index="modelFile">
            <i class="el-icon-menu"></i>
            <span slot="title">管理模板文件</span>
          </el-menu-item>
          <el-menu-item index="docFile">
            <i class="el-icon-menu"></i>
            <span slot="title">管理检测文件</span>
          </el-menu-item>
          <el-menu-item index="compareFile">
            <i class="el-icon-menu"></i>
            <span slot="title">文件检测功能</span>
          </el-menu-item>
          <el-menu-item index="wordShow">
            <i class="el-icon-menu"></i>
            <span slot="title">文档结构查看</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "wordsynLeft",
  data() {
    return {
      activeIndex: "modelFile"
    };
  },
  mounted: function() {
    let mm = this.$route.params;
    var roleId = mm.passRoldId;
    this.changeHighLight();
  },
  methods: {
    handleOpen(key, keyPath) {
      //console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      //console.log(key, keyPath);
    },
    handleSelect(index) {
      this.activeIndex = index;
    },
    changeHighLight() {
      const { name } = this.$route;
      switch (name) {
        case "modelFile":
          this.handleSelect("modelFile");
          break;
        case "docFile":
          this.handleSelect("docFile");
          break;
        case "wordShow":
          this.handleSelect("wordShow");
          break;
        case "compareFile":
          this.handleSelect("compareFile");
          break;
      }
    }
  },
  watch: {
    $route() {
      this.changeHighLight();
    }
  }
};
</script>

<style scoped>
.div_foot {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>