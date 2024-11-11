<template>
    <div class="page">
      <section class="page-header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
          <el-breadcrumb-item>執修管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/defect-holiday/list' }">假期編輯</el-breadcrumb-item>
          <el-breadcrumb-item>假期導入</el-breadcrumb-item>
        </el-breadcrumb>
      </section>
      <el-form ref="defectholiday"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="defectholiday"
             :rules="rules"
             label-position="left" label-width="150px">
        <el-form-item label="假期導入" prop="defectholiday_file">
            <el-upload v-loading="uploadLoading"
                  ref="defectHolidayUpload"
                  element-loading-text="文件上傳中"
                  name="upfile"
                  class="photo-uploader"
                  :class="isInline?'inline-block':''"
                  action="/upload/handle?action=uploadDefectHolidayXlsx"
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
        </el-form-item>

        <el-form-item>
            <el-button type="primary" :loading="submitLoading"  @click="downloadExample">假期文件範本</el-button>
        </el-form-item>

        <el-form-item v-if="IMPORT">
            <el-button type="primary" :loading="submitLoading"  @click="onSubmit">提交</el-button>
        </el-form-item>

        <el-form-item prop="upload_message" :hidden=upload_message_hidden>
          <el-input class="vk-upload-text" type="textarea" v-model="upload_message" readonly="true"></el-input>
        </el-form-item>
        <el-form-item prop="error_message" :hidden=alert_message_hidden>
          <el-input class="vk-alert-text" type="textarea" v-model="error_message" readonly="true"></el-input>
        </el-form-item>
        
      </el-form>
    </div>
</template>

