<template>
    <div :class="['info-card',{'blue-card':item.status},{'disabled':disabled}]"
         :style="config"
         @click="clickCard">
      <div class="info-card-inner">
        <p>{{ item.name }}</p>
        <p>{{ item.desc }}</p>
      </div>
    </div>
</template>

<script>
  export default {
    name: "infoCard",
    data() {
        return {}
    },
    props: {
      item: {
        type: Object,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      config: {
        type: Object,
        default: {
          width: '200px',
          height: '100px',
        }
      }
    },
    methods: {
      clickCard() {
        if(!this.disabled) { // 在disabled=false时才可以点击
          this.item.status = !this.item.status;
          this.$emit('clickCard',this.item);
        }
      },
    },

  }
</script>

<style scoped>
  .info-card {
    box-sizing: border-box;
    margin: 0 10px 10px 0;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    text-align: center;
    line-height: 1;
  }
  .info-card:hover {
    cursor: pointer;
    color: #409eff;
  }
  .info-card.blue-card {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    box-shadow: -1px 0 0 0 #409eff;
  }
  .info-card.blue-card:hover {
    color: #fff;
  }
  .disabled {
    color: #c0c4cc;
    cursor: not-allowed;
    border-color: #ebeef5;
    box-shadow: none;
  }
  .disabled:hover {
    color: #c0c4cc;
    cursor: not-allowed;
  }
  .blue-card.disabled {
    color: #c0c4cc;
    cursor: not-allowed;
    border-color: #ebeef5;
    box-shadow: none;
    background-color: #f2f6fc;
  }
  .blue-card.disabled:hover {
    color: #c0c4cc;
    cursor: not-allowed;
  }
</style>



// WEBPACK FOOTER //
// src/components/common/VkCheckboxGroup/InfoCard.vue