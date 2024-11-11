<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/project/list' }">項目管理</el-breadcrumb-item>
        <el-breadcrumb-item>單位導入</el-breadcrumb-item>
        <el-breadcrumb-item>{{ projectName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="defect"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="defect"
             :rules="rules"
             label-position="left" label-width="150px">
      
      <el-form-item label="單位文件" prop="defect_file">
        <el-upload
          ref="upload"
          v-loading="uploadLoading"
          element-loading-text="文件上傳中"
          name="upfile"
          class="photo-uploader"
          :class="isInline?'inline-block':''"
          action="/upload/handle?action=uploadUnitXlsx"
          accept=".xlsx"
          :limit="parseInt('1')"
          :on-success="uploadOnSuccess"
          :on-progress="uploadOnProgress"
          :on-change="uploadOnChange"
          :on-error="uploadOnError"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :data="{project_id:id}">
          <i class="el-icon-plus uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="submitLoading" @click="onSubmit" v-if="!isHidden">提交</el-button>
      </el-form-item>

      <el-form-item>
        <el-button :loading="submitLoading" @click="downloadSample">範例文件(建議用"單位導出"文件)</el-button>
        <el-button :loading="submitLoading" @click="downloadMapping">說明檔</el-button>
      </el-form-item>

      <el-form-item prop="error_message">
        <el-input class="vk-alert-text" type="textarea" v-model="error_message" readonly="true"></el-input>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
  import {
    save,
    edit,
    saveUnit
  } from '@/api/project/salesDetail';
  import {
    baseVanke,
    baseUtil,
  } from '@/util/index';


  export default {
    name: "defectReportDetail",

    data() {
        return {
          isHidden: true,
          id: '',
          loading: false,
          submitLoading: false,
          uploadLoading : false,
          project_id:'',
          projectName:'', // 项目名称
          create:0,
          update:0,
          rules: {
            project_id: [
              {required: true, message: '請選擇項目', trigger: 'blur'}
            ],
            defect_file:[
              {required: true, message: '請添加單位文件', trigger: 'change'}
            ],
          },
          visibleList: [],
          projectList: [],
          error_message: '',

          defect: {
            project_id: '',
            defect_file:[],
            visible:'',
            send_info:{
              level:[], // 所选会籍
              project:[], // 项目信息
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
        this.projectList = [];
        this.error_message = '';
        this.defect = {
          project_id:'',
          defect_file:[],
        };

        this.isHidden = true;
        this.$refs.upload.clearFiles()

        this.$refs.defect.resetFields();
        // this.$refs.discount.clearValidate(); // 清空规则
      },
      /*
      * 获取当前页面的详细信息
      * */
      getItemDetail() {
        this.loading = true;
        let self = this;
        this.id = this.$route.query.id;
        this.projectName = this.$route.query.name;
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


        self.loading = false;
      },

      /*
       /*
       * 上传封面图片
       * */
      handleCoverImgSuccess(event,type) {
        this.discount[type] = event.url;
        this.$refs.discount.validateField(type); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '上传成功!'
        });
      },



      beforeUpload(file){
        this.error_message = '';
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
          this.defect.defect_file.push(res.data);
          this.$refs.defect.validateField('defect_file');

          //if(res.UnitNotFind == 0 && res.CustNotFind ==0 && res.contentError==0){
            this.isHidden = false;
          //}

         // alert('Create: ' + res.new + '\nUpdate: ' + res.update + '\nUnit Not Find: ' + res.UnitNotFind + '\nCustomer Not Find: ' + res.CustNotFind + '\nContent Error: ' + res.contentError);
      },
      /*
      * 删除封面图片
      * */
      handleRemove(type) {
        this.defect.defect_file = [];
        this.$refs.defect.validateField('defect_file');
        this.isHidden = true;
      },
      /*
     * 上传图片失败
     * */
      handleImgError(err) {
        this.$message.error(err.message);
      },
      /**
       * 上传图片成功，将图片信息存入images中
       * @param res - 上传图片成功的返回值
       */
      handleImgItemSuccess(res) {
        this.discount.images.push(res.url);
        this.$refs.discount.validateField('images'); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '上传成功!'
        });
      },
      /*
       * 删除图片
       * */
      handleImgItemRemove(index) {
        this.discount.images.splice(index,1); // 刪除這一項
        this.$refs.discount.validateField('images'); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '刪除成功!'
        });
      },
      handleImgItemSortUp(index) {
        let list = this.discount.images;
        if(index> 0) { // 不是第一个的可以上移
          list = baseUtil.arrayChangeItem(list,index,index-1);
        }
      },
      handleImgItemSortDown(index) {
        let list = this.discount.images;
        if(index < list.length-1) { // 不是最后一个的可以下移
          list  = baseUtil.arrayChangeItem(list ,index,index+1);
        }
      },

      downloadSample () {   
        window.open(this.$route.path + "../../../property/units-import.xlsx", "_blank");    
      },

      downloadMapping() {
        window.open(this.$route.path + "../../../property/units-description.xlsx", "_blank");
      },

      /**
       * 提交保存数据
       */
      onSubmit() {
        const self = this;
        // this.discount.images = JSON.stringify(this.uploadUrlList);
        this.$refs.defect.validate((valid)=>{
          if(valid) {
            this.submitLoading = true;
            let data = {
              // id: this.discount.id,
              projectName: this.projectName,
              defect_file: JSON.stringify(this.defect.defect_file),
            };
            if(this.id) {
              data.id =  this.id;
            }
            saveUnit(data).then(function() {
              self.$message({
                message: '導入成功',
                type: 'success'
              });
              self.$router.push('/project/list');
            }).catch(function(error) {
              self.error_message = error.message;
              self.$message.error('文件內容出錯，請更正再上傳！');
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
// src/components/project/unitImport.vue