<script>
  import { itemlist, saveImport } from '@/api/defectHoliday/defectHoliday';
  import { baseVanke, } from '@/util/index';

  export default {
    name: "defectHolidayImport",

    data() {
        return {
          isHidden: true,
          alert_message_hidden: true,
          upload_message_hidden: true,
          id: '',
          loading: false,
          submitLoading: false,
          uploadLoading : false,
          project_id:'',
          importlogid: '',
          create:0,
          update:0,
          rules: {
            defectholiday_file:[
              {required: true, message: '請添加假期文件', trigger: 'change'}
            ],
          },
          error_message: '',
          upload_message: '',

          VIEW: false,
          CREATE: false,
          EDIT: false,
          DELETE: false,
          IMPORT: false,
          defectholiday: {
            defectholiday_file:[],
          }
        }
    },
    activated() {
      this.initDetail();
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
        this.error_message = '';
        this.upload_message = '';
        this.defectholiday.defectholiday_file = [];
        this.$refs.defectHolidayUpload.clearFiles()
        this.importlogid = '';
        this.$refs.defectholiday.resetFields();
      },
      /*
      * 获取当前页面的详细信息
      * */
      getItemDetail() {
        this.loading = true;
        const self = this;
        itemlist().then(function(response){
            self.VIEW = response.data.VIEW;
            self.CREATE = response.data.CREATE;
            self.EDIT = response.data.EDIT;
            self.DELETE = response.data.DELETE;            
            self.IMPORT = response.data.IMPORT;
            if (!response.data.IMPORT) {
                self.$message.error('沒有權限！');
                return;
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
        this.error_message = '';
        this.upload_message = '';
        this.alert_message_hidden = true;
        this.upload_message_hidden = true;
      },

      uploadOnSuccess(res, fileList ) {  
        this.uploadLoading = false;
        this.defectholiday.defectholiday_file.push(res.data);
        this.$refs.defectholiday.validateField('defectholiday_file');
        this.error_message = '';
        this.upload_message = '';
        this.alert_message_hidden = true;
        this.upload_message_hidden = true;
        this.importlogid = res.importlogid;

        this.status = res.status;
        if (this.status == 0){
            this.IMPORT = true;
            this.upload_message_hidden = false;
            this.upload_message = 'Total Row Read:' + res.totalrecord + "\n"
            + 'New Record / Update Record: ' + res.new + "\n"
            + 'Empty Row: ' + res.emptyrecord + "\n"
            + 'Delete Row: ' + res.delete
        } else {
            this.IMPORT = false;
            this.alert_message_hidden = false;
            this.error_message = res.error_message;
            this.$message.error('文件內容出錯，請更正再上傳！');
        }
      },
      /*
      * 删除封面图片
      * */
      handleRemove(type) {
        this.defectholiday.defectholiday_file = [];
        // this.$refs.defectholiday.validateField('defectholiday_file');
        this.$refs.defectHolidayUpload.clearFiles()
        this.upload_message_hidden = true;
        this.alert_message_hidden = true;
        this.error_message = '';
        this.upload_message = '';
        this.isHidden = true;
      },
      downloadExample () {   
        window.open(this.$route.path + "../../../defectHoliday/sample.xlsx", "_blank");    
      },

      /**
       * 提交保存数据
       */
      onSubmit() {
        const self = this;
        this.$refs.defectholiday.validate((valid)=>{
          if(valid) {
            this.submitLoading = true;
            let data = {
              defectholiday_file: JSON.stringify(this.defectholiday.defectholiday_file),
              importlogid: this.importlogid,
            };
            saveImport(data).then(function(response) {
              console.log(response);
              self.$message({
                message: '提交成功',
                type: 'success'
              });
              self.$router.push('/defect-holiday/list');
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
  .photo-uploader-icon {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
  }
  .photo-uploader-icon:hover {
      border-color: #409EFF;
  }

  .photo {
      width: 100px;
      height: 100px;
      display: block;
  }

 /* vietnamese */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 100;
      font-display: swap;
      src: local('Barlow Thin'), local('Barlow-Thin'), url(https://fonts.gstatic.com/s/barlow/v4/7cHrv4kjgoGqM7E3b_s0wH8RnA.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
    }
    /* latin-ext */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 100;
      font-display: swap;
      src: local('Barlow Thin'), local('Barlow-Thin'), url(https://fonts.gstatic.com/s/barlow/v4/7cHrv4kjgoGqM7E3b_s1wH8RnA.woff2) format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 100;
      font-display: swap;
      src: local('Barlow Thin'), local('Barlow-Thin'), url(https://fonts.gstatic.com/s/barlow/v4/7cHrv4kjgoGqM7E3b_s7wH8.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    /* vietnamese */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 300;
      font-display: swap;
      src: local('Barlow Light'), local('Barlow-Light'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3p-ks6FospT4.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
    }
    /* latin-ext */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 300;
      font-display: swap;
      src: local('Barlow Light'), local('Barlow-Light'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3p-ks6VospT4.woff2) format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 300;
      font-display: swap;
      src: local('Barlow Light'), local('Barlow-Light'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3p-ks51os.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    /* vietnamese */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('Barlow Regular'), local('Barlow-Regular'), url(https://fonts.gstatic.com/s/barlow/v4/7cHpv4kjgoGqM7E_A8s52Hs.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
    }
    /* latin-ext */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('Barlow Regular'), local('Barlow-Regular'), url(https://fonts.gstatic.com/s/barlow/v4/7cHpv4kjgoGqM7E_Ass52Hs.woff2) format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('Barlow Regular'), local('Barlow-Regular'), url(https://fonts.gstatic.com/s/barlow/v4/7cHpv4kjgoGqM7E_DMs5.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    /* vietnamese */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: local('Barlow Medium'), local('Barlow-Medium'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3_-gs6FospT4.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
    }
    /* latin-ext */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: local('Barlow Medium'), local('Barlow-Medium'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3_-gs6VospT4.woff2) format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: local('Barlow Medium'), local('Barlow-Medium'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3_-gs51os.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    /* vietnamese */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: local('Barlow Bold'), local('Barlow-Bold'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3t-4s6FospT4.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
    }
    /* latin-ext */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: local('Barlow Bold'), local('Barlow-Bold'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3t-4s6VospT4.woff2) format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: local('Barlow Bold'), local('Barlow-Bold'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3t-4s51os.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }


    #preview-holder--3 #preview-discount {
        width: 1140px;
        height: 768px;
        margin: auto;
        background: #f9f9f9;
        z-index: 2000;
        padding: 30px;
        overflow: auto;
        position: fixed;
        top: calc(50% - 420px);
        left: calc(50% - 600px);
        font-size: 13px;    
        letter-spacing: 0.01em;
        color: #333;
    }

    #preview-holder--3 #preview-discount *{
      background-color: transparent !important;
    }

    #preview-holder--3 {
        position: fixed;
        content: "";
        display: inline-block;
        width: 100%;
        height: 100%;
        z-index: 1000;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
    }

    #preview-holder--3 #preview-discount .path {
        font-size: 14px;
        font-weight: bold;
    }

    #preview-holder--3 #preview-discount__title {
        text-align: left;
        margin: 30px auto;
        font-size: 38px;
        color: #b61600;
        font-weight: 300;
    }

    #preview-holder--3 #preview-discount .content-left,
    #preview-holder--3 #preview-discount .content-right {
        display: inline-block;
        width: 47%;
        vertical-align: top;
    }

    #preview-holder--3 #preview-discount .content-right {
        margin-left: 2%;
    }


    #preview-holder--3 #preview-discount .content-row-title {
        font-size: 16px;
        font-weight: bold;
        color: #ca0000;
        line-height: 24px;
    }

    #preview-holder--3 #preview-discount .content-row {
        margin: 0 0 25px;
        line-height: initial;
        font-size: 16px;
        font-weight: normal;
    }

    #preview-holder--3 #preview-discount .content-row-content {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        line-height: 27px;
    }

    #preview-holder--3 #preview-discount .custom-br {
        display: block;
        height: 1px;
        background-color: #ccc;
        margin: 40px auto 20px;
    }

    #preview-holder--3 #preview-discount #preview-discount__term {
        font-weight: bold;
        line-height: 1.5em;
        font-size: 16px;
    }

    #preview-holder--3 #preview-discount #preview-discount__term p {
        margin: 0 0 10px;
    }
    #preview-holder--3 img#banner-image {
        width: 100%;
    }

    #preview-holder--4 {
        position: fixed;
        content: "";
        display: none;
        width: 100%;
        height: 100%;
        z-index: 1000;
        top: 0;
        left: 0;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.5);
    }
    #preview-holder--4 .preview-discount-m {
        display: inline-block;
        width: 375px;
        height: 667px;
        background-color: #FFF;
        vertical-align: middle;
        margin: 0 28px;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    div#preview-holder--4:after {
        content: "";
        display: inline-block;
        height: 100%;
        vertical-align: middle;
        width: 1px;
    }
    #preview-holder--4 .banner-item span:nth-child(1) {
        background-color: #ca0000 !important;
    }
    #preview-holder--4 .preview-banner {
        overflow: hidden;
        width: 100%;
        height: 200px;
        position: relative;
    }
    #preview-holder--4 #m-discount-banner-img {
        width: 100%;
        height: auto;
    }
    #preview-holder--4 .banner-item {
        position: absolute;
        height: 18px;
        background-color: #FFF !important;
        width: 100%;
        left: 0;
        bottom: 0;
        text-align: center;
        padding-top: 4px;
        font-size: 0;
    }
    #preview-holder--4 .banner-item span {
        display: inline-block;
        width: 8px;
        height: 8px;
        background-color: #ccc !important;
        border-radius: 20px;
        margin: 5px 5px;
    }

    #preview-holder--4 #m-discount-title {
        padding: 10px 15px 8px;
        text-align: left;
        color: #CA0000;
        font-weight: bold;
        font-size: 17px;
    }

    #preview-holder--4 .content-row {
        padding: 4px 15px;
        text-align: left;
    }

    #preview-holder--4 .content-row .row-title {
        color: #CA0000;
        font-size: 14px;
        font-weight: bold;
        padding: 4px 0 4px;
    }
    #preview-holder--4 .content-row .row-content {
        font-size: 14px;
        line-height: 20px;
    }
    #preview-holder--4 #m-discount-desc {
        text-align: left;
        padding: 14px;
    }

    #preview-discount-m4 .term-header {
        text-align: center;
        background-color: #ca0000;
        color: #FFF;
        font-size: 18px;
        padding: 18px 0 12px;
        font-weight: bold;
    }
    #preview-discount-m4  #m-discount-term {
        text-align: left;
        padding: 14px;
    }

</style>



// WEBPACK FOOTER //
// src/components/defectHoliday/defectHolidayImport.vue