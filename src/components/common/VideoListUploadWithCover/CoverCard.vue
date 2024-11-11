<template>
  <div class="vk-img-card">
    <span class="single-img-card" :style="imgStyle">
      <img :src="imgUrl"
           class="single-img">
      <!--<span class="single-card-actions">-->
        <!--<span class="img-card-actions_item-preview" @click="imgPreview">-->
          <!--<i class="el-icon-zoom-in"></i>-->
        <!--</span>-->
        <!--<span class="img-card-actions_item-refresh" @click="imgRefresh">-->
          <!--<i class="el-icon-refresh"></i>-->
        <!--</span>-->
      <!--</span>-->
    </span>
  </div>
</template>

<script>

  export default {
    name: "CoverCards",
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
      imgPreview(e) {
        console.log('review');
        event.stopPropagation();
        this.$emit('imgRreview');
      },
      imgRefresh() {
        this.$emit('imgRefresh');
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
// src/components/common/VideoListUploadWithCover/CoverCard.vue