<template>
    <div class="vk-check-group">
      <info-card v-for="item in infoList"
                 @clickCard="statusChange"
                 :item="item"
                 :config="config"
                 :disabled="disabled">
      </info-card>
    </div>
</template>

<script>
  import { baseUtil } from '@/util/index';
  import InfoCard from './InfoCard';
  export default {
    name: "vk-checkbox-group",
    components:{
      InfoCard,
    },
    data() {
      return {}
    },
    props: {
      // 选择列表
      checkId: {
        type: Array,
        default: [],
      },
      // 全部选项列表
      infoList: {
        type: Array,
        default: [],
      },
      // 是否可点击
      disabled: {
        type: Boolean,
        default: false,
      },
      config: {
        type: Object,
      }
    },
    created() {
      this.initStatus(this.infoList,this.checkId);
    },
    methods: {
      /**
       * 根据已选中数组初始化所有选项的状态值：
       * 在已选中数组中的项status=true；
       * 未在已选中数组中的项status=false。
       *  @param infoList - 所有选项
       *  @param checkId -被选中数组
       */
      initStatus(infoList,checkId) {
        let hash = {}; // 保存状态
        checkId.forEach(function(item) {
          hash[item] = true;
        });
        infoList.forEach(function(item) {
          item.status = !!hash[item.id];
        });
        // console.log(hash,infoList,checkId);
      },
      /**
       * 状态改变时，被选中数据的修改
       * @param item
       */
      statusChange(item) {
        // 如果item.status = true,将item.id写入checkId 选中数组中。
        // 否则，将item.id从checkID中删除
        if(item.status) {
          this.checkId.push(item.id);
        } else {
          baseUtil.arrayValRemove(this.checkId,item.id);
        }
        this.$emit('change');
      },
    }

  }
</script>

<style scoped>
  .vk-check-group {
    overflow: hidden;
  }

</style>



// WEBPACK FOOTER //
// src/components/common/VkCheckboxGroup/VkCheckboxGroup.vue