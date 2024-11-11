<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
				<el-breadcrumb-item>聯繫我們</el-breadcrumb-item>
        <el-breadcrumb-item>資料導入</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="feedback"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="feedback"
             :rules="rules"
             label-position="left" label-width="150px">
                   
      <el-form-item label="導入文件" prop="feedback_file">
        <el-upload
        v-loading="uploadLoading"
             element-loading-text="文件上傳中"
          name="upfile"
          class="photo-uploader"
          :class="isInline?'inline-block':''"
          action="/upload/handle?action=uploadFeedbackXlsx"
          accept=".xlsx"
          :limit="parseInt('1')"
          :on-success="uploadOnSuccess"
          :on-progress="uploadOnProgress"
          :on-change="uploadOnChange"
          :on-error="uploadOnError"
          :on-remove.self="handleRemove"
          :before-upload="beforeUpload">
          <i class="el-icon-plus uploader-icon"></i>
        </el-upload>
	<div>* 每次導入最多 1,000 條記錄</div>
      </el-form-item>

      <el-form-item>
        <el-button  type="primary":loading="submitLoading"  @click="downloadExample">下載導入範本</el-button>
        <!--<el-button  type="primary":loading="submitLoading"  @click="downloadMapping">內容對照</el-button>-->
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="submitLoading"  @click="onSubmit" v-if="!isHidden">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    save,
    edit,
    importFeedback,
    saveImportFeedback
  } from '@/api/feedback/feedbackDetail';
  import {
    baseVanke,
    baseUtil,
  } from '@/util/index';


  export default {
    name: "feedbackImport",

    data() {
        return {
          isHidden: true,
          id: '',
          loading: false,
          submitLoading: false,
          uploadLoading : false,
          create:0,
          update:0,
          rules: {
            feedback_file:[
              {required: true, message: '請添加導入文件', trigger: 'change'}
            ],
          },
          visibleList: [],

          VIEW: false,
          CREATE: false,
          EDIT: false,
          DELETE: false,
          EXPORT: false,
          IMPORT: false,
          feedback: {
            feedback_file:[],
            visible:'',
            send_info:{
            }, // 发送目标
          }
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
        this.visibleList = [];
        this.feedback = {
          feedback_file:[],
        };

        this.$refs.feedback.resetFields();
        // this.$refs.feedback.clearValidate(); // 清空规则
      },

      /*
      * 获取当前页面的详细信息
      * */
      getItemDetail() {
        this.loading = true;
        let self = this;
        this.id = this.$route.query.id;
        let reqData = {
          id: this.id,
          create: this.new,
          update: this.update,
        };

        /*save(reqData).then(function(response){
            self.create = response.data.new;
            self.update = response.data.update;
          }
        };*/


        importFeedback(reqData).then(function(response){
          if (!response.data.IMPORT) {
            self.$message.error('沒有權限！');
            self.$router.push('/feedback/list');
            return;
          }
          self.VIEW = response.data.VIEW;
					self.CREATE = response.data.CREATE;
					self.EDIT = response.data.EDIT;
					self.DELETE = response.data.DELETE;
					self.EXPORT = response.data.EXPORT;
					self.IMPORT = response.data.IMPORT;
					
          if(self.id) {
            self.create = response.data.new;
            self.update = response.data.update;
            // self.setUeditorContent();
          }
        }).catch(function(error) {
          self.$message.error(error.message);
        }).finally(function() {
          self.loading = false;
        });
      },

      beforeUpload(file){
         const isMatch = file.name.split('.')[1] === 'xlsx';
         if (!isMatch) {
          this.$message.error('上傳失敗！文件类型不允许');
        }
        return isMatch;
      },

      uploadOnProgress(){
        this.uploadLoading = true;
      },

      uploadOnSuccess(res, fileList ) {  
          this.uploadLoading = false;
          this.feedback.feedback_file.push(res.data);
          this.$refs.feedback.validateField('feedback_file');

          if(res.isValid){
            this.isHidden = false;
          }
          else{
            alert(res.errorDetail);
            this.feedback.feedback_file = [];
          }

          
      },

      downloadExample() {   
        window.open(this.$route.path + "../../../feedback/template.xlsx?v=" + new Date().getTime(), "_blank");    
      },

      downloadMapping() {
        window.open(this.$route.path + "../../../feedback/mapping.xls?v=" + new Date().getTime(), "_blank");
      },


      /**
       * 提交保存数据
       */
      onSubmit() {
        const self = this;
        
        this.$refs.feedback.validate((valid)=>{
          if(valid) {
            this.submitLoading = true;
            let data = {
              feedback_file: JSON.stringify(this.feedback.feedback_file),
            };
            if(this.id) {
              data.id =  this.id;
            }
            saveImportFeedback(data).then(function() {
              self.$message({
                message: '提交成功',
                type: 'success'
              });
              self.$router.push('/feedback/import');
            }).catch(function(error) {
              self.$message.error(error.message);
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
// src/components/feedback/feedbackImport.vue