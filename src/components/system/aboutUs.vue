<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>關於我們</el-breadcrumb-item>
      </el-breadcrumb>
    </section>

    <el-form ref="aboutUs"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="aboutUs"
             :rule="rules"
             label-position="left" label-width="100px">
      <el-form-item label="關於萬科" prop="about_wk_c">
        <p>中文</p>
        <div class="editor-container">
          <u-editor ref="about_wk_c" :defaultMsg="aboutUs.about_wk_c"  id="about_wk_c"></u-editor>
        </div>
      </el-form-item>
      <el-form-item prop="about_wk_e">
        <p>英文</p>
        <div class="editor-container">
          <u-editor ref="about_wk_e" :defaultMsg="aboutUs.about_wk_e"  id="about_wk_e"></u-editor>
        </div>
      </el-form-item>
      <el-form-item label="關於萬科會" prop="about_wkh_c">
        <p>中文</p>
        <div class="editor-container">
          <u-editor ref="about_wkh_c" :defaultMsg="aboutUs.about_wkh_c"  id="about_wkh_c"></u-editor>
        </div>
      </el-form-item>
      <el-form-item prop="about_wkn_e">
        <p>英文</p>
        <div class="editor-container">
          <u-editor ref="about_wkh_e" :defaultMsg="aboutUs.about_wkh_e"  id="about_wkh_e"></u-editor>
        </div>
      </el-form-item>
      <el-form-item 
        v-if="EDIT">
        <el-button  type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    aboutData,
    save
  } from '@/api/system/aboutUs';
  import UEditor from '../common/UEditor';

  export default {
    components: {UEditor},
    data() {
      return {
        loading: false,
        submitLoading: false,
        rules: {
          about_wk_c : [
            { required: true, message: '請輸入萬科介紹（中）', trigger: 'change'},
          ],
          about_wk_e : [
            { required: true, message: '請輸入萬科介紹（英）', trigger: 'change'},
          ],
          about_wkh_c: [
            { required: true, message: '請輸入萬客會介紹（中）', trigger: 'change'},
          ],
          about_wkh_e: [
            { required: true, message: '請輸入萬客會介紹（英）', trigger: 'change'},
          ],
        },
        aboutUs: {
          about_wk_c: 'loading...',
          about_wk_e: 'loading...',
          about_wkh_c: 'loading...',
          about_wkh_e: 'loading...',
        },
        defaultWord: {
          about_wk_c: '請輸入萬科介紹（中）',
          about_wk_e: '請輸入萬科介紹（英）',
          about_wkh_c: '請輸入萬客會介紹（中）',
          about_wkh_e: '請輸入萬客會介紹（英）',
        },
        VIEW: false,
        CREATE: false,
        EDIT: false,
        DELETE: false,
        EXPORT: false,
      }
    },
    activated() {
      this.getItemDetail();
    },
    deactivated() {
      this.$refs.aboutUs.resetFields();
      // this.initDetail();
    },
    methods: {
      /*
      * 初始化页面数据
      * */
      initDetail() {
        this.aboutUs = {
          about_wk_c: 'loading...',
          about_wk_e: 'loading...',
          about_wkh_c: 'loading...',
          about_wkh_e: 'loading...',
        };
      },
      /*
      * 获取当前页面的详细信息
      * */
      getItemDetail() {
        this.loading = true;
        const self = this;
        aboutData().then(function(response){
          if (!response.data.VIEW) {
            self.$message.error('沒有權限！');
            return;
          }
          self.VIEW = response.data.VIEW;
          self.CREATE = response.data.CREATE;
          self.EDIT = response.data.EDIT;
          self.DELETE = response.data.DELETE;
          self.EXPORT = response.data.EXPORT;
          self.aboutUs = response.data.data || self.defaultWord;
        }).catch(function(error) {
          self.aboutUs = self.defaultWord;
          self.$message.error(error.message);
        }).finally(function() {
          self.loading = false;
        });
      },
      /*
     * 设置UEditor内容
     * */
      setUeditorContent() {
        this.aboutUs.about_wk_c = this.aboutUs.about_wk_c || '';
        this.aboutUs.about_wk_e = this.aboutUs.about_wk_e || '';
        this.aboutUs.about_wkh_c = this.aboutUs.about_wkh_c || '';
        this.aboutUs.about_wkh_e = this.aboutUs.about_wkh_e || '';

        this.$refs.about_wk_c.setUEContent(this.aboutUs.about_wk_c);
        this.$refs.about_wk_e.setUEContent(this.aboutUs.about_wk_e);
        this.$refs.about_wkh_c.setUEContent(this.aboutUs.about_wkh_c);
        this.$refs.about_wkh_e.setUEContent(this.aboutUs.about_wkh_e);
      },
      /*
      * 获取UEditor编辑器中的内容
      * */
      getUeditorContent() {
        this.aboutUs.about_wk_c = this.$refs.about_wk_c.getUEContent();
        this.aboutUs.about_wk_e = this.$refs.about_wk_e.getUEContent();
        this.aboutUs.about_wkh_c = this.$refs.about_wkh_c.getUEContent();
        this.aboutUs.about_wkh_e = this.$refs.about_wkh_e.getUEContent();
      },
      onSubmit() {
        this.getUeditorContent();
        this.$refs.aboutUs.validate((valid)=>{
          if(valid) {
            this.submitLoading = true;
            let data = {
              about_wk_c: this.aboutUs.about_wk_c,
              about_wk_e: this.aboutUs.about_wk_e,
              about_wkh_c: this.aboutUs.about_wkh_c,
              about_wkh_e: this.aboutUs.about_wkh_e,
            };
            save(data).then(()=>{
              this.$message({
                type: 'success',
                message: '提交成功!'
              });
            }).catch((error)=>{
              this.$message.error(error.message);
            }).finally(() =>{
              this.submitLoading = false;
            });
          } else {
            this.$message.error('表單填寫有誤！');
            return false;
          }
        });
      },

    }
  };
</script>
<style>
  .info{
    border-radius: 10px;
    line-height: 20px;
    padding: 10px;
    margin: 10px;
    background-color: #ffffff;
  }
</style>



// WEBPACK FOOTER //
// src/components/system/aboutUs.vue