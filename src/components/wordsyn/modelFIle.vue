<template>
  <div>
    <div>
      <el-button
        type="primary"
        style="float:left;margin-bottom:10px"
        @click="dialogFormVisible = true"
        v-if="showUpLoadModelFileButton"
      >上传文件</el-button>
      <el-dialog title="上传模板文件" :visible.sync="dialogFormVisible" @close="reLoad()">
        <word-Upload-model></word-Upload-model>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="查看用户资料" :visible.sync="showUserProfile">
        <userProfile :uploader="showProfileComponentsUploader"></userProfile>
      </el-dialog>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="上传日期" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.data.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件信息" width="280">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>文件名称: {{ scope.row.data.fileName }}</p>
            <p v-on:click="showUser(scope.row.data.uploader)">上传者: {{ scope.row.data.uploader }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.data.fileName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="anyModelFile(scope.$index,scope.row.data)"
            :disabled="scope.row.isAny"
          >分析</el-button>
          <el-button size="mini" @click="handleChack(scope.$index, scope.row.data)">查看</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row.data)"
            :disabled="scope.row.isDelete"
          >删除</el-button>
          <el-button size="mini" @click="downloadModelFile(scope.$index, scope.row.data)">下载模板文档</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import wordUploadModel from "./wordUploadModel";
import userProfile from "./userProfile";
export default {
  components: {
    wordUploadModel,
    userProfile
  },
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      showUpLoadModelFileButton: false,
      showUserProfile: false,
      showProfileComponentsUploader: ""
    };
  },
  //页面加载时，自动执行
  mounted: function() {
    //console.log(this.$store.state.roldId);
    if (this.$store.state.roldId == -1) {
      this.$router.push("/login");
    }
    if (this.$store.state.roldId == 2) {
      this.showUpLoadModelFileButton = true;
    }
    this.loadModelList();
  },
  methods: {
    showUser(uploader) {
      this.showUserProfile = true;
      this.showProfileComponentsUploader = uploader;
      //console.log(uploader);
    },
    handleChack(index, row) {
      if (!row.xmlFileLocation) {
        this.$notify.error({
          title: "错误",
          message: "文件未进行分析，请先点击“分析”按钮"
        });
        return;
      }
      this.$router.push({
        path: "/wordShow",
        name: "wordShow",
        params: {
          classification: "modelFile",
          id: row.id
        }
      });
    },
    handleDelete(index, row) {
      var _this = this;
      this.$axios({
        method: "post",
        url: "/wordsyn/file/deleteFile/",
        params: {
          classification: "ModelFile",
          id: row.id
        }
      }).then(resp => {
        if (resp && resp.status === 200) {
          this.$notify({
            title: "删除成功",
            message: "文件删除成功",
            type: "success"
          });
          this.loadModelList();
        }
      });
    },
    anyModelFile(index, row) {
      this.$notify({
        title: "分析中",
        message: "文件分析中，请稍后，根据文件大小，可能需要一定时间",
        type: "success"
      });
      var _this = this;
      this.$axios({
        methods: "get",
        url: "/wordsyn/xml/any/",
        params: {
          classification: "ModelFile",
          id: row.id
        }
      }).then(resp => {
        if (resp && resp.status === 200) {
          this.$notify({
            title: "分析成功",
            message: "文件分析成功，可点击“查看”按钮，查看文档结构",
            type: "success"
          });
          this.loadModelList();
        }
      });
    },
    loadModelList() {
      var _this = this;
      _this.tableData = [];
      this.$axios.get("/wordsyn/file/modelFile/all").then(resp => {
        if (resp && resp.status === 200) {
          //console.log(resp.data.result);
          for (let l = 0; l < resp.data.result.length; l++) {
            if (
              resp.data.result[l].uploader == this.$store.state.user.username
            ) {
              _this.tableData.push({
                data: resp.data.result[l],
                isAny: false,
                isDelete: false
              });
            } else {
              _this.tableData.push({
                data: resp.data.result[l],
                isAny: true,
                isDelete: true
              });
            }
          }
        }
        //console.log(_this.tableData);
      });
    },
    reLoad() {
      this.loadModelList();
    },
    downloadModelFile(index, row) {
      //console.log(row);
      var url =
        this.$baseURL +
        "/wordsyn/file/downloadModelFile?path=" +
        row.fileLocation;
      this.$notify({
        title: "开始下载",
        message: "即将开始下载模板文件",
        type: "success"
      });
      this.downloadURL = encodeURI(url);
      let a = document.createElement("a");
      a.href = this.downloadURL;
      a.click();
    }
  }
};
</script>