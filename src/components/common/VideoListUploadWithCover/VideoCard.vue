<template>
  <div class="video-card" :style="videoStyle">
    <video
      :src="videoUrl"
      controls
      :height="videoStyle.height"
      :width="videoStyle.width">
    </video>
    <!--<span class="video-card-actions">-->
      <!--<span class="img-card-actions_item-refresh" @click="videoRefresh">-->
          <!--<i class="el-icon-refresh"></i>-->
        <!--</span>-->
    <!--</span>-->
  </div>
</template>

<script>
  export default {
    name: "VideoCard",
    props: {
      videoUrl: { // 视频地址
        type: String,
      },
      videoStyle: { // 显示样式
        type: Object,
        default: {
          height: '210',
          width: '280'
        }
      },
      isInline: { // 是否切换为inline-block样式
        type: Boolean,
      }
    },
    methods: {
      /**
       * 视频替换
       */
      videoRefresh() {
        this.$emit('videoRefresh');
      },
    }
  }
</script>

<style scoped>
  .video-card {
    position: relative;
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    display: inline-block;
    line-height: 1;
  }
  .video-card-actions {
    position: absolute;
    width: 100%;
    height: 20px;
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
  .video-card-actions:hover {
    opacity: 1;
  }
  .video-card-actions span+span {
    margin-left: 15px;
  }
  .video-card-actions span {
    display: inline-block;
    cursor: pointer;
  }
  .video-card-actions:after {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
  }
</style>



// WEBPACK FOOTER //
// src/components/common/VideoListUploadWithCover/VideoCard.vue