<template>
  <div class="video-item-uploader">
    <el-upload
      name="upfile"
      action="/upload/handle?action=uploadimage"
      accept=".png, .jpg, .jpeg, .gif, .bmp, .svg"
      multiple
      :show-file-list="false"
      :before-upload="uploadBefore"
      :on-success="uploadOnSuccess"
      :on-progress="uploadOnProgress"
      :on-change="uploadOnChange"
      :on-exceed="uploadOnExceed"
      :on-error="uploadOnError">
      <el-progress
        v-if="!pass && progress!==0"
        type="circle"
        :percentage="progress"
        :status="proStatus">
      </el-progress>
      <cover-card v-else-if="imgUrl && progress===0"
                  :img-url="imgUrl"
                  :imgStyle="imgStyle">
      </cover-card>
      <span class="upload-text"  v-else>
        <i class="el-icon-plus upload-icon text"></i>
        封面上傳
      </span>

    </el-upload>
  </div>
</template>

<script>
  import CoverCard from './CoverCard'
  export default {
    name: "CoverUpload",
    components: {
      CoverCard,
    },
    data() {
      return {
        progress: 0, // 上传进度
        pass: null, // 是否上传成功
      }
    },
    props: {
      imgUrl: { // 图片地址
        type: String,
      },
      imgStyle: { // 图片显示样式
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
      }
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
          err.message = '圖片上傳失敗！' + res.state;
          this.$message.error(err.message);
          this.$emit('uploadOnError',err);
        }
      },
      // 上传失败
      uploadOnError(err) {
        err.message = '圖片上傳失敗！請稍後重試';
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
      // 移除图片
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
// src/components/common/VideoListUploadWithCover/CoverUpload.vue