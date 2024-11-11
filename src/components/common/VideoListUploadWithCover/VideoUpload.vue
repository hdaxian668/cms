<template>
  <div class="video-item-uploader">
    <el-upload
      name="upfile"
      action="/upload/handle?action=uploadVideo"
      accept=".mp4,.avi,.rmvb,.mpeg,.mkv,.wmv,.3gp"
      :show-file-list="false"
      :on-success="uploadOnSuccess"
      :on-progress="uploadOnProgress"
      :on-change="uploadOnChange"
      :before-upload="uploadOnBefore"
      :on-error="uploadOnError">
      <el-progress
        v-if="!pass && progress!==0"
        type="circle"
        :percentage="progress"
        :status="proStatus">
      </el-progress>
      <video-card v-else-if="videoUrl && progress===0"
                  :video-url="videoUrl"
                  :videoStyle="videoStyle">
      </video-card>
      <span class="upload-text"  v-else>
        <i class="el-icon-plus upload-icon text"></i>
         視頻上傳
      </span>
    </el-upload>
  </div>
</template>

<script>
  import VideoCard from './VideoCard'

  export default {
    name: "VideoUpload",
    components: {
      VideoCard,
    },
    data() {
      return {
        progress: 0, // 上传进度
        pass: null, // 是否上传成功
      }
    },
    props: {
      videoUrl: { // 视频地址
        type: String,
      },
      videoStyle: { // 显示样式
        type: Object,
      },
    },
    computed: {
      proStatus() {
        if(this.pass) {
          return 'success';
        } else if (this.pass===false) {
          return 'exception';
        } else {
          return '';
        }
      },
    },
    methods: {
      // 上传前检查
      uploadOnBefore(file) {
        const isLt200M = file.size / 1024 / 1024 < 200;
        if (!isLt200M) {
          this.$message.error('視頻大小不能超過200MB!');
        }
        return isLt200M;
      },
      // 上传成功
      uploadOnSuccess(res) {
        if(res.url) {
          this.pass = 'success'; // 上传成功
          this.$emit('uploadOnSuccess',res);
        } else { // 超过限制的时候并未报错
          this.pass = null;
          this.progress = 0;
          const err = new Error();
          err.data = res;
          err.message = '視頻上傳失敗！' + res.state;
          this.$message.error(err.message);
          this.$emit('uploadOnError',err);
        }
      },
      // 上传失败
      uploadOnError(err) {
        err.message = '視頻上傳失敗！請稍後重試';
        this.pass = null;
        this.progress = 0;
        this.$message.error(err.message);
        this.$emit('uploadOnError',err);
      },
      // 上传过程
      uploadOnProgress(e) {
        this.progress = Math.floor(e.percent);
      },
      // 文件状态改变:包括添加、上传、上传失败
      uploadOnChange() {
        this.pass = null;
        this.progress = 0;
      },
      // 移除
      uploadOnRemove() {
        this.$emit('uploadOnRemove');
      },
    }
  }
</script>
<style scoped>
  .upload-text {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    line-height: 50px;
    width: 200px;
    height: 50px;
    color: #606266;
  }
  .upload-text:hover {
    border-color: #409EFF;
  }
  .upload-icon {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    color: #8c939d;
    text-align: center;
  }
</style>



// WEBPACK FOOTER //
// src/components/common/VideoListUploadWithCover/VideoUpload.vue