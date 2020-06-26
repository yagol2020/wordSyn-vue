<template>
  <el-card class="box-card">
    <el-row>
      <el-col :span="12">
        <div>上传者姓名：</div>
        <p></p>
      </el-col>

      <el-col :span="12">
        <div>{{uploader}}</div>
        <p></p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div>电话号码：</div>
        <p></p>
      </el-col>

      <el-col :span="12">
        <div>{{phoneNumber}}</div>
        <p></p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div>电子邮件：</div>
      </el-col>
      <el-col :span="12">
        <div>{{email}}</div>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  name: "userProfile",
  props: ["uploader"],
  data() {
    return { phoneNumber: "", email: "" };
  },
  mounted: function() {
    this.$axios({
      method: "get",
      url: "/user/get",
      params: {
        username: this.uploader
      }
    }).then(resp => {
      if (resp && resp.status === 200) {
        //console.log(resp.data.result);
        this.phoneNumber = resp.data.result.phone;
        this.email = resp.data.result.email;
      }
    });
  }
};
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  margin: 0 auto;
  width: 480px;
}
</style>