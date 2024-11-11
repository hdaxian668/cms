<template>
  <div class="activity-extend">
    <el-form ref="item" :model="item" :rules="rules" class="extend-content">
      <el-form-item label=" " prop="range" class="extend-range" >
        <el-date-picker 
          v-model="item.range"
          type="datetimerange"
          range-separator="至"
          start-placeholder="開始時間"
          end-placeholder="結束時間"
          :default-value="defaultDateValue"
          @change="changeDate"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="報名人數" prop="total" class="extend-total">
        <el-input v-model="item.total" @blur="inputTotal"></el-input>
      </el-form-item>
    </el-form>
    <div class="action-part">
      <i class="el-icon-delete el-icon" @click="itemDelete"></i>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
    export default {
      name: "activityExtend",
      props: {
        item: {
          type: Object,
          default: () => {
            return {
              range: [],
              total: '0',
            }
          }
        },
        index: {
          type: Number,
        },
        startDate: {
          type: String,
        },
        endDate: {
          type: String,
        },
        max: {
          type: String,
        }
      },
      data() {
        const checkRange = (rule, value, callback) => {
          if(value === []) {
            callback(new Error('活動時間段不能為空'));
          } else {
            console.log(value[0] >= this.startDate && value[1] <=this.endDate);
            if(value[0] >= this.startDate && value[1] <=this.endDate) {
              callback();
            } else {
              console.log('時間超出活動設置的時間範圍');
              callback(new Error('時間超出活動設置的時間範圍'));
            }
          }
        };
        const checkTotal = (rule, value, callback) => {
          if(this.max != '0' && value == '0') {
            callback(new Error('時段人數不能為零'));
          }
          if(this.max != '0' && parseInt(value) > parseInt(this.max)) {
            callback(new Error('時段人數不能超過總人數'));
          } else {
            callback();
          }
        };
          return {
            rules: {
              range: [
                FormRules.required('活動時間段'),
                { validator: checkRange, trigger: 'blur'}
              ],
              total: [
                FormRules.required('報名人數'),
                FormRules.onlyNumber(),
                { validator: checkTotal, trigger: 'blur'},
              ],
            },
          }
      },
      computed: {
        defaultDateValue() {
          return moment(this.startDate);
        }
      },

      methods: {
        /**
         * 点击删除按钮
         */
        itemDelete() {
          console.log(this.index);
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
      }
    }
</script>
<style lang="less">
  .activity-extend {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 22px;
  }
  .extend-content {
    flex: 1;
    display: inline-flex;
  }
  .extend-total {
    min-width: 150px!important;
    margin-bottom: 0!important;
    .el-input {
      width: 70px;
    }
  }
  .extend-range {
    flex: 1;
    min-width: 450px!important;
    margin-bottom: 0!important;
  }
</style>
<style lang="less" scoped>
  .action-part {
    font-size: 20px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    .el-icon {
      font-size: 20px;
    }
  }
</style>



// WEBPACK FOOTER //
// src/components/activity/activityDetail/activityExtend.vue