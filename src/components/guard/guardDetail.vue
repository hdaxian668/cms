<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/guard/list' }">保安員管理</el-breadcrumb-item>
        <el-breadcrumb-item>保安員詳情</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="guard"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="guard"
             :rules="rules"
             label-position="left" label-width="150px">
      <el-form-item label="保安員ID" prop="username">
        <el-input placeholder="請輸入保安員ID" v-model="guard.username"></el-input>
      </el-form-item>
      <el-form-item v-if="guard.id == ''" label="密碼" prop="password">
        <el-input placeholder="請輸入密碼" v-model="guard.password"></el-input>
      </el-form-item>
      <el-form-item v-if="guard.id != ''" label="更改密碼" prop="new_password">
        <el-input placeholder="請輸入密碼" v-model="guard.new_password"></el-input>
      </el-form-item>
      <el-form-item label="名稱" prop="name">
        <el-input placeholder="請輸入名稱" v-model="guard.name"></el-input>
      </el-form-item>
      <el-form-item label="物業" prop="project_id">
				<el-select v-model="guard.project_id" placeholder="請選擇">
					<el-option
						v-for="item in projectList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
      <el-form-item v-if="(CREATE && !id) || (EDIT && id)">
        <el-button type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
      </el-form-item>
      </el-form>
  </div>
</template>

<script>
  import {
    newForm,
    edit,
    save
  } from '@/api/guard/guardDetail';
  import {
    baseVanke,
    baseUtil,
  } from '@/util/index';

  export default {
    name: "guardDetail",
    components: {
      
    },
    data() {
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
      const changePassRule = (rule, value, callback) => {
        const containsUppercase = /[A-Z]/.test(value)
        const containsLowercase = /[a-z]/.test(value)
        const containsNumber = /[0-9]/.test(value)
        if (value.trim().length <= 0) {
          callback();
        }
        else if (value.trim().length > 0 && value.trim().length < 8) {
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
        loading: false,
        submitLoading: false,

        projectList: [],

        rules: {
          username: [
            {required: true, message: '請輸入保安員ID', trigger: 'blur'}
          ],
          password: [
            { required: true, message: '請輸入密碼', trigger: 'blur' },
            { validator: newPassRule, trigger: 'blur' }
          ],
          new_password: [
            { validator: changePassRule, trigger: 'blur' }
          ],
          name: [
            {required: true, message: '請輸入名稱', trigger: 'blur'}
          ],
          project_id: [
            {required: true, message: '請輸入物業', trigger: 'blur'}
          ],
        },

        VIEW: false,
        CREATE: false,
        EDIT: false,
        DELETE: false,
        EXPORT: false,
        guard: {
          id: '',
          username: '',
          password: '',
          new_password: '',
          name: '',
          project_id: '',
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
      /*
       * 初始化页面数据
       * */
      initDetail() {
        this.id = '';
        this.guard = {
            id: '',
            username: '',
            password: '',
            new_password: '',
            name: '',
            project_id: '',
        };
        this.$refs.guard.clearValidate(); // 清空规则
      },
      /*
      * 获取当前页面的详细信息
      * */
      getItemDetail() {
        const self = this;
        this.id = this.$route.query.id;
        this.guard = {
            id: '',
            username: '',
            password: '',
            new_password: '',
            name: '',
            project_id: '',
        };
        if (this.id) {
          this.loading = true;
          let reqData = {
            id: this.id
          };
          edit(reqData).then(function(response){
            if (!response.data.VIEW) {
              self.$message.error('沒有權限！');
              self.$router.push('/guard/list');
              return;
            }
            self.VIEW = response.data.VIEW;
            self.CREATE = response.data.CREATE;
            self.EDIT = response.data.EDIT;
            self.DELETE = response.data.DELETE;
            self.EXPORT = response.data.EXPORT;
            self.guard = Object.assign({}, self.guard, response.data.guard);
            self.projectList = baseVanke.elFormatArray(response.data.projectList, 'id', 'name_c');
          }).catch(function(error) {
            self.$message.error(error.message);
          }).finally(function() {
            self.loading = false;
          });
        }
        else {
          let reqData = {};
          newForm(reqData).then(function(response){
            if (!response.data.VIEW) {
              self.$message.error('沒有權限！');
              self.$router.push('/guard/list');
              return;
            }
            self.VIEW = response.data.VIEW;
            self.CREATE = response.data.CREATE;
            self.EDIT = response.data.EDIT;
            self.DELETE = response.data.DELETE;
            self.EXPORT = response.data.EXPORT;
            self.projectList = baseVanke.elFormatArray(response.data.projectList, 'id', 'name_c');
          }).catch(function(error) {
            self.$message.error(error.message);
          }).finally(function() {
            self.loading = false;
          });
        }
      },
      handleImgError(err) {
        this.$message.error(err.message);
      },
      // 提交
      onSubmit() {
        const self = this;
        this.$refs.guard.validate((valid)=>{
          if(valid) {
            this.submitLoading = true;
            let data = {
              username: this.guard.username,
              password: this.guard.password,
              new_password: this.guard.new_password,
              name: this.guard.name,
              project_id: this.guard.project_id,
            };
            if(this.id) {
              data.id =  this.id;
            }
            save(data).then(function() {
              self.$message({
                type: 'success',
                message: '提交成功!'
              });
              self.$router.push('/guard/list');
            }).catch(function(error){
              self.$message.error(error.message)
            }).finally(function() {
              self.submitLoading = false;
            });
          } else {
            self.$message.error('表單填寫有誤！');
            return false;
          }
        });
      },
    }
  }
</script>

<style scoped>

  .add-extend {
    width: 50px;
    height:50px;
    line-height: 50px;
  }
</style>



// WEBPACK FOOTER //
// src/components/guard/guardDetail.vue