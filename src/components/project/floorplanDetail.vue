<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/project/list' }">項目管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/floorplan/list',query: {id:projectId,name:projectName } }">平面圖</el-breadcrumb-item>
        <el-breadcrumb-item>詳情</el-breadcrumb-item>
        <el-breadcrumb-item>{{ projectName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="floorplan"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="floorplan"
             :rules="rules"
             label-position="left"
             label-width="160px">

      <el-form-item label="平面圖" prop="image">
        <single-img-upload
          :img-url="floorplan.image"
          @uploadOnSuccess="handleCoverImgSuccess"
          @uploadOnRemove="handleCoverImgRemove"
          @uploadOnError="handleImgError"></single-img-upload>
      </el-form-item>

      <el-form-item label="編號" prop="mapping">
        <el-input v-model="floorplan.mapping" placeholder="編號" ></el-input>
      </el-form-item>
      


      <el-form-item v-if="FLOORPLAN">
        <el-button type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>



<script>
  // import UEditor from '../common/UEditor';
  import SingleImgUpload from "../common/SingleFPUpload/SingleImgUpload";
  import ImgCardsUpload from "../common/ImgCardsUpload/ImgCardsUpload";
  import BenefitItem from './benefitItem';
  import {
    edit,
    save
  } from '@/api/project/floorplanDetail';
  import {
    baseVanke,
    baseUtil,
  } from '@/util/index';

  export default {
    name: 'salesDetail',
    components: {
      // UEditor,
      ImgCardsUpload,
      SingleImgUpload,
      BenefitItem,
    },
    data() {
      return {
        id: '',
        loading: false,
        submitLoading: false,
        property_id: '',
        projectName: '',
        projectId: '',
        id:'',
        rand: 1,
        rules: {
          mapping:[
            {required: true, message: '請輸入編號', trigger: 'blur'}
          ],
          image: [
            {required: true, message: '請添加圖片', trigger: 'change'}
          ],
        },

        VIEW: false,
        CREATE: false,
        EDIT: false,
        DELETE: false,
        EXPORT: false,
        FLOORPLAN: false,
        floorplan: {
          id: "",
          property_id: "",
          image: "",
          property_name: "",
          tower_number: "",
          floor_display_name: "",
          unit_number: "",
          pasp_number: "",
          floor_plan: "",
          extend: [],
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
        this.property_id= '';
        this.projectName='';
        this.projectId='';
        this.id='';
        this.floorplan = {
          id: "",
          unit_id: "",
          property_id: "",
          image: "",
          tower_number: "",
          floor_display_name: "",
          unit_number: "",
          pasp_number: "",
          club_id: '',
          extend: [],
        };

        //this.$refs.activity.resetFields();
        this.$refs.floorplan.clearValidate(); // 清空规则
      },
      /* 获取当前页面的详细信息 */
      getItemDetail() {
        this.loading = true;
        const self = this;
        this.rand = Date.now()
        // this.id = this.$route.params.id;
        this.id = this.$route.query.id;
        this.property_id = this.$route.query.property_id;
        this.projectName = this.$route.query.name;
        this.projectId = this.$route.query.projectId;
        //this.id = this.$route.query.od;
        let reqData = {
          projectId: this.projectId,
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
          self.FLOORPLAN = response.data.FLOORPLAN;
          if(self.id) {
            self.floorplan = response.data.floorplanInfo;
            if(self.floorplan.image){
             // floorplan.image =floorplan.image+ '?rand=' + rand;
            }
            //self.floorplan.activityExtendShow = self.extendFormat(self.floorplan.activityExtend);

            //console.log(self.extendFormat(self.floorplan.activityExtend));
            // self.setUeditorContent();
          }
        }).catch(function(error) {
          self.$message.error(error.message);
        }).finally(function() {
          self.loading = false;
        });
      },

      /*
      * 上传封面图片
      * */
      handleCoverImgSuccess(res) {
        this.floorplan.image = res.url;
        this.$refs.floorplan.validateField('image'); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '上传成功!'
        });
      },
      /*
      * 删除封面图片
      * */
      handleCoverImgRemove() {
        this.floorplan.image = '';
        this.$refs.floorplan.validateField('image'); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '刪除成功!'
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
        this.$refs.floorplan.validate((valid)=>{
          if(valid) {
            this.submitLoading = true;
            let data = {
              floorplan:{
                id: this.id,
                property_id: this.projectId,
                image: this.floorplan.image,
                mapping: this.floorplan.mapping,
              },
              
            };
            if(this.id) {
              data.floorplan.id =  this.id;
            }
            save(data).then(function() {
              self.$message({
                type: 'success',
                message: '提交成功!'
              });
              self.$router.push({
                path: '/floorplan/list',
                query: {
                  id: self.projectId,
                  name: self.projectName,
                 // projectId: self.projectId,
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



// WEBPACK FOOTER //
// src/components/project/floorplanDetail.vue