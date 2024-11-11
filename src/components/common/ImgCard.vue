<template>
  <div class="vk-img-card">
    <span class="single-img-card" :style="imgStyle">
      <img :src="imgUrl"
           class="single-img">
      <span class="img-card-actions">
        <span class="img-card-actions_item-preview" @click="imgPreview">
          <i class="el-icon-zoom-in"></i>
        </span>
        <span class="img-card-actions_item-delete" @click="imgDelete" v-if="!disabled">
          <i class="el-icon-delete"></i>
        </span>
      </span>
    </span>
    <el-dialog title="" :visible.sync="isEnlargeImage" size="large" :modal-append-to-body="false" top="8%" width="60%">
      <img @click="isEnlargeImage = false" style="width:100%;" :src="enlargeImage">
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "ImgCard",
    data() {
      return {
        isEnlargeImage: false,//放大图片
        enlargeImage: '',//放大图片地址
      }
    },
    props: {
      imgUrl: {
        type: String,
      },
      imgStyle: {
        type: Object,
        default: {
          width: '160px',
          height: '120px',
        }
      },
      disabled: {
        type: Boolean,
        default: false,
      }
    },
    methods: {
      imgPreview(e) {
        e.stopPropagation(); // 阻止冒泡
        this.enlargeImage = this.imgUrl;
        this.isEnlargeImage = !this.isEnlargeImage;
      },
      imgDelete() {
        this.$emit('imgDelete');
      },
    }
  }
</script>
<style scoped>
  .vk-img-card {
    display: inline-block;
    position: relative;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .single-img-card {
    position: relative;
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 142px;
    height: 102px;
    display: inline-block;
  }
  .single-img {
    width: 100%;
    height: 100%;
  }
  .img-card-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    transition: opacity .3s;
  }
  .img-card-actions:hover {
    opacity: 1;
  }
  .img-card-actions span+span {
    margin-left: 15px;
  }
  .img-card-actions span {
    display: inline-block;
    cursor: pointer;
  }
  .img-card-actions:after {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
  }
  .el-icon-zoom-in {
    font-family: element-icons!important;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    /* vertical-align: baseline; */
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>



// WEBPACK FOOTER //
// src/components/common/ImgCard.vue