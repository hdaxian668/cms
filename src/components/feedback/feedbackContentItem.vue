<template>
  <div class="feedback-remark-part" >
    <el-form ref="item"
              :model="item"
              :rules="rules">

      <el-form-item class="row-input" prop="category" style="width: 20% !important; margin-bottom: 5px;">
        <el-select v-model="item.category" placeholder="查詢類別" class="selects-item" value-key="item.category">
          <el-option key="" value="" label="請選擇查詢類別"></el-option>
          <el-option key="1" value="1" label="會籍查詢"></el-option>
          <el-option key="2" value="2" label="銷售查詢"></el-option>
          <el-option key="3" value="3" label="物業管理查詢"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="row-input" prop="" style="width: 4% !important; margin-bottom: 5px; float: right;">
        <i class="el-icon-delete el-icon" @click="itemDelete"></i>
      </el-form-item>

      <el-form-item class="row-input" prop="content" style="display: block; width: 100% !important;">
        <el-input type="textarea"
                  :rows="5"
                  placeholder="請輸入反馈内容"
                  v-model="item.content"></el-input>
      </el-form-item>
      
    </el-form>
  </div>
</template>

<script>
  import SingleImgUpload from "../common/SingleImgUpload/SingleImgUpload";
  export default {
    name: "feedbackContentItem",
    data() {
      return {
        imgStyle: {
          width: '120px',
          height: '120px'
        },
        rules: {
          content: [
            {required: true, message: '請輸入反饋内容', trigger: 'blur'}
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
      },
      index: {
        type: Number,
      }
    },
    methods: {
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
  .row-input {
    display: inline-block;
    vertical-align: top;
    min-width: auto !important;
  }

  .el-icon {
    font-size: 20px;
    width: 30px;
    height: 30px;
    line-height: 30px;
  }
</style>



// WEBPACK FOOTER //
// src/components/feedback/feedbackContentItem.vue