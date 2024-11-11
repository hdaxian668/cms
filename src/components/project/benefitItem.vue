<template>
  <div class="benefit-part" >
    <div class="benefit-left">
      <el-form ref="item"
               :model="item"
               :rules="rules">
        <el-form-item label="會員號碼" prop="club_id" class="short-input">
          <el-input v-model="item.club_id"></el-input>
        </el-form-item>
        <!-- <el-form-item label="會員姓名" prop="name_c" class="short-input">
          <el-input v-model="item.name_c" disabled="disabled"></el-input>
        </el-form-item> -->
        <el-input v-model="item.name_c" disabled="disabled"></el-input>
        <el-input v-model="item.phone" disabled="disabled"></el-input>
        <el-input v-model="item.email" disabled="disabled"></el-input>
        <el-form-item label="修繕權限" prop="allow_report_defect" class="short-input">
          <el-radio-group v-model="item.allow_report_defect">
            <el-radio-button label="1" key="1">是</el-radio-button>
            <el-radio-button label="0" key="0">否</el-radio-button>
				  </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="benefit-right">
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
          club_id: [
            {required: true, message: '會員號碼', trigger: 'blur'}
          ],
          allow_report_defect: [
            {required: true, message: '修繕權限', trigger: 'blur'}
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
// src/components/project/benefitItem.vue