<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/customer/list'} ">會員管理</el-breadcrumb-item>
        <el-breadcrumb-item >會員註冊設置</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form :model="setting" ref="setting"  v-loading="loading" label-width="200px">
      <el-form-item
        label="上傳關注facebook圖片"
        prop="facebook">
        <el-switch v-model="setting.facebook"
                   active-color="#409eff"
                   inactive-color="#c0c4cc">
      </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="submitLoading" @click="submitRegSetting()">提交</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import {
    getSettingStatus,
    saveSettingStatus,
  } from '@/api/member/memberRegSetting';
    export default {
      name: "memberRegSetting",
      data() {
        return {
          loading: false,
          submitLoading: false,
          setting: {
            facebook: false,
          }
        }
      },
      activated() {
        this.loading = true;
        const self = this;
        // (status为0未停用，1为启用)
        getSettingStatus().then(function(response){
          self.loading = false;
          console.log(response)
          self.setting.facebook = response.data.data.status == '1'? true : false;
        }).catch(function(error) {
          self.loading = false;
          self.$message.error(error.message);
        });
      },
      deactivated() {
        this.resetForm('setting');
      },
      methods: {
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        // 保存设置
        submitRegSetting() {
          this.submitLoading = true;
          let status = this.setting.facebook ? 1: 0;
          saveSettingStatus(status).then(()=> {
            this.submitLoading = false;
            this.$message({
              type: 'success',
              message: '設置成功',
            });
          }).catch((err)  => {
            this.submitLoading = false;
            this.$message.error(err.message);
          })
        },
      }
    }
</script>

<style scoped>

</style>



// WEBPACK FOOTER //
// src/components/member/memberRegSetting.vue