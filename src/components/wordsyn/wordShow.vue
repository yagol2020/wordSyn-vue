<template>
  <div>
    <el-popover
      ref="popover"
      placement="right"
      width="200"
      trigger="click"
      v-model="popoverVisible"
    >
      <div>
        <div v-show="lackParagraphRootDiv">
          一级标题中缺少结构
          <el-input v-model="popoverData.lackParagraphRoot" placeholder="缺少一级标题结构" :disabled="true"></el-input>
        </div>
        <div v-show="lackParagraphDiv">
          缺少的结构
          <el-input v-model="popoverData.lackParagraph" placeholder="缺少结构" :disabled="true"></el-input>
        </div>
        <div v-show="rightTitleDiv">
          正确的标题
          <el-input v-model="popoverData.rightTitle" placeholder="正确标题" :disabled="true"></el-input>
        </div>
        <div v-show="rightPositonDiv">
          正确的位置
          <el-input v-model="popoverData.rightPosition" placeholder="正确位置" :disabled="true"></el-input>
        </div>
        <div v-show="moreDiv">
          多余节点
          <el-input v-model="popoverData.more" placeholder="多余节点" :disabled="true"></el-input>
        </div>
        <div v-show="lackLevelDiv">
          缺少大纲等级
          <el-input v-model="popoverData.lackLevel" placeholder="缺少大纲等级" :disabled="true"></el-input>
        </div>
      </div>
    </el-popover>
    <el-tree
      :data="data"
      :props="defaultProps"
      @node-click="handleNodeClick"
      v-popover:popover
      :highlight-current="true"
    ></el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      popoverVisible: false,
      popoverData: {
        lackParagraph: "",
        rightTitle: "",
        rightPosition: "",
        more: "",
        lackParagraphRoot: "",
        lackLevel: ""
      }, //v-bind可以动态绑定数据
      lackParagraphDiv: false,
      rightTitleDiv: false,
      rightPositonDiv: false,
      moreDiv: false,
      lackParagraphRootDiv: false,
      lackLevelDiv: false
    };
  },
  //页面加载时，自动执行
  mounted: function() {
    let mm = this.$route.params;
    this.loadTree(mm.classification, mm.id);
  },
  methods: {
    handleNodeClick(data) {
      //console.log(data);
      this.popoverData = {
        lackParagraph: "",
        rightTitle: "",
        rightPosition: "",
        more: "",
        lackParagraphRoot: ""
      };
      (this.popoverVisible = false),
        (this.lackParagraphDiv = false),
        (this.rightTitleDiv = false),
        (this.rightPositonDiv = false),
        (this.lackParagraphRootDiv = false),
        (this.moreDiv = false),
        (this.lackLevelDiv = false);

      var lackParagraphInData = data.lackParagraph;
      var rightPositionInData = data.rightPosition;
      var rightTitleInData = data.rightTitle;
      var moreInData = data.more;
      var lackParagraphRootInData = data.lackParagraphInRoot;
      var lackLevelInData = data.lackLevel;
      var flag = false;

      if (lackParagraphRootInData) {
        this.popoverData.lackParagraphRoot = lackParagraphRootInData;
        this.lackParagraphRootDiv = true;
        flag = true;
      }
      if (lackParagraphInData) {
        this.popoverData.lackParagraph = lackParagraphInData;
        this.lackParagraphDiv = true;
        flag = true;
      }
      if (rightPositionInData) {
        this.popoverData.rightPosition = rightPositionInData;
        this.rightPositonDiv = true;
        flag = true;
      }
      if (rightTitleInData) {
        this.popoverData.rightTitle = rightTitleInData;
        this.rightTitleDiv = true;
        flag = true;
      }
      if (moreInData) {
        this.popoverData.more = "该段落为多余段落";
        this.moreDiv = true;
        flag = true;
      }
      if (lackLevelInData) {
        this.popoverData.lackLevel = "缺少大纲等级";
        this.lackLevelDiv = true;
        flag = true;
      }

      if (flag) {
        this.popoverVisible = true;
      }
    },
    clearTreeData() {
      this.data = [];
    },
    loadCompareTree(id) {
      this.clearTreeData();
      var _this = this;
      this.$axios({
        methods: "get",
        url: "/wordsyn/xml/compareFile",
        params: {
          id: id
        }
      }).then(resp => {
        if (resp && resp.status === 200) {
          var xmlText = resp.data.result;
          var realXml = xmlText.substring(41, xmlText.length);
          var jsonObj = this.$x2js.xml2js(realXml);
          this.dealCompareData(jsonObj);
        }
      });
      //TODO 变色
    },
    dealCompareData(json) {
      //console.log(json);
      var jsonDoc = json.doc;
      var chapter1 = jsonDoc.chapter1;
      var that = this;
      var lackParagraphRoot = jsonDoc._lackParagraph; //1级标题，就是主标题，缺少的内容
      var chapter1Length = chapter1.length;
      if (!chapter1Length) {
        chapter1Length = 1;
      }
      for (let i = 0; i < chapter1Length; i++) {
        var element1 = chapter1[i];
        if (chapter1Length == 1) {
          element1 = chapter1;
        }
        var title1 = element1.title;
        var rightTitle1 = element1._rightTitle; //该标题，正确的标题内容
        var lackParagraph1 = element1._lackParagraph; //第一级标题下，缺少的内容
        var rightPosition1 = element1._rightPosition; //改标题的正确位置
        var more1 = element1._more; //得到more标记，记录是否是多余节点
        var chapter2 = element1.chapter2;
        if (chapter2 == null) {
          if (i == 0) {
            that.data.push({
              label: title1,
              children: [],
              rightTitle: rightTitle1,
              lackParagraph: lackParagraph1,
              rightPosition: rightPosition1,
              more: more1,
              lackParagraphInRoot: lackParagraphRoot
            });
          } else {
            that.data.push({
              label: title1,
              children: [],
              rightTitle: rightTitle1,
              lackParagraph: lackParagraph1,
              rightPosition: rightPosition1,
              more: more1
            });
          }
          continue;
        }
        var tempData2 = [];
        var chapter2Length = chapter2.length;
        if (!chapter2Length) {
          chapter2Length = 1;
        }
        for (let j = 0; j < chapter2Length; j++) {
          var element2 = chapter2[j];
          if (chapter2Length == 1) {
            element2 = chapter2;
          }
          var title2 = element2.title;
          var rightTitle2 = element2._rightTitle; //该标题，正确的标题内容
          var lackParagraph2 = element2._lackParagraph; //第一级标题下，缺少的内容
          var rightPosition2 = element2._rightPosition; //改标题的正确位置
          var more2 = element2._more; //得到more标记，记录是否是多余节点
          var chapter3 = element2.chapter3;
          if (chapter3 == null) {
            tempData2.push({
              label: title2,
              children: [],
              rightTitle: rightTitle2,
              lackParagraph: lackParagraph2,
              rightPosition: rightPosition2,
              more: more2
            });
            continue;
          }
          var tempData3 = [];
          var chapter3Length = chapter3.length;
          if (!chapter3Length) {
            chapter3Length = 1;
          }
          for (let m = 0; m < chapter3Length; m++) {
            var element3 = chapter3[m];
            if (chapter3Length == 1) {
              element3 = chapter3;
            }
            var title3 = element3.title;
            var rightTitle3 = element3._rightTitle; //该标题，正确的标题内容
            var lackParagraph3 = element3._lackParagraph; //第一级标题下，缺少的内容
            var rightPosition3 = element3._rightPosition; //改标题的正确位置
            var more3 = element3._more; //得到more标记，记录是否是多余节点
            var chapter4 = element3.chapter4;
            if (chapter4 == null) {
              tempData3.push({
                label: title3,
                children: [],
                rightTitle: rightTitle3,
                lackParagraph: lackParagraph3,
                rightPosition: rightPosition3,
                more: more3
              });
              continue;
            }
            var tempData4 = [];
            var chapter4Length = chapter4.length;
            if (!chapter4Length) {
              chapter4Length = 1;
            }
            for (let n = 0; n < chapter4Length; n++) {
              var element4 = chapter4[n];
              if (chapter4Length == 1) {
                element4 = chapter4;
              }
              var rightTitle4 = element4._rightTitle; //该标题，正确的标题内容
              var lackParagraph4 = element4._lackParagraph; //第一级标题下，缺少的内容
              var rightPosition4 = element4._rightPosition; //改标题的正确位置
              var more4 = element4._more; //得到more标记，记录是否是多余节点
              var title4 = element4.title;
              tempData4.push({
                label: title4,
                children: [],
                rightTitle: rightTitle4,
                lackParagraph: lackParagraph4,
                rightPosition: rightPosition4,
                more: more4
              });
            }
            tempData3.push({
              label: title3,
              children: tempData4,
              rightTitle: rightTitle3,
              lackParagraph: lackParagraph3,
              rightPosition: rightPosition3,
              more: more3
            });
          }
          tempData2.push({
            label: title2,
            children: tempData3,
            rightTitle: rightTitle2,
            lackParagraph: lackParagraph2,
            rightPosition: rightPosition2,
            more: more2
          });
        }
        if (i == 0) {
          that.data.push({
            label: title1,
            children: tempData2,
            rightTitle: rightTitle1,
            lackParagraph: lackParagraph1,
            rightPosition: rightPosition1,
            more: more1,
            lackParagraphInRoot: lackParagraphRoot
          });
        } else {
          that.data.push({
            label: title1,
            children: tempData2,
            rightTitle: rightTitle1,
            lackParagraph: lackParagraph1,
            rightPosition: rightPosition1,
            more: more1
          });
        }
      }
      //console.log(json.doc.paragraph);
      var paragraphLength = json.doc.paragraph.length;
      if (!paragraphLength) {
        paragraphLength = 1;
      }
      for (let k = 0; k < paragraphLength; k++) {
        var p = json.doc.paragraph[k];
        if (paragraphLength == 1) {
          p = json.doc.paragraph;
        }
        if (p._rightPosition) {
          that.data.push({
            label: p.title,
            children: p.children,
            rightTitle: p._rightTitle,
            lackParagraph: p._lackParagraph,
            rightPosition: p._rightPosition,
            more: p._more,
            lackLevel: true
          });
        }
      }
    },

    loadTree(classification, id) {
      this.clearTreeData();
      switch (classification) {
        case "modelFile":
          var _this = this;
          this.$axios({
            methods: "get",
            url: "/wordsyn/xml/modelFile",
            params: {
              id: id
            }
          }).then(resp => {
            if (resp && resp.status === 200) {
              var xmlText = resp.data.result;
              var realXml = xmlText.substring(40, xmlText.length);
              var jsonObj = this.$x2js.xml2js(realXml);
              //console.log(xmlText);
              this.dealData(jsonObj.doc);
            }
          });
          break;
        case "docFile":
          var _this = this;
          this.$axios({
            methods: "get",
            url: "/wordsyn/xml/docFile",
            params: {
              id: id
            }
          }).then(resp => {
            if (resp && resp.status === 200) {
              var xmlText = resp.data.result;
              var realXml = xmlText.substring(41, xmlText.length);
              var jsonObj = this.$x2js.xml2js(realXml);
              //console.log(jsonObj);
              this.dealData(jsonObj.doc);
            }
          });
          break;
      }
    },
    dealData(json) {
      var chapter1 = json.chapter1;
      var that = this;
      var chapter1Length = chapter1.length;
      if (!chapter1Length) {
        chapter1Length = 1;
      }
      for (let i = 0; i < chapter1Length; i++) {
        var element1 = chapter1[i];
        if (chapter1Length == 1) {
          element1 = chapter1;
        }
        var title1 = element1.title;
        var chapter2 = element1.chapter2;
        if (chapter2 == null) {
          that.data.push({
            label: title1,
            children: []
          });
          continue;
        }
        var tempData2 = [];
        var chapter2Length = chapter2.length;
        if (!chapter2Length) {
          chapter2Length = 1;
        }
        for (let j = 0; j < chapter2Length; j++) {
          var element2 = chapter2[j];
          if (chapter2Length == 1) {
            element2 = chapter2;
          }
          var title2 = element2.title;
          var chapter3 = element2.chapter3;
          if (chapter3 == null) {
            tempData2.push({
              label: title2,
              children: []
            });
            continue;
          }
          var tempData3 = [];
          var chapter3Length = chapter3.length;
          if (!chapter3Length) {
            chapter3Length = 1;
          }
          for (let m = 0; m < chapter3Length; m++) {
            var element3 = chapter3[m];
            if (chapter3Length == 1) {
              element3 = chapter3;
            }
            var title3 = element3.title;
            var chapter4 = element3.chapter4;
            if (chapter4 == null) {
              tempData3.push({
                label: title3,
                children: []
              });
              continue;
            }
            var tempData4 = [];
            var chapter4Length = chapter4.length;
            if (!chapter4Length) {
              chapter4Length = 1;
            }
            for (let n = 0; n < chapter4Length; n++) {
              var element4 = chapter4[n];
              if (chapter4Length == 1) {
                element4 = chapter4;
              }
              var title4 = element4.title;
              tempData4.push({
                label: title4,
                children: []
              });
            }
            tempData3.push({
              label: title3,
              children: tempData4
            });
          }
          tempData2.push({
            label: title2,
            children: tempData3
          });
        }
        that.data.push({
          label: title1,
          children: tempData2
        });
      }
    }
  }
};
</script>