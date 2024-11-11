<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/feedback-channel/list' }">聯繫渠道管理</el-breadcrumb-item>
        <el-breadcrumb-item>聯繫渠道詳情</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="feedbackChannel"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="feedbackChannel"
             :rules="rules"
             label-position="left" label-width="150px">
      <el-form-item label="名稱" prop="name">
        <el-input placeholder="請輸入名稱" v-model="feedbackChannel.name"></el-input>
      </el-form-item>

      <el-form-item label="編號字首" prop="prefix">
        <el-input placeholder="請輸入編號字首" v-model="feedbackChannel.prefix"></el-input>
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
  } from '@/api/feedbackChannel/feedbackChannelDetail';
  import {
    baseVanke,
    baseUtil,
  } from '@/util/index';

  export default {
    name: "feedbackChannelDetail",
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
          ],
          prefix:[
            {required: true, message: '請輸入編號字首', trigger: 'blur'}
          ],
        },

        VIEW: false,
        CREATE: false,
        EDIT: false,
        DELETE: false,
        EXPORT: false,
        feedbackChannel: {
          id: '',
          name: '',
          prefix: '',
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
        this.feedbackChannel = {
            id: '',
            name: '',
            prefix: '',
        };
        this.$refs.feedbackChannel.clearValidate(); // 清空规则
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
            self.$router.push('/feedback-channel/list');
            return;
          }
          self.VIEW = response.data.VIEW;
					self.CREATE = response.data.CREATE;
					self.EDIT = response.data.EDIT;
					self.DELETE = response.data.DELETE;
					self.EXPORT = response.data.EXPORT;
          if(self.id) {
            self.feedbackChannel =  Object.assign({}, self.feedbackChannel,response.data.feedbackChannelInfo);
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
        
        this.$refs.feedbackChannel.validate((valid)=>{
          if(valid) {
            this.submitLoading = true;
            
            let data = {
              feedbackChannel:{
                name: this.feedbackChannel.name,
                prefix: this.feedbackChannel.prefix,
              }
            };
            if(this.id) { // 编辑状态，
              data.feedbackChannel.id =  this.id;
            }
            save(data).then(function() {
              self.$message({
                type: 'success',
                message: '提交成功!'
              });
              self.$router.push('/feedback-channel/list');
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
// src/components/feedbackChannel/feedbackChannelDetail.vue