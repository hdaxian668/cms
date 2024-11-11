 <template>
  <div class="sing-img-upload">
    <el-progress
      v-if="!pass && progress!==0"
      type="circle"
      :percentage="progress"
      :status="proStatus">
    </el-progress>
    <single-img-card
      v-if="imgUrl && progress===0"
      :class="isInline?'inline-block':''"
      :img-url="imgUrl"
      :img-style="imgStyle"
      @imgDelete="uploadOnRemove">
    </single-img-card>
    <el-upload
      name="upfile"
      class="photo-uploader"
      :class="isInline?'inline-block':''"
      action="/upload/handle?action=uploadimage"
      accept=".png, .jpg, .jpeg, .gif, .bmp, .svg"
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
  import SingleImgCard from './SingleImgCard'
  export default {
    name: "SingleImgUpload",

    components:{
      SingleImgCard,
    },
    data() {
        return {
          // imgUrl: 'http://vky-test-oss.inboyu.com/upload/39e64c32-74eb-08f6-434b-303e59f27322.jpg',
          isEnlargeImage: false,//放大图片
          enlargeImage: '',//放大图片地址

          progress: 0, // 上传进度
          pass: null, // 是否上传成功
        }
    },
    props: {
      imgUrl: { // 图片地址
        type: String,
      },
      uploadAction: { // 上传图片地址
        type: String,
      },
      imgStyle: { // 图片显示样式
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
      // 移除图片
      uploadOnRemove() {
        this.$emit('uploadOnRemove');
      },
    }
  }
</script>
<style scoped>
</style>



// WEBPACK FOOTER //
// src/components/common/SingleImgUpload/SingleImgUpload.vue