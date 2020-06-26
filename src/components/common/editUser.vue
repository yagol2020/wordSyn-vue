<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="姓名">
      <el-input v-model="form.name" disabled></el-input>
    </el-form-item>
    <el-form-item label="电话号码">
      <el-input v-model="form.phone"></el-input>
    </el-form-item>
    <el-form-item label="电子邮箱">
      <el-input v-model="form.email"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">修改</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: "editUser",
  props: ["username"],
  data() {
    return {
      form: {
        name: "",
        phone: "",
        email: ""
      }
    };
  },
  mounted: function() {
    this.form.name = this.username;
    this.loadForm();
  },
  methods: {
    loadForm() {
      this.form.name = this.username;
      this.$axios({
        method: "get",
        url: "/user/get",
        params: {
          username: this.username
        }
      }).then(resp => {
        if (resp && resp.status === 200) {
          this.form.phone = resp.data.result.phone;
          this.form.email = resp.data.result.email;
        }
      });
    },
    onSubmit() {
      var error = false;
      var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      var regPhone = /^1[3456789]\d{9}$/;
      if (this.form.email != "" && !regEmail.test(this.form.email)) {
        this.$message({
          message: "邮箱格式不正确",
          type: "error"
        });
        error = true;
      }
      if (this.form.phone != "" && !regPhone.test(this.form.phone)) {
        this.$message({
          message: "手机不正确",
          type: "error"
        });
        error = true;
      }
      if (error) {
        return;
      }
      this.$axios({
        method: "put",
        url: "/user/edit",
        params: {
          username: this.username,
          phone: this.form.phone,
          email: this.form.email
        }
      }).then(resp => {
        if (resp && resp.status === 200) {
          this.$message({
            title: "修改成功",
            message: "修改成功，请关闭本窗口",
            type: "success"
          });
        }
      });
      this.loadForm;
    }
  }
};
</script>