<template>
  <div style="margin-top:50px">
    <el-row>
      <el-col :span="12">
        <div>
          <el-select v-model="valueModel" placeholder="请选择模板文档">
            <el-option
              v-for="item in optionsModel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <el-select v-model="valueDoc" placeholder="请选择待检测文档">
            <el-option
              v-for="item in optionsDoc"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
    <div>
      <el-button type="success" round style="margin-top:50px" @click="compare()">查看比较文档结果</el-button>
    </div>
    <div v-show="wordShowVisible">
      <el-row style="margin-top:20px">
        <el-col :span="11" style="margin:10px">
          <div class="grid-content bg-purple">
            <word-show-model ref="wordShowModelRef"></word-show-model>
          </div>
        </el-col>
        <el-col :span="11" style="margin:10px">
          <div class="grid-content bg-purple-light">
            <word-show-doc ref="wordShowDocRef"></word-show-doc>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import wordShowModel from "./wordShow";
import wordShowDoc from "./wordShow";
export default {
  components: {
    wordShowModel,
    wordShowDoc
  },
  data() {
    return {
      optionsModel: [],
      optionsDoc: [],
      valueModel: "",
      valueDoc: "",
      wordShowVisible: false
    };
  },
  mounted: function() {
    this.loadModelSelectList();
    this.loadDocSelectList();
  },
  methods: {
    loadModelSelectList() {
      var _this = this;
      this.$axios.get("/wordsyn/file/modelFile/all").then(resp => {
        if (resp && resp.status === 200) {
          //console.log(resp);
          for (let i = 0; i < resp.data.result.length; i++) {
            if (!resp.data.result[i].xmlFileLocation) {
              continue;
            }
            _this.optionsModel.push({
              label: resp.data.result[i].fileName,
              value: resp.data.result[i].id
            });
          }
        }
      });
    },
    loadDocSelectList() {
      if (!this.optionsModel) {
        this.$message.error("请先选择需要查看的模板文档");
        return;
      }
      var _this = this;
      this.$axios.get("/wordsyn/file/docFile/all").then(resp => {
        if (resp && resp.status === 200) {
          for (let i = 0; i < resp.data.result.length; i++) {
            if (resp.data.result[i].compareAble == false) {
              continue;
            }
            _this.optionsDoc.push({
              label: resp.data.result[i].docFileName,
              value: resp.data.result[i].docFileId
            });
          }
        }
      });
    },
    compare() {
      var modelFileId = this.valueModel;
      var docFileId = this.valueDoc;
      if (modelFileId == "") {
        this.$message.error("请先选择需要查看的模板文档");
        return;
      }
      if (docFileId == "") {
        this.$message.error("请先选择需要查看的检测文档");
        return;
      }
      this.$refs.wordShowModelRef.loadTree("modelFile", modelFileId);
      this.$refs.wordShowDocRef.loadCompareTree(docFileId);
      this.wordShowVisible = true;
      //TODO
    }
  }
};
</script>