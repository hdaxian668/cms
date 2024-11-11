<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/app-version/list' }">App版本管理</el-breadcrumb-item>
        <el-breadcrumb-item>版本資料</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="appVersion" 
        :model="appVersion" 
        :rules="rules"
        v-loading="loading"
        element-loading-text="數據加載中"
        label-position="left" label-width="160px">
      <el-form-item label="OS" prop="os">
        <el-radio-group v-model="appVersion.os">
          <el-radio-button :label="0">iOS</el-radio-button>
          <el-radio-button :label="1">Android</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="版本號" prop="build_version">
        <el-input v-model="appVersion.build_version" placeholder="版本號"></el-input>
      </el-form-item>
      <el-form-item label="強制更新" prop="force_update">
        <el-radio-group v-model="appVersion.force_update">
          <el-radio-button :label="1">Yes</el-radio-button>
          <el-radio-button :label="0">No</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="更新內容" prop="release_note">
        <el-input v-model="appVersion.release_note"
          type="textarea"
          :rows="5"
          placeholder="更新內容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit" >保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { baseVanke } from '@/util/index';
  import { saveItem } from '@/api/appVersion/appVersionDetail';

  export default {
    name: "appVersionDetail",
    components:{

    },
    data() {
        return {
          id: '',
          loading: false,
          submitLoading: false,

          appVersion: {
            id: '',
            os: '0',
            build_version: '',
            force_update: '0',
            release_note: '',
          },

          rules: {
            os: [
              { required: true, message: '請輸入OS', trigger: 'blur' }
            ],
            build_version: [
              { required: true, message: '請輸入版本號', trigger: 'blur' }
            ],
            force_update: [
              { required: true, message: '請輸入強制更新', trigger: 'blur' }
            ],
          }
        }
    },
    mounted() {
    },
    activated() {

    },
    deactivated() {
      this.initDetail();
    },
    methods: {
      initDetail() {
        this.appVersion = {
          id: '',
          os: '0',
          build_version: '',
          force_update: '0',
          release_note: '',
        };
        this.$refs.appVersion.resetFields();
      },
      async handleSubmit() {
        const self = this;
        this.$refs.appVersion.validate((valid)=>{
          if(!valid) {
            self.$message.error('表單填寫有誤！');
            return false;
          }
          this.$confirm('此操作將修改版本資料且不可撤銷, 是否继续?', '警告', { confirmButtonText: '確定', cancelButtonText: '取消', type: 'warning' })
          .then(() => {
            this.submitLoading = true;
            let data = {
              os: (this.appVersion.os == 0) ? 'iOS' : 'Android',
              build_version: this.appVersion.build_version,
              force_update: this.appVersion.force_update,
              release_note: this.appVersion.release_note,
            };
            saveItem(data)
              .then(() => {
                self.submitLoading = false;
                self.$message({
                  message: '保存成功',
                  type: 'success'
                });
                self.$router.push('/app-version/list');
              })
              .catch(function(error) {
                self.$message.error(error.message)
              }).finally(function() {
                self.submitLoading = false;
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  .region-line {
    display: flex;
  }
  .region-line .el-input {
    flex:1;
    &:nth-of-type(1) {
      margin-right: 10px;
    }
  }
  .el-tag {
    margin-right: 10px;
  }
</style>



// WEBPACK FOOTER //
// src/components/appVersion/appVersionDetail.vue