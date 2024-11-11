<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/discounted/list' }">折扣管理</el-breadcrumb-item>
        <el-breadcrumb-item>折扣詳情</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="discount"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="discount"
             :rules="rules"
             label-position="left" label-width="150px">
      <el-form-item label="折扣標題" prop="title_c">
        <el-input v-model="discount.title_c" placeholder="請輸入折扣中文標題" id="discount-name"></el-input>
      </el-form-item>
      <el-form-item prop="title_e">
        <el-input v-model="discount.title_e" placeholder="請輸入折扣英文標題"></el-input>
      </el-form-item>
      <el-form-item label="折扣開始時間" prop="begin_date">
        <el-date-picker type="datetime" placeholder="選擇折扣開始時間"
                        v-model="discount.begin_date"
                        default-time="12:00:00"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="width: 100%;"
                        @change="handleBeginChange"
                        id="discount-start-time"></el-date-picker>
      </el-form-item>
      <el-form-item label="折扣結束時間" prop="end_date">
        <el-date-picker type="datetime" placeholder="選擇折扣結束時間"
                        v-model="discount.end_date"
                        default-time="12:00:00"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="width: 100%;"
                        id="discount-end-time"></el-date-picker>
      </el-form-item>
      <el-form-item label="會籍" prop="levels">
        <el-checkbox-group v-model="discount.levels">
          <el-checkbox
            v-for="item in levelList"
            :label="item.value" :key="item.value">
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="狀態" prop="visible">
        <el-radio-group v-model="discount.visible">
          <el-radio-button v-for="item in visibleList"  :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="圖片展示">
        <el-row class="vk-waring-text">圖片建議尺寸 16 : 9</el-row>
      </el-form-item>
      <el-form-item label="封面圖片（中）" prop="cover_c">
        <single-img-upload
          :img-url="discount.cover_c"
          @uploadOnSuccess="handleCoverImgSuccess($event,'cover_c')"
          @uploadOnRemove="handleCoverImgRemove('cover_c')"
          @uploadOnError="handleImgError"></single-img-upload>
      </el-form-item>
      <el-form-item label="封面圖片（英）" prop="cover_e">
        <single-img-upload
          :img-url="discount.cover_e"
          @uploadOnSuccess="handleCoverImgSuccess($event,'cover_e')"
          @uploadOnRemove="handleCoverImgRemove('cover_e')"
          @uploadOnError="handleImgError">
        </single-img-upload>
      </el-form-item>
      <el-form-item label="折扣圖片" prop="images">
        <img-cards-upload
          :upload-list="discount.images"
          @uploadOnSuccess="handleImgItemSuccess"
          @uploadOnRemove="handleImgItemRemove"
          @uploadOnError="handleImgError"
          @sortUp="handleImgItemSortUp"
          @sortDown="handleImgItemSortDown"></img-cards-upload>
      </el-form-item>
      <el-form-item label="折扣介紹" prop="introduce_c">
        <div class="editor-container">
          <p>中文</p>
          <u-editor ref="introduce_c" :defaultMsg="discount.introduce_c"  id="discount_introduce_c"></u-editor>
        </div>
      </el-form-item>
      <el-form-item prop="introduce_e">
        <div class="editor-container">
          <p>英文</p>
          <u-editor ref="introduce_e" :defaultMsg="discount.introduce_e"  id="discount_introduce_e"></u-editor>
        </div>
      </el-form-item>
      <el-form-item label="折扣條款" prop="clause_c">
        <div class="editor-container">
          <p>中文</p>
          <u-editor ref="clause_c" :defaultMsg="discount.clause_c"  id="discount_clause_c"></u-editor>
        </div>
      </el-form-item>
      <el-form-item prop="clause_e">
        <div class="editor-container">
          <p>英文</p>
          <u-editor ref="clause_e" :defaultMsg="discount.clause_e"  id="discount_clause_e"></u-editor>
        </div>
      </el-form-item>


      <div id="preview-holder--3">
          <div id="preview-discount" class="preview-content">

              <div class="path">
                  特許優惠 >
              </div>
              <h2 id="preview-discount__title">
              </h2>
              <div class="content-left">
                  <div class="content-row">
                      <div class="content-row-title">折扣時間</div>
                      <div id="preview-discount__time" class="content-row-content">
                       </div>
                  </div>
                  <div  class="content-row">
                      <div class="content-row-title">詳情</div>
                      <div id="preview-discount__detail" class="content-row-content">
                      </div>
                  </div>
              </div>

              <div class="content-right">
                  <div class="content-banner">
                      <img id="discount-image"
                          src="">
                  </div>
                  <div>
                      <img style="margin: 12px 0px;" src="http://vanke-web.firm.hk/images/preview-tool-bar2.png">
                  </div>
                  <p style="margin: 0 0 10px; font-size: 16px; font-weight: bold;" >折扣條款及細則 :</p>
                  <div id="preview-discount__term" class="discount-term">

                  </div>

              </div>
          </div>
      </div>


      <div id="preview-holder--4">
          <div id="preview-discount-m3" class="preview-discount-m">
              <div class="preview-banner">
                  <div class="banner-img">
                      <img id="m-discount-banner-img" src="https://images.pexels.com/photos/2237801/pexels-photo-2237801.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940">
                  </div>
                  <div class="banner-item">
                      <span></span>
                      <span></span>
                      <span></span>
                  </div>
              </div>

              <div id="m-discount-title">
              </div>
              
              <div class="content-row">
                  <div class="row-title">
                      日期
                  </div>
                  <div class="row-content" id="m-discount-time">
                  </div>
              </div>

              <div id="m-discount-desc">
              </div>


          </div>

          <div id="preview-discount-m4" class="preview-discount-m">
              <div class="term-header">
                  條款及細則
              </div>
              <div id="m-discount-term">
              
              </div>
          </div>
      </div>
      

      <el-form-item v-if="(CREATE && !id) || (EDIT && id)">
        <el-button type="primary" :loading="submitLoading"  @click="onSubmit">提交</el-button>
        <el-button type="primary" :loading="submitLoading" id="discount_preview_dt">預視桌面版</el-button>
        <el-button type="primary" :loading="submitLoading" id="discount_preview_mb">預視App版</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    save,
    edit
  } from '@/api/discounted/discountedDetail';
  import UEditor from '../common/UEditor';
  import {
    baseVanke,
    baseUtil,
  } from '@/util/index';
  import SingleImgUpload from "../common/SingleImgUpload/SingleImgUpload";
  import ImgCardsUpload from "../common/ImgCardsUpload/ImgCardsUpload";

  export default {
    name: "discountedDetail",
    components: {
      UEditor,
      SingleImgUpload,
      ImgCardsUpload,
    },
    data() {
      const checkEndDate = (rule, value, callback) => {
        if(value === '') {
          callback(new Error('請選擇日期'));
        } else {
          if(value < this.discount.begin_date) {
            callback(new Error('結束日期應大於開始日期'));
          } else {
            callback();
          }
        }
      };
        return {
          id: '',
          loading: false,
          submitLoading: false,
          rules: {
            title_c: [
              {required: true, message: '請輸入折扣標題（中）', trigger: 'blur'}
            ],
            title_e: [
              {required: true, message: '請輸入折扣標題（英）', trigger: 'blur'}
            ],
            begin_date: [
              {required: true, message: '請選擇開始日期', trigger: 'change' }
            ],
            end_date: [
              {required: true, message: '請選擇結束日期', trigger: 'change' },
              { validator: checkEndDate, trigger: 'change'},
            ],
            levels: [
              {required: true, message: '請選擇會籍', trigger: 'change'}
            ],
            visible: [
              {required: true, message: '請選擇折扣狀態', trigger: 'change'}
            ],
            introduce_c:[
              {required: true, message: '請輸入折扣介紹（中）', trigger: 'change'}
            ],
            introduce_e:[
              {required: true, message: '請輸入折扣介紹（英）', trigger: 'change'}
            ],
            clause_c:[
              {required: true, message: '請輸入折扣條款（中）', trigger: 'change'}
            ],
            clause_e:[
              {required: true, message: '請輸入折扣條款（英）', trigger: 'change'}
            ],
            cover_c:[
              {required: true, message: '請添加封面圖片（中）', trigger: 'change'}
            ],
            cover_e:[
              {required: true, message: '請添加封面圖片（英）', trigger: 'change'}
            ],
            images: [
              {required: true, message: '請添加折扣圖片', trigger: 'change'}
            ]
          },
          visibleList: [],
          levelList: [],

          VIEW: false,
          CREATE: false,
          EDIT: false,
          DELETE: false,
          EXPORT: false,
          discount: {
            clause_c:'',
            clause_e:'',
            cover_c:'',
            cover_e:'',
            begin_date:'',
            end_date: '',
            levels: [],
            id:'',
            images:[],
            introduce_c:'',
            introduce_e:'',
            title_c:'',
            title_e:'',
            visible:'',
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
        this.levelList = [];
        this.discount = {
            clause_c:'',
            clause_e:'',
            cover_c:'',
            cover_e:'',
            begin_date:'',
            end_date: '',
            levels: [],
            id:'',
            images: [],
            introduce_c:'',
            introduce_e:'',
            title_c:'',
            title_e:'',
            visible:'',
        };
        this.$refs.discount.resetFields();
        // this.$refs.discount.clearValidate(); // 清空规则
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
        edit(reqData).then(function(response){
          if (!response.data.VIEW) {
            self.$message.error('沒有權限！');
            self.$router.push('/discounted/list');
            return;
          }
          self.VIEW = response.data.VIEW;
					self.CREATE = response.data.CREATE;
					self.EDIT = response.data.EDIT;
					self.DELETE = response.data.DELETE;
					self.EXPORT = response.data.EXPORT;
          self.visibleList = baseVanke.elFormatArray(response.data.visible);
          self.levelList = baseVanke.elFormatArray(response.data.levelList);
          if(self.id) {
            self.discount = response.data.discountInfo;
            // self.setUeditorContent();
          }
        }).catch(function(error) {
          self.$message.error(error.message);
        }).finally(function() {
          self.loading = false;
        });
      },
      /**
       * 开始日期改变触发规则
       */
      handleBeginChange() {
        this.$refs.discount.validateField('end_date');
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
      /*
      * 删除封面图片
      * */
      handleCoverImgRemove(type) {
        this.discount[type] = '';
        this.$refs.discount.validateField(type); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '刪除成功！'
        });
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

      /*
      * 设置UEditor内容
      * */
      setUeditorContent() {
        this.$refs.introduce_c.setUEContent(this.discount.introduce_c);
        this.$refs.introduce_e.setUEContent(this.discount.introduce_e);
        this.$refs.clause_c.setUEContent(this.discount.clause_c);
        this.$refs.clause_e.setUEContent(this.discount.clause_e);
      },
      /*
      * 获取UEditor编辑器中的内容
      * */
      getUeditorContent() {
        this.discount.introduce_c = this.$refs.introduce_c.getUEContent();
        this.discount.introduce_e = this.$refs.introduce_e.getUEContent();
        this.discount.clause_c = this.$refs.clause_c.getUEContent();
        this.discount.clause_e = this.$refs.clause_e.getUEContent();
      },
      /**
       * 提交保存数据
       */
      onSubmit() {
        const self = this;
        // this.discount.images = JSON.stringify(this.uploadUrlList);
        this.getUeditorContent();
        this.$refs.discount.validate((valid)=>{
          if(valid) {
            this.submitLoading = true;
            let data = {
              // id: this.discount.id,
              title_c: this.discount.title_c,
              title_e: this.discount.title_e,
              begin_date:this.discount.begin_date,
              end_date: this.discount.end_date,
              levels: JSON.stringify(this.discount.levels),
              cover_c: this.discount.cover_c, //	封面图片
              cover_e: this.discount.cover_e, //	封面图片
              images: JSON.stringify(this.discount.images),
              introduce_c: this.discount.introduce_c,
              introduce_e: this.discount.introduce_e,
              clause_c: this.discount.clause_c,
              clause_e: this.discount.clause_e,
              visible: this.discount.visible,
            };
            if(this.id) {
              data.id =  this.id;
            }
            save(data).then(function() {
              self.$message({
                message: '提交成功',
                type: 'success'
              });
              self.$router.push('/discounted/list');
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
// src/components/discounted/discountedDetail.vue