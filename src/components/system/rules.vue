<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <!--<el-breadcrumb-item>系統管理</el-breadcrumb-item>-->
        <el-breadcrumb-item>條款</el-breadcrumb-item>
      </el-breadcrumb>
    </section>

    <el-form ref="rules"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="rules"
             :rules="formRules"
             label-position="left" label-width="50px">
      <el-form-item prop="clause_c">
        <div class="editor-container">
          <p>中文</p>
          <u-editor ref="clause_c" :defaultMsg="rules.clause_c"  id="rules_clause_c"></u-editor>
        </div>
      </el-form-item>
      <el-form-item prop="clause_e">
        <div class="editor-container">
          <p>英文</p>
          <u-editor ref="clause_e" :defaultMsg="rules.clause_e"  id="rules_clause_e"></u-editor>
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
    clauseData,
    save
  } from '@/api/system/rules';
  import UEditor from '../common/UEditor';

  export default {
    name: 'Rules',
    components: {UEditor},
    data() {
      return {
        loading: false,
        submitLoading: false,
        formRules: {
          clause_c : [
            { required: true, message: '請輸入條款（中）', trigger: 'change'},
          ],
          clause_e : [
            { required: true, message: '請輸入條款（英）', trigger: 'change'},
          ],
        },
        rules: {
          clause_c: 'loading...',
          clause_e: 'loading...',
        },
        defaultWord: {
          clause_c: '請輸入條款（中）',
          clause_e: '請輸入條款（英）',
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
      this.$refs.rules.resetFields();
      // this.initDetail();
    },
    methods: {
      /*
      * 初始化页面数据
      * */
      initDetail() {
        this.rules = {
          clause_c: 'loading...',
          clause_e: 'loading...',
        };
      },
      /*
      * 获取当前页面的详细信息
      * */
      getItemDetail() {
        this.loading = true;
        const self = this;
        clauseData().then(function(response){
          if (!response.data.VIEW) {
            self.$message.error('沒有權限！');
            return;
          }
          self.VIEW = response.data.VIEW;
          self.CREATE = response.data.CREATE;
          self.EDIT = response.data.EDIT;
          self.DELETE = response.data.DELETE;
          self.EXPORT = response.data.EXPORT;
          self.rules = response.data.data || self.defaultWord;
          // self.setUeditorContent();
        }).catch(function(error) {
          self.rules = self.defaultWord;
          self.$message.error(error.message);
        }).finally(function() {
          self.loading = false;
        });
      },
      /*
     * 设置UEditor内容
     * */
      setUeditorContent() {
        this.$refs.clause_c.setUEContent(this.rules.clause_c);
        this.$refs.clause_e.setUEContent(this.rules.clause_e);
      },
      /*
      * 获取UEditor编辑器中的内容
      * */
      getUeditorContent() {
        this.rules.clause_c = this.$refs.clause_c.getUEContent();
        this.rules.clause_e = this.$refs.clause_e.getUEContent();
      },
      onSubmit() {
        this.getUeditorContent();
        this.$refs.rules.validate((valid)=>{
          if(valid) {
            this.submitLoading = true;
            let data = {
              clause_c: this.rules.clause_c,
              clause_e: this.rules.clause_e,
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
// src/components/system/rules.vue