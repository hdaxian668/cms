<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <!--<el-breadcrumb-item>系統管理</el-breadcrumb-item>-->
        <el-breadcrumb-item>溫馨提示</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="notice" :model="notice"
             v-loading="loading"
             element-loading-text="數據加載中"
             :rules="rules"
             label-position="left" label-width="150px">
      <el-form-item label="模板標籤">
        <el-row>
          <clipboard-tag v-for="item in tags" :tag="item">
          </clipboard-tag>
        </el-row>
        <p>點擊上方的標籤，複製關鍵字</p>
      </el-form-item>
      <el-form-item label="文本標籤" prop="reminder_c">
        <div class="editor-container">
          <p>中文</p>
          <el-input type="textarea"
                    :rows="5"
                    placeholder="請輸入中文"
                    v-model="notice.reminder_c"></el-input>
        </div>
      </el-form-item>
      <el-form-item prop="reminder_e">
        <div class="editor-container">
          <p>英文</p>
          <el-input type="textarea"
                    :rows="5"
                    placeholder="請輸入英文"
                    v-model="notice.reminder_e"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="是否啟用" prop="status">
        <el-radio-group v-model="notice.status">
          <el-radio-button
            v-for="item in statusList"
            :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import ClipboardTag from '../common/ClipboardTag/ClipboardTag'
  import {
    edit,
    save
  } from '@/api/message/notice'
  import { baseVanke } from '@/util/index';
    export default {
      name: "notice",
      components: {
        ClipboardTag,
      },
      data() {
          return {
            rules: {
              reminder_c : [
                { required: true, message: '請輸入提示信息（中）', trigger: 'blur'},
              ],
              reminder_e : [
                { required: true, message: '請輸入提示信息（英）', trigger: 'blur'},
              ],
              status : [
                { required: true, message: '請選擇是否啟用', trigger: 'change'},
              ],
            },
            loading: false,
            submitLoading: false,
            tags: [], // 模板标签
            statusList: [], // 状态
            notice: {
              reminder_c:'',
              reminder_e:'',
              status:'',
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
          this.tags = []; // 模板标签
          this.statusList= []; // 状态
          this.notice = {
            reminder_c:'',
            reminder_e:'',
            status:'',
          };
          this.$refs.notice.resetFields();
        },
        getItemDetail() {
          this.loading = true;
          edit().then((response) => {
            this.tags = response.data.tag;
            this.statusList = baseVanke.elFormatArray(response.data.status);
            this.notice = response.data.data;
          }).catch((error)=>{
            this.$message.error(error.message);
          }).finally(()=>{
            this.loading = false;
          })
        },
        onSubmit() {
          const self = this;
          this.$refs.notice.validate((valid)=>{
            if(valid) {
              this.submitLoading = true;
              let data = {
                reminder_c : this.notice.reminder_c,
                reminder_e : this.notice.reminder_e,
                status: this.notice.status,
              };
              save(data).then(function() {
                self.$message({
                  message: '提交成功',
                  type: 'success'
                });
              }).catch(function(error) {
                self.$message.error(error.message);
              }).finally(function() {
                self.submitLoading = false;
              })
            }else {
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
// src/components/message/notice.vue