<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/level/list' }">會籍管理</el-breadcrumb-item>
        <el-breadcrumb-item>會籍詳情</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="level"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="level"
             :rules="rules"
             label-position="left" label-width="150px">
      <el-form-item label="會籍名" prop="name">
        <el-input placeholder="請輸入會籍名" v-model="level.name"></el-input>
      </el-form-item>
      <el-form-item label="會員卡正面" prop="cover">
        <single-img-upload
          :img-url="level.cover"
          is-inline
          @uploadOnSuccess="handleCoverImgSuccess"
          @uploadOnRemove="handleCoverImgRemove"
          @uploadOnError="handleImgError"></single-img-upload>
      </el-form-item>
      <el-form-item label="會員卡背面" prop="back">
        <single-img-upload
          :img-url="level.back"
          is-inline
          @uploadOnSuccess="handleBackImgSuccess"
          @uploadOnRemove="handleBackImgRemove"
          @uploadOnError="handleImgError"></single-img-upload>
      </el-form-item>
      <el-form-item label="會籍介紹" prop="introduce_c">
        <p>中文介紹</p>
        <el-input type="textarea"
                  :rows="5"
                  placeholder="請輸入中文"
                  v-model="level.introduce_c"></el-input>
        <!--<div class="editor-container">-->
          <!--<p>中文介紹</p>-->
          <!--<u-editor ref="introduce_c" :defaultMsg="level.introduce_c"  id="level_introduce_c"></u-editor>-->
        <!--</div>-->
      </el-form-item>
      <el-form-item prop="introduce_e">
        <p>英文介紹</p>
        <el-input type="textarea"
                  :rows="5"
                  placeholder="請輸入英文"
                  v-model="level.introduce_e"></el-input>
        <!--<div class="editor-container">-->
          <!--<p>英文介紹</p>-->
          <!--<u-editor ref="introduce_e" :defaultMsg="level.introduce_e"  id="level_introduce_e"></u-editor>-->
        <!--</div>-->
      </el-form-item>

      <el-form-item label="會籍優惠">
        <benefit-item v-for="(item,index) in level.extend"
                      ref="benefit"
                      :item="item"
                      :index="index"
                      @sortUp="extendSortUp"
                      @sortDown="extendSortDown"
                      @itemDelete="extendItemDelete"></benefit-item>
        <i class="el-icon-plus uploader-icon add-extend"
           @click="addBenefitItem"></i>
      </el-form-item>

      <el-form-item label="是否審核" prop="check">
        <el-switch v-model="level.check"
                   active-color="#409eff"
                   inactive-color="#c0c4cc">
        </el-switch>
      </el-form-item>

      <el-form-item v-if="(CREATE && !id) || (EDIT && id)">
        <el-button type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
      </el-form-item>
      </el-form>
  </div>
</template>

