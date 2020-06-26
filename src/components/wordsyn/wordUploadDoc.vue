<template>
  <div>
    <el-select v-model="value" placeholder="请选择" style="margin:30px">
      <el-option v-for="item in options" :key="item.id" :label="item.fileName" :value="item.id"></el-option>
    </el-select>
    <el-upload
      class="img-upload"
      ref="upload"
      :action="uploadURL"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :before-upload="checkFileType"
      :on-success="handleSuccess"
      :on-progress="uploading"
      :limit="1"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :data="{modelFileId:value,uploaderName:this.$store.state.user.username}"
    >
      <el-button size="small" type="primary">点击上传待检测文件</el-button>
      <div slot="tip" class="el-upload__tip" style="margin-top:20px">只能上传doc/docx文件</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "wordUploadDoc",
  data() {
    return {
      fileList: [],
      url: "",
      modelFileId: "",
      options: [],
      value: "",
      uploadURL: this.$baseURL + "/wordsyn/file/uploadFile/docFile"
    };
  },
  mounted: function() {
    this.value = "";
    var _this = this;
    this.$axios.get("/wordsyn/file/modelFile/all").then(resp => {
      if (resp && resp.status === 200) {
        _this.options = resp.data.result;
      }
    });
  },
  methods: {
    handleRemove(file, fileList) {},
    handlePreview(file) {},
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {},
    handleSuccess(response) {
      this.url = response;
      this.$emit("onUpload");
      this.$message.warning("上传成功");
    },
    clear() {
      this.$refs.upload.clearFiles();
    },
    checkFileType(file) {
      const fileType = file.type;
      var isWord = false;
      if (
        fileType ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileType == "application/msword"
      )
        //判断是不是doc或者docx文件类型
        isWord = true;
      if (!isWord) {
        this.$message.error("请上传word文件，文件后缀为doc/docx");
      }
      return isWord;
    },
    uploading(event, file, fileList) {
      this.$message.warning("上传中，请稍后");
    }
  }
};
</script>