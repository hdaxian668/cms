<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/project/list' }">項目管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/progress/list',query: {id:projectId,name:projectName } }">施工進度</el-breadcrumb-item>
        <el-breadcrumb-item>進度詳情</el-breadcrumb-item>
        <el-breadcrumb-item>{{ projectName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="progress"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="progress"
             :rules="rules"
             label-position="left"
             label-width="160px">
      <el-form-item label="描述標題" prop="title_c">
        <el-input v-model="progress.title_c" placeholder="中文"></el-input>
      </el-form-item>
      <el-form-item prop="title_e">
        <el-input v-model="progress.title_e" placeholder="英文"></el-input>
      </el-form-item>
      <el-form-item label="更新日期" prop="progress_time">
        <el-date-picker type="datetime" placeholder="選擇更新時間"
                        v-model="progress.progress_time"
                        default-time="12:00:00"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="width: 100%;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="項目圖片" prop="pic_url">
        <img-cards-upload
          :upload-list="progress.pic_url"
          @uploadOnSuccess="handleImgItemSuccess"
          @uploadOnRemove="handleImgItemRemove"
          @uploadOnError="handleImgError"
          @sortUp="handleImgItemSortUp"
          @sortDown="handleImgItemSortDown"></img-cards-upload>
      </el-form-item>
      <el-form-item label="詳細描述" prop="desc_c">
        <p>中文</p>
        <el-input type="textarea"
                  :rows="5"
                  placeholder="請輸入中文"
                  v-model="progress.desc_c"></el-input>
        <!--<div class="editor-container">-->
          <!--<u-editor ref="desc_c" :defaultMsg="progress.desc_c"  id="desc_c"></u-editor>-->
        <!--</div>-->
      </el-form-item>
      <el-form-item prop="desc_e">
        <p>英文</p>
        <el-input type="textarea"
                  :rows="5"
                  placeholder="請輸入英文"
                  v-model="progress.desc_e"></el-input>
        <!--<div class="editor-container">-->
          <!--<u-editor ref="desc_e" :defaultMsg="progress.desc_e"  id="desc_e"></u-editor>-->
        <!--</div>-->
      </el-form-item>
      <el-form-item v-if="PROGRESS">
        <el-button type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  // import UEditor from '../common/UEditor';
  import ImgCardsUpload from "../common/ImgCardsUpload/ImgCardsUpload";
  import {
    edit,
    save
  } from '@/api/project/progressDetail';
  import {
    baseVanke,
    baseUtil,
  } from '@/util/index';

  export default {
    name: 'progressDetail',
    components: {
      // UEditor,
      ImgCardsUpload,
    },
    data() {
      return {
        id: '',
        loading: false,
        submitLoading: false,
        projectId: '',
        projectName: '',
        rules: {
          title_c: [
            {required: true, message: '請輸入描述標題', trigger: 'blur'}
          ],
          title_e: [
            {required: true, message: '請輸入描述標題（英）', trigger: 'blur'}
          ],
          desc_c:[
            {required: true, message: '請輸入詳細描述', trigger: 'blur'}
          ],
          desc_e:[
            {required: true, message: '請輸入詳細描述（英）', trigger: 'blur'}
          ],
          pic_url: [
            {required: true, message: '請添加圖片', trigger: 'change'}
          ],
          progress_time: [
            {required: true, message: '請選擇日期', trigger: 'change' }
          ],
        },

        VIEW: false,
        CREATE: false,
        EDIT: false,
        DELETE: false,
        EXPORT: false,
        PROGRESS: false,
        progress: {
          id: "",
          project_id: "",
          title_c: "",
          title_e: "",
          pic_url: [],
          desc_c: "",
          desc_e: "",
          progress_time: '',
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
        this.projectId= '';
        this.projectName='';
        this.progress = {
          id: "",
          project_id: "",
          title_c: "",
          title_e: "",
          pic_url: [],
          desc_c: "",
          desc_e: "",
          progress_time: '',
        };
        this.$refs.progress.clearValidate(); // 清空规则
      },
      /* 获取当前页面的详细信息 */
      getItemDetail() {
        this.loading = true;
        const self = this;
        // this.id = this.$route.params.id;
        this.id = this.$route.query.id;
        this.projectId = this.$route.query.projectId;
        this.projectName = this.$route.query.name;
        let reqData = {
          id: this.id
        };
        edit(reqData).then(function(response){
          if (!response.data.VIEW) {
            self.$message.error('沒有權限！');
            self.$router.push('/project/list');
            return;
          }
          self.VIEW = response.data.VIEW;
          self.CREATE = response.data.CREATE;
          self.EDIT = response.data.EDIT;
          self.DELETE = response.data.DELETE;
          self.EXPORT = response.data.EXPORT;
          self.PROGRESS = response.data.PROGRESS;
          if(self.id) {
            self.progress = response.data.progressInfo;
            // self.setUeditorContent();
          }
        }).catch(function(error) {
          self.$message.error(error.message);
        }).finally(function() {
          self.loading = false;
        });
      },
      /*
      * 上传图片失败
      * */
      handleImgError() {
        this.$message.error('上传失败，請稍後重試！');
      },

      /**
       * 上传图片成功，将图片信息存入数组中
       * @param res - 上传图片成功的返回值
       */
      handleImgItemSuccess(res) {
        this.progress.pic_url.push(res.url);
        this.$refs.progress.validateField('pic_url'); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '上传成功!'
        });
      },
      /*
      * 删除图片
      * */
      handleImgItemRemove(index) {
        this.progress.pic_url.splice(index,1); // 刪除這一項
        this.$refs.progress.validateField('pic_url'); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '刪除成功!'
        });
      },
      /*
      * 图片前移
      * */
      handleImgItemSortUp(index) {
        let list = this.progress.pic_url;
        if(index> 0) { // 不是第一个的可以上移
          list = baseUtil.arrayChangeItem(list,index,index-1);
        }
      },
      /*
      * 图片后移
      * */
      handleImgItemSortDown(index) {
        let list = this.progress.pic_url;
        if(index < list.length-1) { // 不是最后一个的可以下移
          list  = baseUtil.arrayChangeItem(list ,index,index+1);
        }
      },
      /*
      * 设置UEditor内容
      * */
      // setUeditorContent() {
      //   this.progress.desc_c = this.progress.desc_c || '';
      //   this.progress.desc_e = this.progress.desc_e || '';
      //   this.$refs.desc_c.setUEContent(this.progress.desc_c);
      //   this.$refs.desc_e.setUEContent(this.progress.desc_e);
      // },
      /*
      * 获取UEditor编辑器中的内容
      * */
      // getUeditorContent() {
      //   this.progress.desc_c = this.$refs.desc_c.getUEContent();
      //   this.progress.desc_e = this.$refs.desc_e.getUEContent();
      // },
      onSubmit() {
        // this.getUeditorContent();
        const self = this;
        this.$refs.progress.validate((valid)=>{
          if(valid) {
            this.submitLoading = true;
            let data = {
              progress:{
                project_id: this.projectId,
                progress_time: this.progress.progress_time,
                title_c: this.progress.title_c,
                title_e: this.progress.title_e,
                pic_url: JSON.stringify(this.progress.pic_url),
                desc_c: this.progress.desc_c,
                desc_e: this.progress.desc_e,
              },
            };
            if(this.id) {
              data.progress.id =  this.id;
            }
            save(data).then(function() {
              self.$message({
                type: 'success',
                message: '提交成功!'
              });
              self.$router.push({
                path: '/progress/list',
                query: {
                  id: self.projectId,
                  name: self.projectName,
                }
              })
            }).catch(function(error) {
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

<style lang="less" scoped>

  .add-extend {
    width: 50px;
    height:50px;
    line-height: 50px;
  }

  .photo {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>



// WEBPACK FOOTER //
// src/components/project/progressDetail.vue