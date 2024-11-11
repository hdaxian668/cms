<template>
  <div class="vk-img-card">
    <span class="single-img-card" :style="imgStyle">
      <img :src="imgUrl"
           class="single-img">
      <span class="single-card-actions">
        <span class="img-card-actions_item-preview" @click="imgPreview">
          <i class="el-icon-zoom-in"></i>
        </span>
        <span class="img-card-actions_item-delete" @click="imgDelete">
          <i class="el-icon-delete"></i>
        </span>
      </span>
    </span>
    <span class="img-cards-actions">
      <el-button icon="el-icon-arrow-left"
                 class="img-button"
                 circle
                 @click="sortUp"></el-button>
      <el-button icon="el-icon-arrow-right"
                 class="img-button"
                 circle @click="sortDown"></el-button>
      <!--<i class="el-icon-arrow-left el-icon" @click="sortUp"></i>-->
      <!--<i class="el-icon-arrow-right el-icon" @click="sortDown"></i>-->
      <!--<i class="el-icon-delete el-icon" @click="itemDelete"></i>-->
    </span>
  </div>
</template>

<script>
  export default {
    name: "ImgCards",
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
      }
    },
    methods: {
      imgPreview() {
        this.$emit('imgRreview');
      },
      imgDelete() {
        this.$emit('imgDelete');
      },
      sortUp() {
        this.$emit('sortUp');
      },
      sortDown() {
        this.$emit('sortDown');
      },
    }
  }
</script>
<style scoped>
  .vk-img-card {
    display: inline-block;
    position: relative;
    margin-right: 20px;
    margin-bottom: 60px;
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
    margin: 0;
    display: inline-block;
  }
  .single-img {
    width: 100%;
    height: 100%;
  }
  .single-card-actions {
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
  .single-card-actions:hover {
    opacity: 1;
  }
  .single-card-actions span+span {
    margin-left: 15px;
  }
  .single-card-actions span {
    display: inline-block;
    cursor: pointer;
  }
  .single-card-actions:after {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
  }
  .el-icon-zoom-in {
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
  .img-cards-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    transform: translateY(100%);
    margin-left: 20px;
  }

</style>



// WEBPACK FOOTER //
// src/components/common/ImgCardsUpload/ImgCards.vue