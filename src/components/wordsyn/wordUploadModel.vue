<template>
  <el-upload
    class="img-upload"
    ref="upload"
    :action="uploadURL"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :on-success="handleSuccess"
    :before-upload="checkFileType"
    :limit="1"
    :on-exceed="handleExceed"
    :file-list="fileList"
    :data="{uploaderName:this.$store.state.user.username}"
  >
    <el-button size="small" type="primary">点击上传模板文件</el-button>
    <div slot="tip" class="el-upload__tip" style="margin-top:20px">只能上传doc/docx文件</div>
  </el-upload>
</template>

<script>
export default {
  name: "wordUploadModel",

  data() {
    return {
      fileList: [],
      url: "",
      uploadURL: this.$baseURL + "/wordsyn/file/uploadFile/modelFile"
    };
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
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${file.name}？`);
    },
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
        isWord = true;
      //console.log("isWord:" + isWord);
      if (!isWord) {
        this.$message.error("请上传word文件，文件后缀为doc/docx");
      }
      //console.log("不上传");
      return isWord;
    }
  }
};
</script>