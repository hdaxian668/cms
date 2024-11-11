<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>系統郵箱</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="email"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="email" :rules="rules"
             label-position="left" label-width="120px">
      <el-form-item label="收件郵箱" prop="receive_email">
        <el-input v-model="email.receive_email" placeholder="請輸入收件郵箱"></el-input>
      </el-form-item>
      <!--<el-form-item label="發件郵箱" prop="send_email_user">-->
        <!--<el-input v-model="email.send_email_user"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="發件郵箱密碼" prop="send_email_pwd">-->
        <!--<el-input v-model="email.send_email_pwd"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item 
        v-if="EDIT">
        <el-button  type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    emailData,
    save
  } from '@/api/system/email';
    export default {
      name: "email",
      data() {
        return {
          loading: false,
          submitLoading: false,
          rules: {
            receive_email: [
              { required: true, message: '請輸入郵箱地址', trigger: 'blur'
              },
              { type: 'email', message: '請輸入正確的郵箱地址', trigger: ['blur', 'change']
              }
            ],
            send_email_user: [
              { required: true, message: '請輸入郵箱地址', trigger: 'blur'
              },
              { type: 'email', message: '請輸入正確的郵箱地址', trigger: ['blur', 'change']
              }
            ],
            send_email_pwd: [
              { required: true, message: '密碼不能為空'},
            ]
          },
          email: {
            receive_email: '',// 收件箱
            send_email_user: '',
            send_email_pwd: '',
          },
          VIEW: false,
          CREATE: false,
          EDIT: false,
          DELETE: false,
          EXPORT: false,
        }
      },
      activated() {
        // this.initDetail();
        this.getItemDetail();
      },
      deactivated() {
        this.initDetail();
      },
      methods: {
        /*
      * 初始化页面数据
      * */
        initDetail() {
          this.email = {
              receive_email: '',// 收件箱
              send_email_user: '',
              send_email_pwd: '',
          };
          this.$refs.email.clearValidate(); // 清空规则
        },
        /*
        * 获取当前页面的详细信息
        * */
        getItemDetail() {
          this.loading = true;
          const self = this;
          emailData().then(function(response){
            if (!response.data.VIEW) {
              self.$message.error('沒有權限！');
              return;
            }
            self.VIEW = response.data.VIEW;
            self.CREATE = response.data.CREATE;
            self.EDIT = response.data.EDIT;
            self.DELETE = response.data.DELETE;
            self.EXPORT = response.data.EXPORT;
            self.email = response.data.data || self.email;
          }).catch(function(error) {
            self.$message.error(error.message);
          }).finally(function() {
            self.loading = false;
          });
        },
        onSubmit() {
          this.$refs.email.validate((valid)=>{
            if(valid) {
              this.submitLoading = true;
              let data = {
                receive_email: this.email.receive_email,// 收件箱
                // send_email_user: this.email.send_email_user,
                // send_email_pwd: this.email.send_email_pwd,
              };
              save(data).then(()=>{
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                });
              }).catch((error)=>{
                this.$message.error(error.message);
              }).finally(()=> {
                this.submitLoading = false;
              });
            } else {
              this.$message.error('表單填寫有誤！');
              return false;
            }
          });

        },
      }
    }
</script>

<style scoped>
.el-input {
  width: 400px;
}
</style>



// WEBPACK FOOTER //
// src/components/system/email.vue