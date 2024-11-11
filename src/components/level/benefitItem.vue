<template>
  <div class="benefit-part" >
    <div class="benefit-left">
      <el-form ref="item"
               :model="item"
               :rules="rules">
        <el-form-item prop="pic">
          <single-img-upload
            is-inline
            :img-style="imgStyle"
            :img-url="item.pic"
            @uploadOnSuccess="handleCoverImgSuccess"
            @uploadOnRemove="handleCoverImgRemove"
            @uploadOnError="handleImgError"></single-img-upload>
        </el-form-item>
        <el-form-item class="short-input" prop="title_c">
          <el-input placeholder="優惠名"
                    v-model="item.title_c" ></el-input>
        </el-form-item>
        <el-form-item class="long-input" prop="info_c">
          <el-input placeholder="針對會籍"
                    v-model="item.info_c"></el-input>
        </el-form-item>
        <el-form-item class="short-input" prop="title_e">
          <el-input placeholder="優惠名（英）"
                    v-model="item.title_e"></el-input>
        </el-form-item>
        <el-form-item class="long-input" prop="info_e">
          <el-input placeholder="針對會籍（英）"
                    v-model="item.info_e"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="benefit-right">
      <el-col class="benefit-right-left">
        <i class="el-icon-arrow-up el-icon" @click="sortUp"></i>
        <i class="el-icon-arrow-down el-icon" @click="sortDown"></i>
      </el-col>
      <el-col class="benefit-right-right">
        <i class="el-icon-delete el-icon" @click="itemDelete"></i>
      </el-col>
    </div>
  </div>
</template>

<script>
  import SingleImgUpload from "../common/SingleImgUpload/SingleImgUpload";
  export default {
    name: "benefitItem",
    data() {
      return {
        imgStyle: {
          width: '120px',
          height: '120px'
        },
        rules: {
          title_c: [
            {required: true, message: '請輸入優惠名', trigger: 'blur'}
          ],
          title_e: [
            {required: true, message: '請輸入優惠名（英）', trigger: 'blur'}
          ],
          info_c: [
            {required: true, message: '請輸入針對會籍', trigger: 'blur'}
          ],
          info_e: [
            {required: true, message: '請輸入針對會籍（英）', trigger: 'blur'}
          ],
          pic: [
            {required: true, message: '請上傳優惠圖片', trigger: 'change'}
          ],
        },
      }
    },
    components: {
      SingleImgUpload
    },
    props: {
      item: {
        type: Object
        // level_id: this.id,
        // pic: '',
        // title_c: '',
        // title_e: '',
        // info_c: '',
        // info_e: '',
        // sort: ''
      },
      index: {
        type: Number,
      }
    },
    methods: {
      /*
      * 上传图片失败
      * */
      handleImgError(err) {
        this.$message.error(err.message);
      },
      /*
      * 上传封面图片
      * */
      handleCoverImgSuccess(res) {
        this.item.pic = res.url;
        this.$refs.item.validateField('pic');
        this.$message({
          type: 'success',
          message: '上传成功!'
        });
      },
      /*
      * 删除封面图片
      * */
      handleCoverImgRemove() {
        this.item.pic = '';
        this.$refs.item.validateField('pic');
        this.$message({
          type: 'success',
          message: '刪除成功!'
        });
      },
      sortUp() {
        this.$emit('sortUp',this.index);
      },
      sortDown() {
        this.$emit('sortDown',this.index);
      },
      itemDelete() {
        this.$emit('itemDelete',this.index);
      },
      validateForm() {
        let flag = false;
        this.$refs.item.validate((valid) => {
          flag = valid
        });
        return flag;
      }

    }
  }
</script>

<style scoped>
  .el-icon {
    font-size: 20px;
    width: 40px;
    height: 40px;
    line-height: 40px;
  }
  .short-input {
    width: 35%;
    display: inline-block;
    margin-right: 10px;
  }
  .long-input {
    width: 60%;
    display: inline-block;
  }
  .benefit-part {
    margin-bottom: 22px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
  }
  .benefit-left {
    flex: 3;
  }
  .benefit-right {
    flex: 1;

    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
  }
  .benefit-right-left {
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }
  .benefit-right-right {
    flex: 1;
  }

</style>



// WEBPACK FOOTER //
// src/components/level/benefitItem.vue