<template>
    <div class="video-item">
      <div class="video-item-left">
        <el-form ref="item" :model="item" :rules="rules" :inline="true">
          <el-form-item prop="image_url">
            <cover-upload :img-url="item.image_url"
                          :img-style="cardStyle"
                          @uploadOnSuccess="uploadCoverSuccess"></cover-upload>
          </el-form-item>
          <el-form-item prop="video_url">
            <video-upload :videoUrl="item.video_url"
                          :videoStyle="cardStyle"
                          @uploadOnSuccess="uploadVideoSuccess"></video-upload>
          </el-form-item>
        </el-form>
      </div>
      <div class="video-item-right">
        <el-col class="video-item-right-left">
          <i class="el-icon-arrow-up el-icon" @click="sortUp"></i>
          <i class="el-icon-arrow-down el-icon" @click="sortDown"></i>
        </el-col>
        <el-col class="video-item-right-right">
          <i class="el-icon-delete el-icon" @click="itemDelete"></i>
        </el-col>
      </div>
    </div>
</template>

<script>
  import VideoUpload from './VideoUpload'
  import CoverUpload from './CoverUpload'
  export default {
    name: "VideoCardWithCover",
    components: {
      VideoUpload,
      CoverUpload,
    },
    props: {
      item: {
        type: Object,
      },
      index: {
        type: Number
      }
    },
    data() {
      return {
        rules: {
          image_url: [
            {required: true, message: '請上傳視頻封面圖', trigger: 'blur'}
          ],
          video_url: [
            {required: true, message: '請上傳視頻', trigger: 'blur'}
          ],
        },
        cardStyle: {
          height: '150px',
          width: '200px',
        },

        progress: 0, // 上传进度
        pass: null, // 是否上传成功
      }
    },
    methods: {
      // 上传成功
      uploadCoverSuccess(res) {
       // console.log(this.validateForm()) ;
        if(res.url) {
          this.item.image_url = res.url;
          this.$refs.item.validateField('image_url');
          this.$emit('uploadCoverSuccess',res,this.index);
        }
      },
      uploadVideoSuccess(res) {
        // console.log(this.validateForm()) ;
        if(res.url) {
          this.item.video_url = res.url;
          this.$refs.item.validateField('video_url');
          this.$emit('uploadVideoSuccess',res,this.index);
        }
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
      // 子組件验证
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
  .video-item {
    margin-bottom: 22px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    min-width: 550px;
  }
  .video-item-left {
    flex: 4;
  }
  .video-item-right {
    flex: 1;
    align-self: center;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
  }
  .video-item-right-left {
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }
  .video-item-right-right {
    flex: 1;
  }
  .el-icon {
    font-size: 20px;
    width: 40px;
    height: 40px;
    line-height: 40px;
  }
  .el-form-item .el-form-item {
    width: 200px;
    height: 150px;
    min-width: 200px;
  }


</style>



// WEBPACK FOOTER //
// src/components/common/VideoListUploadWithCover/VideoCardWithCover.vue