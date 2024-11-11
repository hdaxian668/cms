<template>
  <div class="img-cards-upload">
    <img-cards
      v-for="(imgUrl,index) in uploadList"
      :img-url="imgUrl"
      :img-style="imgStyle"
      @imgRreview="uploadOnPreview(imgUrl)"
      @imgDelete="uploadOnRemove(index)"
      @sortUp="sortUp(index)"
      @sortDown="sortDown(index)">
    </img-cards>
    <el-progress
      v-if="!pass && progress!==0"
      type="circle"
      :percentage="progress"
      :status="proStatus">
    </el-progress>
    <el-upload
      name="upfile"
      class="photo-uploader"
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
      <i class="el-icon-plus uploader-icon"></i>
    </el-upload>
    <el-dialog title="" :visible.sync="isEnlargeImage" size="large" :modal-append-to-body="false" top="8%" width="60%">
      <img @click="isEnlargeImage = false" style="width:100%;" :src="enlargeImage">
    </el-dialog>
  </div>
</template>

<script>
  import ImgCards from './ImgCards'
  export default {
    name: "ImgCardsUpload",
    components:{
      ImgCards,
    },
    data() {
      return {
        isEnlargeImage: false,// 放大图片
        enlargeImage: '',// 放大图片地址

        progress: 0, // 上传进度
        pass: null, // 是否上传成功
      }
    },
    props: {
      uploadList: { // 图片地址
        type: Array,
       },
      uploadAction: { // 上传图片地址
        type: String,
      },
      imgStyle: { // 图片显示样式
        type: Object,
      },
      uploadLimit: {
        type: String,
        default: '10',
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
      }
    },
    methods: {
      // 限制上传个数
      uploadBefore() {
        if(this.uploadList.length >= parseInt(this.uploadLimit)) {
          this.$message.error("最多可以上傳10張圖片");
          return false;
        }
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
          err.message = '圖片上傳失敗！' + res.state;
          this.$emit('uploadOnError',err);
        }
      },
      // 上传失败
      uploadOnError(err) {
        err.message = '圖片上傳失敗！請稍後重試';
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
      // 文件超出个数限制
      uploadOnExceed() {
        this.$emit('uploadOnExceed');
      },
      uploadOnPreview(imgUrl) {
        this.enlargeImage = imgUrl;
        this.isEnlargeImage = !this.isEnlargeImage;
      },
      // 移除图片
      uploadOnRemove(index) {
        this.$emit('uploadOnRemove',index);
      },
      sortUp(index) {
        this.$emit('sortUp',index);
      },
      sortDown(index) {
        this.$emit('sortDown',index);
      },
    }
  }
</script>
<style lang="less" scoped>

</style>



// WEBPACK FOOTER //
// src/components/common/ImgCardsUpload/ImgCardsUpload.vue