<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"> 首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/advert/list' }">廣告管理</el-breadcrumb-item>
        <el-breadcrumb-item>廣告詳情</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="advert"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="advert" :rules="rules"
             label-position="left" label-width="150px">
      <el-form-item label="廣告位置" prop="site">
        <el-select v-model="advert.site" placeholder="請選擇廣告位置"
                   @change="handleSiteChange">
          <el-option
            v-for="item in siteList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跳轉到" prop="jump_type">
        <el-select v-model="advert.jump_type"
                   @change="handleJumpChange"
                   placeholder="請選擇跳轉位置">
          <el-option v-if="advert.site === '1' || item.value !== '5'"
            v-for="item in jumpList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="參數配置">
      </el-form-item> -->

      <el-form-item label="中文標題" prop="title_c"
                    v-if="advert.site === '1' && advert.jump_type !== '2'">
        <el-input v-model="advert.title_c"
                  placeholder="最多可填寫15個字"
                  maxlength="15"></el-input>
      </el-form-item>
      <el-form-item label="英文標題" prop="title_e"
                    v-if="advert.site === '1' && advert.jump_type !== '2'">
        <el-input v-model="advert.title_e"
                  placeholder="最多可填寫80個字符"
                  maxlength="80"></el-input>
      </el-form-item>
      <el-form-item label="中文標題" prop="title_c"
                    v-if="advert.site === '2'">
        <el-input v-model="advert.title_c"
                  placeholder="中文標題"
                  maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="英文標題" prop="title_e"
                    v-if="advert.site === '2'">
        <el-input v-model="advert.title_e"
                  placeholder="英文標題"
                  maxlength="8000"></el-input>
      </el-form-item>
      <el-form-item label="網址" prop="url"
                    v-if="advert.jump_type === '1' || advert.site === '2'&& advert.jump_type === '4'">
        <el-input v-model="advert.url"
                  placeholder="請輸入網址"></el-input>
      </el-form-item>
      <el-form-item label="跳轉項目" prop="jump_id"
                    v-if="advert.jump_type === '4' && advert.site === '1'">
        <el-select v-model="advert.jump_id" placeholder="請選擇跳轉項目名">
          <el-option
            v-for="item in projectList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跳轉活動" prop="jump_id" v-if="advert.jump_type === '3'">
        <el-select v-model="advert.jump_id" placeholder="請選擇跳轉活動名">
          <el-option
            v-for="item in activityList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跳轉折扣" prop="jump_id" v-if="advert.jump_type === '5'">
        <el-select v-model="advert.jump_id" placeholder="請選擇跳轉折扣名">
          <el-option
            v-for="item in discountedList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="中文圖片" prop="picture_c">
        <el-row class="vk-waring-text">首頁圖片建議尺寸1170 x 432，其他頁面建議16:9</el-row>
        <single-img-upload
         
          :img-url="advert.picture_c"
          @uploadOnSuccess="handleCoverImgSuccess($event,'picture_c')"
          @uploadOnRemove="handleCoverImgRemove('picture_c')"
          @uploadOnError="handleImgError"></single-img-upload>
      </el-form-item>
      <el-form-item label="英文圖片" prop="picture_e">
        <el-row class="vk-waring-text">首頁圖片建議尺寸1170 x 432，其他頁面建議 16 : 9</el-row>
        <single-img-upload
         
          :img-url="advert.picture_e"
          @uploadOnSuccess="handleCoverImgSuccess($event,'picture_e')"
          @uploadOnRemove="handleCoverImgRemove('picture_e')"
          @uploadOnError="handleImgError">
        </single-img-upload>
      </el-form-item>
      <!--<el-form-item label="排序（越小越在前面）" prop="sort">-->
        <!--<el-input  v-model="advert.sort" placeholder="請輸入排序數字"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="狀態" prop="visible">
        <el-radio-group v-model="advert.visible">
          <el-radio-button v-for="item in visibleList" :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="(CREATE && !id) || (EDIT && id)">
        <el-button type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import { edit,save } from '@/api/system/adDetail';
  import {
    baseVanke,
    baseUtil ,
  } from '@/util/index';
  import SingleImgUpload from "../common/SingleImgUpload/SingleImgUpload";

  export default {
    name: "adDetail",
    components: {
      SingleImgUpload,
    },
    data() {
        return {
          id: '',
          loading: false,
          submitLoading: false,
          rules: {
            site: [
              { required: true, message: '請選擇廣告位置', trigger: 'change' }
            ],
            jump_type: [
              { required: true, message: '請選擇跳轉位置', trigger: 'change' }
            ],
            title_c: [
              { required: true, message: '請輸入中文標題', trigger: 'blur' },
            ],
            title_e: [
              { required: true, message: '請輸入英文標題', trigger: 'blur' }
            ],
            url: [
              { required: true, message: '請輸入網址', trigger: 'blur' }
            ],
            jump_id: [
              { required: true, message: '請選擇跳轉目标', trigger: 'change' }
            ],
            picture_c: [
              { required: true, message: '請上傳圖片（中）', trigger: 'change' }
            ],
            picture_e: [
              { required: true, message: '請上傳圖片（英）', trigger: 'change' }
            ],
            visible: [
              { required: true, message: '請選擇狀態', trigger: 'change' }
            ],
          },

          siteList: [], // 位置选择列表
          jumpList: [], // 跳转选择列表
          visibleList:[], // 状态选择列表
          activityList: [], // 活动列表
          projectList:[], // 项目列表
          discountedList: [], // 折扣列表
          defaultText: '原項目已下架',

          VIEW: false,
          CREATE: false,
          EDIT: false,
          DELETE: false,
          EXPORT: false,
          advert: {
            id: '',
            site: '',
            jump_id: '',
            jump_type: '',
            title_c: '',
            title_e: '',
            url: '',
            picture_c: '',
            picture_e: '',
            // sort: '',
            visible: '',
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
        this.siteList = [];
        this.jumpList = [];
        this.visibleList = [];
        this.activityList = [];
        this.projectList = [];
        this.discountedList = [];

        this.advert = {
          id: '',
          site: '',
          jump_id: '',
          jump_type: '',
          title_c: '',
          title_e: '',
          url: '',
          picture_c: '',
          picture_e: '',
          // sort: '',
          visible: '',
        };
        this.$refs.advert.resetFields(); // 表单进行重置
        // this.$refs.advert.clearValidate(); // 清空规则
      },
      /**
       * 判断jump_id 是否存在
       */
      idExist(id,list) {
        let isExist = false;
        list.forEach(function(item) {
          if(item.value === id) {
            isExist = true;
          }
        });
        return isExist;
      },
      /*
      * 获取当前页面的详细信息
      * */
      getItemDetail() {
        this.loading = true;
        let self = this;
        this.id = this.$route.query.id;
        let reqData = {
          id: this.id
        };
        edit(reqData).then(function(response) {
          if (!response.data.VIEW) {
            self.$message.error('沒有權限！');
            self.$router.push('/advert/list');
            return;
          }
          self.VIEW = response.data.VIEW;
					self.CREATE = response.data.CREATE;
					self.EDIT = response.data.EDIT;
					self.DELETE = response.data.DELETE;
					self.EXPORT = response.data.EXPORT;
          self.siteList = baseVanke.elFormatArray(response.data.site);
          self.visibleList = baseVanke.elFormatArray(response.data.visible);
          self.jumpList = baseVanke.elFormatArray(response.data.jump_type);
          self.projectList = baseVanke.elFormatArray(response.data.list.project, 'id', 'name_c');
          self.activityList = baseVanke.elFormatArray(response.data.list.activity, 'id', 'title_c');
          self.discountedList = baseVanke.elFormatArray(response.data.list.discounted, 'id', 'title_c');
          if (self.id) {
            self.advert = response.data.advertInfo;
            if (self.advert.jump_id && self.advert.jump_type) {
              if (!self.idExist(self.advert.jump_id, self.projectList) && !self.idExist(self.advert.jump_id, self.activityList) && !self.idExist(self.advert.jump_id, self.discountedList)) {
                self.advert.jump_id = self.defaultText;
              }
            }
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
      handleImgError(err) {
        this.$message.error(err.message);
      },
      /*
     * 上传封面图片
     * */
      handleCoverImgSuccess(event,type) {
        this.advert[type] = event.url;
        this.$refs.advert.validateField(type); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '上传成功!'
        });
      },
      /*
      * 图片移除
      * */
      handleCoverImgRemove(type) {
        this.advert[type] = '';
        this.$refs.advert.validateField(type); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '刪除成功!'
        });
      },
      /*
      * 跳转类型修改
      * 修改跳转类型时，清空jump_id,URL;
      * */
      handleJumpChange() {
        this.advert.jump_id = '';
        this.advert.url = '';
        this.advert.title_c = '';
        this.advert.title_e = '';
      },
      /*
      *  广告位置修改
      *  修改广告位置时，清空 jump_type,jump_id,url*
       */
      handleSiteChange() {
        this.advert.jump_type = '';
        this.advert.jump_id = '';
        this.advert.url = '';
        this.advert.title_c = '';
        this.advert.title_e = '';
      },
      /**
       * 提交保存
       */
      onSubmit() {
        const self = this;
        this.$refs.advert.validate((valid)=>{
          if(valid) {
            this.submitLoading = true;
            let data = {
              advert: {
                // id: this.advert.id,
                site: this.advert.site,
                jump_type: this.advert.jump_type,
                title_c: this.advert.title_c,
                title_e: this.advert.title_e,
                url: this.advert.url,
                jump_id: this.advert.jump_id,
                project: this.advert.project,
                activity: this.advert.activity,
                discounted: this.advert.discounted,
                picture_c: this.advert.picture_c,
                picture_e: this.advert.picture_e,
                // sort: this.advert.sort,
                visible: this.advert.visible,
              }
            };
            if(this.id) {
              data.advert.id =  this.id;
            }
            save(data).then(function() {
              self.$message({
                type: 'success',
                message: '提交成功!'
              });
              self.$router.push('/advert/list');
            }).catch(function(error) {
              self.$message.error(error.message);
            }).finally(function() {
              self.submitLoading = false;
            });
          } else {
            this.$message.error('表單填寫有誤！');
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
// src/components/system/adDetail.vue