<template>
  <div class="third-part">
    <div class="third-left">
      <el-form ref="item"
               :model="item"
               :rules="rules">
        <el-form-item  class="small-input" prop="name_c">
          <el-input  v-model="item.name_c" placeholder="中文名稱"></el-input>
        </el-form-item>
        <el-form-item class="small-input" prop="name_e">
          <el-input  v-model="item.name_e" placeholder="英文名稱"></el-input>
        </el-form-item>
        <el-form-item  class="third-left-down" prop="url">
          <el-input class="large-input" v-model="item.url" placeholder="連接地址"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="third-right">
      <el-col class="third-right-left">
        <!--<el-button icon="el-icon-arrow-up"-->
                   <!--circle @click="sortUp">-->
        <!--</el-button>-->
        <!--<el-button icon="el-icon-arrow-down"-->
                   <!--circle @click="sortDown">-->
        <!--</el-button>-->
        <i class="el-icon-arrow-up el-icon" @click="sortUp"></i>
        <i class="el-icon-arrow-down el-icon" @click="sortDown"></i>
      </el-col>
      <el-col class="third-right-right">
        <i class="el-icon-delete el-icon" @click="itemDelete"></i>
      </el-col>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ExtendMsg",
    data() {
        return {
          rules: {
            name_c: [
              {required: true, message: '請輸入中文名稱', trigger: 'blur'}
            ],
            name_e: [
              {required: true, message: '請輸入英文名稱', trigger: 'blur'}
            ],
            url: [
              {required: true, message: '請輸入連接地址', trigger: 'blur'}
            ],
          },
        }
    },
    props: {
      item: {
        type: Object
      },
      index: {
        type: Number
      }
    },
    methods: {
      sortUp() {
        this.$emit('sortUp',this.index);
      },
      sortDown() {
        this.$emit('sortDown',this.index);
      },
      itemDelete() {
        this.$emit('itemDelete',this.index);
      },
      // 子組件验证
      validateForm() {
        let flag = false;
        this.$refs.item.validate((valid) => {
          flag = valid
        });
        return flag;
      }
    },
  }
</script>

<style lang="less" scoped>
  .el-icon {
    font-size: 20px;
    width: 40px;
    height: 40px;
    line-height: 40px;
  }
  .small-input {
    display: inline-block;
    width: 45%;
    margin-bottom: 22px;
    margin-right: 10px;
  }
  .third-part {
    margin-bottom: 22px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
  }
  .third-left {
    flex: 4;
  }
  .third-right {
    flex: 1;
    align-self: center;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
  }
  .third-right-left {
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }
  .third-right-right {
    flex: 1;
  }

</style>



// WEBPACK FOOTER //
// src/components/project/ExtendMsg.vue