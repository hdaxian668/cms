<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/feedback-category/list' }">聯繫類別管理</el-breadcrumb-item>
        <el-breadcrumb-item>聯繫類別詳情</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="feedbackCategory"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="feedbackCategory"
             :rules="rules"
             label-position="left" label-width="150px">
      <el-form-item label="名稱" prop="name">
        <el-input placeholder="請輸入名稱" v-model="feedbackCategory.name"></el-input>
      </el-form-item>

      <el-form-item v-if="(CREATE && !id) || (EDIT && id)">
        <el-button type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
      </el-form-item>
      </el-form>
  </div>
</template>

<script>
  // import UEditor from '../common/UEditor';
  import SingleImgUpload from "../common/SingleImgUpload/SingleImgUpload";
  import {
    edit,
    save
  } from '@/api/feedbackCategory/feedbackCategoryDetail';
  import {
    baseVanke,
    baseUtil,
  } from '@/util/index';

  export default {
    name: "feedbackCategoryDetail",
    components: {
      
    },
    data() {
      return {
        id: '',
        loading: false,
        submitLoading: false,
        rules: {
          name: [
            {required: true, message: '請輸入名通', trigger: 'blur'}
          ]
        },

        VIEW: false,
        CREATE: false,
        EDIT: false,
        DELETE: false,
        EXPORT: false,
        feedbackCategory: {
          id: '',
          name: '',
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
        this.feedbackCategory = {
            id: '',
            name: '',
        };
        this.$refs.feedbackCategory.clearValidate(); // 清空规则
      },
      /*
      * 获取当前页面的详细信息
      * */
      getItemDetail() {
        this.loading = true;
        const self = this;
        this.id = this.$route.query.id;
        let reqData = {
          id: this.id
        };
        edit(reqData).then(function(response){
          if (!response.data.VIEW) {
            self.$message.error('沒有權限！');
            self.$router.push('/feedback-category/list');
            return;
          }
          self.VIEW = response.data.VIEW;
					self.CREATE = response.data.CREATE;
					self.EDIT = response.data.EDIT;
					self.DELETE = response.data.DELETE;
					self.EXPORT = response.data.EXPORT;
          if(self.id) {
            self.feedbackCategory =  Object.assign({}, self.feedbackCategory,response.data.feedbackCategoryInfo);
          }
        }).catch(function(error) {
          self.$message.error(error.message);
        }).finally(function() {
          self.loading = false;
        });
      },
      // 提交
      onSubmit() {
        const self = this;
        
        this.$refs.feedbackCategory.validate((valid)=>{
          if(valid) {
            this.submitLoading = true;
            
            let data = {
              feedbackCategory:{
                name: this.feedbackCategory.name
              }
            };
            if(this.id) { // 编辑状态，
              data.feedbackCategory.id =  this.id;
            }
            save(data).then(function() {
              self.$message({
                type: 'success',
                message: '提交成功!'
              });
              self.$router.push('/feedback-category/list');
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

</style>



// WEBPACK FOOTER //
// src/components/feedbackCategory/feedbackCategoryDetail.vue