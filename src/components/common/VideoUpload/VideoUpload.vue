<template>
  <div class="video-upload">
    <el-progress
      v-if="!pass && progress!==0"
      type="circle"
      :percentage="progress"
      :status="proStatus">
    </el-progress>
    <video-card
      v-if="videoUrl && progress===0"
      :class="isInline?'inline-block':''"
      :video-url="videoUrl"
      :video-style="videoStyle"
      @videoDelete="uploadOnRemove"></video-card>
    <el-upload
      name="upfile"
      class="photo-uploader"
      action="/upload/handle?action=uploadVideo"
      accept=".mp4,.avi,.rmvb,.mpeg,.mkv,.wmv,.3gp"
      :show-file-list="false"
      :on-success="uploadOnSuccess"
      :on-progress="uploadOnProgress"
      :on-change="uploadOnChange"
      :on-error="uploadOnError">
      <i class="el-icon-plus uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
  import VideoCard from './VideoCard'

  export default {
    name: "VideoUpload2",
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
      isInline: { // 是否切换为inline-block样式
        type: Boolean,
      }
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
          this.$emit('uploadOnError',err);
        }
      },
      // 上传失败
      uploadOnError(err) {
        err.message = '視頻上傳失敗！請稍後重試';
        this.pass = null;
        this.progress = 0;
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

</style>



// WEBPACK FOOTER //
// src/components/common/VideoUpload/VideoUpload.vue