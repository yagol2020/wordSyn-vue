<template>
  <div>
    <el-menu
      :default-active="path"
      router
      mode="horizontal"
      background-color="white"
      text-color="#222"
      active-text-color="red"
      style="min-width: 1300px"
    >
      <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">{{ item.navItem }}</el-menu-item>
      <span
        style="position: absolute;padding-top: 20px;right: 43%;font-size: 20px;font-weight: bold"
      >文档检测</span>
      <!-- <el-input
        placeholder="快速搜索..."
        prefix-icon="el-icon-search"
        size="medium"
        style="width: 300px;position:absolute;margin-top: 12px;right: 18%"
        v-model="keywords"
      ></el-input>-->
      <el-tag style="width: 150px;position:absolute;margin-top: 20px;right: 18%">{{username}}</el-tag>
      <el-button
        @click.native="editUser(username)"
        style="margin-top: 20px;position:absolute;right: 10%;margin-left: 1050px;height:33px;font-size:5pt"
      >修改个人信息</el-button>
      <i
        class="el-icon-switch-button"
        v-on:click="logout"
        style="font-size: 40px;float: right;margin-top:10px"
      ></i>
    </el-menu>
    <div>
      <el-dialog title="修改个人信息" :visible.sync="editUserProfile">
        <editUser :username="editProfileComponentsUploader"></editUser>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import editUser from "./editUser";
export default {
  components: {
    editUser
  },
  name: "NavMenu",
  data() {
    return {
      navList: [
        {
          name: "/modelFile",
          navItem: "文档检测"
        }
      ],
      keywords: "",
      path: "",
      username: "",
      editUserProfile: false,
      editProfileComponentsUploader: ""
    };
  },
  mounted: function() {
    // 获得第一级路由，以设置导航栏高亮
    this.username = this.$store.state.user.username;
    var x = this.$route.path.indexOf("/", 1);
    if (x !== -1) {
      this.path = this.$route.path.substring(0, x);
    } else {
      this.path = this.$route.path;
    }
  },
  computed: {
    hoverBackground() {
      return "#ffd04b";
    }
  },
  methods: {
    editUser(username) {
      //console.log(username);
      this.editProfileComponentsUploader = username;
      this.editUserProfile = true;
    },
    logout() {
      var _this = this;
      this.$axios
        .get("/logout")
        .then(resp => {
          if (resp && resp.data.code === 200) {
            // _this.$store.commit('logout')
            _this.$router.replace("/login");
            // 清空路由，防止路由重复加载
            const newRouter = createRouter();
            _this.$router.matcher = newRouter.matcher;
          }
        })
        .catch(failResponse => {});
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}

span {
  pointer-events: none;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