<script>
  // import UEditor from '../common/UEditor';
  import BenefitItem from './benefitItem';
  import SingleImgUpload from "../common/SingleImgUpload/SingleImgUpload";
  import {
    edit,
    save
  } from '@/api/level/levelDetail';
  import {
    baseVanke,
    baseUtil,
  } from '@/util/index';

  export default {
    name: "levelDetail",
    components: {
      // UEditor,
      BenefitItem,
      SingleImgUpload
    },
    data() {
      return {
        id: '',
        loading: false,
        submitLoading: false,
        rules: {
          name: [
            {required: true, message: '請輸入會籍名', trigger: 'blur'}
          ],
          introduce_c:[
            {required: true, message: '請輸入會籍介紹', trigger: 'blur'}
          ],
          introduce_e:[
            {required: true, message: '請輸入會籍介紹（英）', trigger: 'blur'}
          ],
          cover:[
            {required: true, message: '請添加會員卡正面圖片', trigger: 'change'}
          ],
          back:[
            {required: true, message: '請添加會員卡背面圖片', trigger: 'change'}
          ],
          check: [
            {required: true, message: '請選擇是否審核', trigger: 'change'}
          ]
        },

        VIEW: false,
        CREATE: false,
        EDIT: false,
        DELETE: false,
        EXPORT: false,
        level: {
          id: '',
          name: '',
          cover: '',
          back:'',
          introduce_c:'',
          introduce_e: '',
          check: false,
          is_check: '',
          extend: [
            // {
            //   id: '',
            //   level_id: '',
            //   pic: '',
            //   title_c: '',
            //   title_e: '',
            //   info_c: '',
            //   info_e: '',
            //   sort: ''
            // },
          ],
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
      /*
       * 初始化页面数据
       * */
      initDetail() {
        this.id = '';
        this.level = {
            id: '',
            name: '',
            cover: '',
            back:'',
            introduce_c:'',
            introduce_e: '',
            extend: [],
            is_check: '',
             check: false,
        };
        this.$refs.level.clearValidate(); // 清空规则
      },
      /*
      * 获取当前页面的详细信息
      * */
      getItemDetail() {
        this.loading = true;
        const self = this;
        this.id = this.$route.query.id;
        let reqData = {
          id: this.id
        };
        edit(reqData).then(function(response){
          if (!response.data.VIEW) {
            self.$message.error('沒有權限！');
            self.$router.push('/level/list');
            return;
          }
          self.VIEW = response.data.VIEW;
					self.CREATE = response.data.CREATE;
					self.EDIT = response.data.EDIT;
					self.DELETE = response.data.DELETE;
					self.EXPORT = response.data.EXPORT;
          if(self.id) {
            self.level =  Object.assign({}, self.level,response.data.levelInfo);
            self.level.check = self.level.is_check == '1'? true: false;
            // self.level.extend = self.extendFormat(self.level.extend);
            // self.setUeditorContent();
          }
        }).catch(function(error) {
          self.$message.error(error.message);
        }).finally(function() {
          self.loading = false;
        });
      },
      /*
     * 设置UEditor内容
     * */
      // setUeditorContent() {
      //   this.level.introduce_c = this.level.introduce_c || '';
      //   this.level.introduce_e = this.level.introduce_e || '';
      //   this.$refs.introduce_c.setUEContent(this.level.introduce_c);
      //   this.$refs.introduce_e.setUEContent(this.level.introduce_e);
      // },
      /*
      * 获取UEditor编辑器中的内容
      * */
      // getUeditorContent() {
      //   this.level.introduce_c = this.$refs.introduce_c.getUEContent();
      //   this.level.introduce_e = this.$refs.introduce_e.getUEContent();
      // },

      /*
      * 上传图片失败
      * */
      handleImgError(err) {
        this.$message.error(err.message);
      },
      /*
     * 上传正面图片
     * */
      handleCoverImgSuccess(res) {
        this.level.cover = res.url;
        this.$refs.level.validateField('cover'); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '上传成功!'
        });
      },
      /**
       * 刪除图片
       */
      handleCoverImgRemove() {
        this.level.cover = '';
        this.$refs.level.validateField('cover'); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '刪除成功!'
        });
      },
      /*
      * 上传背面图片
      * */
      handleBackImgSuccess(res) {
        this.level.back = res.url;
        this.$refs.level.validateField('back'); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '上传成功!'
        });
      },
      /**
       * 刪除图片
       */
      handleBackImgRemove() {
        this.level.back = '';
        this.$refs.level.validateField('back'); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '刪除成功!'
        });
      },

      /**
       * 优惠信息列表操作
       */
      extendSubmitFormat(extend) {
        if(extend instanceof Array) {
          extend.forEach((item,index) => {
            item.sort = index + 1;
          });
        }
      },
      /**
       * 添加会籍优惠
       */
      addBenefitItem() {
        let item ={
          level_id: this.id,
          pic: '',
          title_c: '',
          title_e: '',
          info_c: '',
          info_e: '',
          sort: ''
        };
        this.level.extend.push(item);
      },
      // 排序上移
      extendSortUp(index) {
        let extend = this.level.extend;
        if(index> 0) { // 不是第一个的可以上移
          extend = baseUtil.arrayChangeItem(extend,index,index-1);
        }
      },
      // 排序下移
      extendSortDown(index) {
        let extend = this.level.extend;
        if(index < extend.length-1) { // 不是最后一个的可以下移
          extend = baseUtil.arrayChangeItem(extend,index,index+1);
        }
      },
      // 删除条目
      extendItemDelete(index) {
        const self = this;
        this.$confirm('請注意此操作無法恢復，是否繼續?', '確認刪除操作', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          self.level.extend.splice(index,1);
          self.$message({
            type: 'success',
            message: '刪除成功!'
          });
        }).catch(function() {
          self.$message({
            type: 'info',
            message: '已取消刪除'
          });
        });
      },
      // 提交
      onSubmit() {
        // this.getUeditorContent(); //获取富文本编辑器内容
        const self = this;
        // 验证扩展组件的规则
        let benefitValid = true;
        this.level.extend.forEach(function(item,index){
          benefitValid = benefitValid && self.$refs.benefit[index].validateForm();
        });
        this.$refs.level.validate((valid)=>{
          if(valid && benefitValid) {
            this.submitLoading = true;
            this.extendSubmitFormat(this.level.extend); // 给extend添加sort字段值
            let data = {
              level:{
                name: this.level.name,
                cover: this.level.cover,
                back: this.level.back,
                introduce_c: this.level.introduce_c,
                introduce_e: this.level.introduce_e,
                is_check: this.level.check? '1':'0',
              },
              levelExtend: this.level.extend || []
            };
            if(this.id) { // 编辑状态，
              data.level.id =  this.id;
            }
            save(data).then(function() {
              self.$message({
                type: 'success',
                message: '提交成功!'
              });
              self.$router.push('/level/list');
            }).catch(function(error){
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

<style scoped>

  .add-extend {
    width: 50px;
    height:50px;
    line-height: 50px;
  }
</style>



// WEBPACK FOOTER //
// src/components/level/levelDetail.vue