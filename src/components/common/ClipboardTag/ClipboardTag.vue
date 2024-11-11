<template>
  <div>
    <el-button type="button" plain
       v-clipboard:copy="tag"
       v-clipboard:success="onCopy"
       v-clipboard:error="onError">{{ tag }}</el-button>
  </div>
</template>

<script>
    export default {
      name: "ClipboardTag",
      props: {
          tag: {
            type: String,
          }
      },
      methods: {
        /**
         * 拷贝成功
         * @param e - 操作
         */
        onCopy(e) {
          this.$message({
            message: '複製成功'+e.text,
            type: 'success'
          });
        },
        /**
         * 拷贝失败
         * @param e
         */
        onError(e) {
          this.$message.error('文本無法複製!');
        }
      }
    }
</script>

<style scoped>
.el-button {
  padding: 10px 10px;
}
</style>



// WEBPACK FOOTER //
// src/components/common/ClipboardTag/ClipboardTag.vue