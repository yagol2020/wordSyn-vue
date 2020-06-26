<template>
  <div>
    <div>
      <el-button
        type="primary"
        style="float:left;margin-bottom:10px"
        @click="dialogFormVisible = true"
      >上传文件</el-button>
      <el-dialog title="上传待检测文件" :visible.sync="dialogFormVisible" @close="reLoad()">
        <word-Upload-doc></word-Upload-doc>
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
          <span style="margin-left: 10px">{{ scope.row.data.docFileUpdateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件信息" width="280">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>文件名称: {{ scope.row.data.docFileName }}</p>
            <p
              v-on:click="showUser(scope.row.data.docFileUploader)"
            >上传者: {{ scope.row.data.docFileUploader }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.data.docFileName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="对应模板文件" width="280">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>文件名称: {{ scope.row.data.modelFileName }}</p>
            <p
              v-on:click="showUser(scope.row.data.modelFileUploader)"
            >上传者: {{ scope.row.data.modelFileUploader }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.data.modelFileName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="anyDocFile(scope.$index,scope.row.data)"
            :disabled="scope.row.isAny"
          >分析</el-button>
          <el-dialog title="查看比较结果" :visible.sync="comapreTableVisible">
            <compareResultTable :tableData="compareTableData" :tableStyle="{width:'600px'}"></compareResultTable>
          </el-dialog>
          <el-button size="mini" @click="handleChack(scope.$index, scope.row.data)">查看</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="showModelFileList(scope.$index, scope.row)"
          >设置模板</el-button>
          <el-dialog title="设置模板文件" :visible.sync="settingModelFileFormVisible">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.fileName"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-button
              style="margin:10px"
              type="primary"
              size="mini"
              @click="setModelFile(scope.$index,scope.row.data)"
            >确定</el-button>
          </el-dialog>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row.data)"
            :disabled="scope.row.isDelete"
          >删除</el-button>
          <el-button size="mini" @click="compare2Xml(scope.$index, scope.row.data)">比较</el-button>
          <el-button size="mini" @click="downloadDocFile(scope.$index, scope.row.data)">原文档下载</el-button>
          <el-button
            size="mini"
            @click="addCommentAndDownload(scope.$index, scope.row.data)"
          >添加批注并下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import wordUploadDoc from "./wordUploadDoc";
import compareResultTable from "./compareResultTable";
import userProfile from "./userProfile";
export default {
  components: {
    wordUploadDoc,
    compareResultTable,
    userProfile
  },
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      comapreTableVisible: false,
      settingModelFileFormVisible: false,
      options: [],
      value: "",
      selectDocId: "",
      downloadURL: "",
      compareTableData: [],
      showUserProfile: false,
      showProfileComponentsUploader: ""
    };
  },
  //页面加载时，自动执行
  mounted: function() {
    if (this.$store.state.roldId == -1) {
      this.$router.push("/login");
    }
    //console.log("docFile:roleId:" + this.$store.state.roldId);
    this.loadDocList();
  },
  methods: {
    showUser(uploader) {
      this.showUserProfile = true;
      this.showProfileComponentsUploader = uploader;
    },
    reLoad() {
      this.loadDocList();
    },
    handleChack(index, row) {
      if (!row.docXmlFileLocation) {
        this.$notify.error({
          title: "错误",
          message: "文件未进行分析，请先点击“分析”按钮"
        });
        return;
      }
      //console.log(index, row);
      this.$router.push({
        path: "/wordShow",
        name: "wordShow",
        params: {
          classification: "docFile",
          id: row.docFileId
        }
      });
    },
    anyDocFile(index, row) {
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
          classification: "DocFile",
          id: row.docFileId
        }
      }).then(resp => {
        if (resp && resp.status === 200) {
          this.$notify({
            title: "分析成功",
            message: "文件分析成功，可点击“查看”按钮，查看文档结构",
            type: "success"
          });
          this.loadDocList();
        }
      });
    },
    handleDelete(index, row) {
      var _this = this;
      this.$axios({
        method: "post",
        url: "/wordsyn/file/deleteFile/",
        params: {
          classification: "DocFile",
          id: row.docFileId
        }
      }).then(resp => {
        if (resp && resp.status === 200) {
          this.$notify({
            title: "删除成功",
            message: "文件删除成功",
            type: "success"
          });
          this.loadDocList();
        }
      });
    },
    loadDocList() {
      this.tableData = [];
      var _this = this;
      this.$axios.get("/wordsyn/file/docFile/all").then(resp => {
        if (resp && resp.status === 200) {
          if (this.$store.state.roldId == 2) {
            //如果你是模板文件管理员，你可以操作所有的文件
            for (let l = 0; l < resp.data.result.length; l++) {
              _this.tableData.push({
                data: resp.data.result[l],
                isAny: false,
                isDelete: false
              });
            }
            return;
          }
          for (let l = 0; l < resp.data.result.length; l++) {
            if (
              resp.data.result[l].docFileUploader ==
              this.$store.state.user.username
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
          //console.log(this.tableData);
        }
      });
    },
    showModelFileList(index, row) {
      //console.log(row);
      this.selectDocId = "";
      this.value = "";
      this.settingModelFileFormVisible = true;
      var _this = this;
      this.$axios.get("/wordsyn/file/modelFile/all").then(resp => {
        if (resp && resp.status === 200) {
          _this.options = resp.data.result;
        }
      });
      // console.log(row.selectDocId);
      this.selectDocId = row.data.docFileId;
    },
    setModelFile(index, row) {
      //console.log(this.selectDocId);
      //console.log(this.value);
      var _this = this;
      this.$axios({
        method: "post",
        url: "/wordsyn/file/update/docFilesModelFile/",
        params: {
          docFileId: this.selectDocId,
          modelFileId: this.value
        }
      }).then(resp => {
        if (resp && resp.status === 200) {
          this.loadDocList();
        }
      });
    },
    compare2Xml(index, row) {
      var _this = this;
      this.$axios({
        method: "post",
        url: "/wordsyn/compare/compare2Xml/",
        params: {
          docFileId: row.docFileId,
          modelFileId: row.modelFileId
        }
      }).then(resp => {
        //console.log(resp);
        if (resp && resp.data.code === 200) {
          this.loadDocList();
          this.$notify({
            title: "比较成功",
            message: "文件比较成功，生成的结果请到左侧“文件检测功能”查看",
            type: "success"
          });
          this.comapreTableVisible = true;
          //console.log(resp.data);
          this.compareTableData = [];
          this.compareTableData.push({
            key: "错误标题个数",
            value: resp.data.result[0]
          });
          this.compareTableData.push({
            key: "错误位置个数",
            value: resp.data.result[1]
          });
          this.compareTableData.push({
            key: "错误样式个数",
            value: resp.data.result[2]
          });
          this.compareTableData.push({
            key: "缺少大纲等级个数",
            value: resp.data.result[3]
          });
          this.compareTableData.push({
            key: "缺少段落个数",
            value: resp.data.result[4]
          });
          this.compareTableData.push({
            key: "多余段落个数",
            value: resp.data.result[5]
          });
          //console.log(this.compareTableData);
        } else {
          if (resp && resp.data.code == 400) {
            this.$notify.error({
              title: "错误",
              message: "文件比较失败，错误信息为" + resp.data.message
            });
          }
        }
      });
    },
    addCommentAndDownload(index, row) {
      //console.log(row);
      if (!row.compareFilePath) {
        this.$notify.error({
          title: "错误",
          message: "无法添加批注，请先进行比较"
        });
        return;
      }
      if (row.compareDocWordFileLocation) {
        var url =
          this.$baseURL +
          "/wordsyn/file/downloadFile?path=" +
          row.compareDocWordFileLocation;
        this.$notify({
          title: "开始下载",
          message: "添加批注成功，即将开始下载批注文件",
          type: "success"
        });
        this.downloadURL = encodeURI(url);
        let a = document.createElement("a");
        a.href = this.downloadURL;
        a.click();
      } else {
        this.$notify({
          title: "服务器：正在添加批注",
          message: "服务器正在生成批注文件，请稍后",
          type: "success"
        });
        this.$axios({
          method: "get",
          url: "/wordsyn/file/addComment/",
          params: {
            docFileId: row.docFileId
          }
        }).then(resp => {
          this.loadDocList();
          this.$notify({
            title: "服务器：批注添加完成",
            message: "添加批注成功，重新点击开始下载批注文件",
            type: "success"
          });
        });
      }
    },
    downloadDocFile(index, row) {
      //console.log(row);
      var url =
        this.$baseURL +
        "/wordsyn/file/downloadDocFile?path=" +
        row.fileLocation;
      this.$notify({
        title: "开始下载",
        message: "即将开始下载原文档",
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