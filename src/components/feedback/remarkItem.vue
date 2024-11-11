<template>
  <div class="feedback-remark-part">
    <el-form ref="item"
              :model="item"
              :rules="rules">

      <el-form-item class="short-input" prop="" style="width: 15% !important;">
        <el-input placeholder="負責人"
                  v-model="item.create_user_info.name" disabled="true" ></el-input>
      </el-form-item>

      <!--
      <el-form-item prop="assigned_group_id" class="short-input" style="width: 15% !important;">
        <el-select v-model="item.assigned_group_id" placeholder="(系統自動填寫)" class="selects-item" value-key="item.assigned_group_id" :disabled="true">
          <el-option key="" value="" label="(系統自動填寫)"></el-option>
          <el-option
            v-for="tmp in this.$parent.userGroupList"
            :key="tmp.id"
            :label="tmp.name"
            :value="tmp.id">
          </el-option>
        </el-select>
      </el-form-item>
      -->

      <el-form-item class="short-input" prop="" style="width: 15% !important;">
        <el-input placeholder=""
                  v-model="item.assigned_group_name" disabled="true" ></el-input>
      </el-form-item>

      <el-form-item prop="status" class="short-input" style="width: 15% !important;">
        <el-select v-model="item.status" placeholder="(系統自動填寫)" class="selects-item" value-key="item.status" :disabled="true">
          <el-option key="" value="" label="(系統自動填寫)"></el-option>
          <el-option key="1" value="1" label="開放"></el-option>
          <el-option key="2" value="2" label="處理中"></el-option>
          <el-option key="3" value="3" label="已完成"></el-option>
          <el-option key="4" value="4" label="關閉"></el-option>
          <el-option key="5" value="5" label="拒絕"></el-option>
          <el-option key="6" value="6" label="取消"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="short-input" prop="remark_date" style="width: 20% !important;">
        <el-date-picker type="datetime" placeholder="日期"
                        v-model="item.remark_date"
                        default-time="12:00:00"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions"
                        :readonly="(item.id)"></el-date-picker>
      </el-form-item>

      <el-form-item class="long-input" prop="content" style="width: 33% !important;">
        <el-input type="textarea"
                  :rows="5"
                  placeholder="請輸入備註"
                  v-model="item.content" :readonly="(item.id)"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SingleImgUpload from "../common/SingleImgUpload/SingleImgUpload";
  export default {
    name: "remarkItem",
    data() {
      return {
        imgStyle: {
          width: '120px',
          height: '120px'
        },
        rules: {
          remark_date: [
            {required: true, message: '請輸入備註日期', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '請輸入備註內容', trigger: 'blur'}
          ],
        },

        pickerOptions: { disabledDate: this.disabledDate },
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
      },

      disabledDate(date) {
        return date.getTime() > Date.now();
      },

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

  .short-input, .long-input {
    display: inline-block;
    vertical-align: top;
    min-width: auto !important;
  }

  .short-input .el-input, .long-input .el-input {
    width: 100% !important;
  }

  .feedback-remark-part {
    margin-bottom: 22px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
  }

  .feedback-remark-part form {
    width: 100%;
  }

</style>



// WEBPACK FOOTER //
// src/components/feedback/remarkItem.vue