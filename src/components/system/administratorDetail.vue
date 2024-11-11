<template>
  <div class="page">
    <section class="page-header">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user/list' }">後臺管理員</el-breadcrumb-item>
      <el-breadcrumb-item>管理員信息</el-breadcrumb-item>
    </el-breadcrumb>
  </section>
    <el-form ref="administrator"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="administrator"
             :rules="rules"
             label-position="left" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="administrator.name"
                  placeholder="請輸入姓名"></el-input>
      </el-form-item>
      <el-form-item label="賬號" prop="username">
        <el-row>
          <el-input v-model="administrator.username"
                    class="username-input"
                    :disabled="id"
                    placeholder="請輸入賬號"></el-input>
          <el-button type="text"
                     v-if="EDIT && id"
                     class="password-change"
                     @click="changePassword">重置密碼</el-button>
        </el-row>
      </el-form-item>
      <el-form-item label="密碼" v-if="!id" prop="password">
        <el-input type="password" v-model="administrator.password" placeholder="請輸入密碼"></el-input>
      </el-form-item>
      <el-form-item label="電郵" prop="email">
        <el-input v-model="administrator.email"
                  placeholder="請輸入電郵"></el-input>
      </el-form-item>
      <el-form-item label="國家號碼" prop="nationcode">
        <el-input v-model="administrator.nationcode"
                  placeholder="請輸入國家號碼"></el-input>
      </el-form-item>
      <el-form-item label="手提號碼" prop="mobile">
        <el-input v-model="administrator.mobile"
                  placeholder="請輸入手提號碼"></el-input>
      </el-form-item>
      <el-form-item label="物業" prop="project_id">
        <el-select v-model="administrator.project_id" placeholder="請選擇物業">
          <el-option
            v-for="item in projectList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="權限" prop="user_group_id">
        <el-select v-model="administrator.user_group_id" placeholder="請選擇權限">
          <el-option
            v-for="item in userGroupList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="(CREATE && !id) || (EDIT && id)">
        <el-button type="primary" :loading="submitLoading" @click="onSubmit" >提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    edit,
    check,
    changePwd,
    save
  } from '@/api/system/administratorDetail';
  import {logout} from '@/api/index'
  import { getPublicKey } from '@/api/index';
  import { baseVanke, baseUtil } from '@/util/index';

  export default {
      name: "administratorDetail",
      data() {
        const checkUsername = (rule, value, callback) => {
          if(!this.id) {
            if (value === '') {
              callback(new Error('請輸入賬號'));
            }
            else {
              let data = {
                keyword: this.administrator.username,
              };
              check(data).then(function(){
                callback();
              }).catch(function(error) {
                let errmsg = error.message+',建議使用'+error.data.data;
                callback(new Error(errmsg));
              });
            }
          }
          else {
            callback();
          }
        };

        const newPassRule = (rule, value, callback) => {
          const containsUppercase = /[A-Z]/.test(value)
          const containsLowercase = /[a-z]/.test(value)
          const containsNumber = /[0-9]/.test(value)
          if (value.trim().length < 8) {
            callback(new Error('請選用8個以上字元組成的密碼'));
          }
          else if (!containsUppercase) {
            callback(new Error('當中包括大寫的字母'));
          }
          else if (!containsLowercase) {
            callback(new Error('當中包括小寫的字母'));
          }
          else if (!containsNumber) {
            callback(new Error('當中包括數字'));
          }
          else {
            callback();
          }
        };

        return {
          id: '',
          loading : false,
          submitLoading: false,
          projectList: [],
          userGroupList: [],
          // newPassword: '',: false,
          // newPassword: '',

          rules: {
            name: [
              { required: true, message: '請輸入姓名', trigger: 'blur' }
            ],
            username: [
              { required: true, message: '請輸入賬號', trigger: 'blur' },
              { validator: checkUsername, trigger: 'blur' }
            ],
            password: [
              { required: true, message: '請輸入密碼', trigger: 'blur' },
              { validator: newPassRule, trigger: 'blur' }
            ],
            project_id: [
              { required: true, message: '請選擇物業', trigger: 'change' }
            ],
            user_group_id: [
              { required: true, message: '請選擇權限', trigger: 'change' }
            ],
          },

          VIEW: false,
          CREATE: false,
          EDIT: false,
          DELETE: false,
          EXPORT: false,
          administrator: {
            id: '',
            name: '',
            username: '',
            project_id: '',
            user_group_id: '',
            password: '',
            email: '',
            nationcode: '',
            mobile: '',
          },
        }
      },
      activated() {
        this.getItemDetail();
      },
      deactivated() {
        this.initDetail();

      },
      methods: {
        initDetail() {
          this.id = '';
          this.projectList= [];
          this.userGroupList= [];

          this.administrator = {
              id: '',
              name: '',
              username: '',
              project_id: '',
              user_group_id: '',
              password: '',
          };
          this.$refs.administrator.clearValidate(); // 清空规则
        },
        getItemDetail() {
          this.loading = true;
          let self = this;
          this.id = this.$route.query.id;
          let reqData = {
            id: this.id
          };
          edit(reqData).then(function(response){
            if (!response.data.VIEW) {
              self.$message.error('沒有權限！');
              self.$router.push('/user/list');
              return;
            }
            self.VIEW = response.data.VIEW;
            self.CREATE = response.data.CREATE;
            self.EDIT = response.data.EDIT;
            self.DELETE = response.data.DELETE;
            self.EXPORT = response.data.EXPORT;
            self.projectList = baseVanke.elProjectFormat(response.data.projectList);
            self.userGroupList = baseVanke.elUserGroupFormat(response.data.userGroupList);
            if(self.id) {
              self.administrator = response.data.userInfo;
              // self.administrator.newPassword = '';
            }
          }).catch(function(error) {
            self.$message.error(error.message);
          }).finally(function() {
            self.loading = false;
          });
        },
        /*
        * 重置密码
        * */
        changePassword() {
          const self = this;
          this.$prompt('請輸入新密碼', '重置密碼', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder:'請輸入新密碼',
            inputPattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
            inputErrorMessage: '密碼不能為空，8個以上字元組成，當中包括大小寫字母及數字。'
          }).then(function({ value })  {
            getPublicKey().then(function(res){
                const pw_hash = baseVanke.elEncryptRSA(res.data.public_key, value);
                changePwd(self.id,pw_hash).then(function() {
                  self.$message({
                    type: 'success',
                    message: '密碼重置成功！'
                  });
                }).catch(function(error) {
                  self.$message.error(error.message);
                })
            });
          }).catch(function() {
            self.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        },
        onSubmit() {
          const self = this;
          this.$refs.administrator.validate((valid)=>{
            if(valid) {
              this.submitLoading = true;
              let data = {
                user: {
                  name: this.administrator.name,
                  username: this.administrator.username,
                  project_id: this.administrator.project_id,
                  user_group_id: this.administrator.user_group_id,
                  email: this.administrator.email,
                  nationcode: this.administrator.nationcode,
                  mobile: this.administrator.mobile,
                }
              };
              if (this.id) { // 编辑传ID
                data.user.id = this.id;
              } else { // 新增传password
                data.user.password = this.administrator.password;
              }
              getPublicKey().then(function(res){
                if(data.user.password){
                  const pw_hash = baseVanke.elEncryptRSA(res.data.public_key, data.user.password);
                  data.user.password = pw_hash;
                }
                save(data).then(function() {
                  self.$message({
                    type: 'success',
                    message: '提交成功!'
                  });
                  self.$router.push('/user/list');
                }).catch(function(error) {
                  self.$message.error(error.message);
                }).finally(function() {
                  self.submitLoading = false;
                });
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
    width: 70%;
  }
  .el-select {
    width: 70%;
  }
</style>



// WEBPACK FOOTER //
// src/components/system/administratorDetail.vue