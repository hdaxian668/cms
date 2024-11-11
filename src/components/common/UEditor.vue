<template>
  <div class="ueditor">
    <script ref="editor" :id="this.id"
            type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    name: 'UE',
    data () {
      return {
        // editor: null,
        timer: false,
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      // config: {
      //   type: Object
      // },
      id: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    watch: {
      defaultMsg() {
        if(this.timer) {
          this.editor.setContent(this.defaultMsg);
        }
      },
      // disabled() {
      //   if(this.timer) {
      //     if(this.disabled) {
      //       this.editor.setDisabled();
      //     } else {
      //       this.editor.setEnabled();
      //     }
      //   }
      // }
    },
    activated() {
      //初始化编辑器
      this.initEditor();

    },
    deactivated() {
      this.timer = false;
      // console.log('deactivated');
      //销毁编辑器实例
      // this.editor.destroy();
      //重置编辑器，可用来做多个tab使用同一个编辑器实例
      //如果要使用同一个实例,请注释destroy()方法
      this.editor.reset();
    },
    methods: {
      initEditor() {
        const self = this;
        // this.editor = UE.getEditor(this.id, this.config); // 初始化UE
        this.editor = UE.getEditor(this.id, {
          initialFrameWidth: null,
          initialFrameHeight: 350, //初始化编辑器高度
          scaleEnabled: true, // 是否可以拉伸长高,默认true(当开启时，自动长高失效)
          enableAutoSave: false, //是否启用自动保存，UEditor中相关代码已删除
          autoFloatEnabled: false, // 是否保持toolbar的位置不动,默认true
          elementPathEnabled: false, // 是否启用元素路径，默认是显示
          wordCount: false,// 是否字数统计，默认是
          fontsize:[10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 36]
          ,lang:"en"
        }); // 初始化UE
        this.editor.addListener("ready", function () {
          self.timer = true;
          self.editor.setContent(self.defaultMsg); // 确保UE加载完成后，放入内容。
        });
      },
      /**
       * 获取内容方法
       */
      getUEContent() {
        return this.editor.getContent()
      },
      /*
      * 设置内容
      * */
      setUEContent(data) {
        this.editor.setContent(data);
      },
      /**
       * 设置当前区域为不可编辑
       */
      setUEDisabled() {
        this.editor.setDisabled();
      },
      /**
       * 设置为可编辑
       */
      setUEnabled() {
        this.editor.setEnabled();
      },
    },
  }
</script>
<style>
</style>



// WEBPACK FOOTER //
// src/components/common/UEditor.vue