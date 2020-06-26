<template>
  <div style="margin:20px">
    <el-select v-model="value" placeholder="请选择">
      <el-option v-for="item in options" :key="item.id" :label="item.fileName" :value="item.id"></el-option>
    </el-select>
    <el-button style="margin:10px" type="primary" size="mini" @click="setModelFile()">确定</el-button>
  </div>
</template>

<script>
export default {
  name: "modelFileList",
  data() {
    return {
      options: [],
      value: ""
    };
  },
  mounted: function() {
    var _this = this;
    this.$axios.get("/wordsyn/file/modelFile/all").then(resp => {
      if (resp && resp.status === 200) {
        _this.options = resp.data.result;
      }
    });
  },
  methods: {
    setModelFile() {}
  }
};
</script>