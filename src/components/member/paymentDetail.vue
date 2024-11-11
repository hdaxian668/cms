<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/customer/list'}">會員管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/payment-record/list',query:{id:memberId,name:memberName}}">付款進度</el-breadcrumb-item>
        <el-breadcrumb-item>新增付款進度</el-breadcrumb-item>
        <el-breadcrumb-item>{{ memberName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="payment"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="payment"
             :rules="rules"
             label-position="left" label-width="160px">
      <el-form-item label="項目選擇" prop="project_id">
        <el-select v-model="payment.project_id" placeholder="項目篩選">
          <el-option
            v-for="item in projectList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="期數（中文）" prop="periods_c">
        <el-input v-model="payment.periods_c" placeholder="中文"></el-input>
      </el-form-item>
      <el-form-item label="期數（英文）" prop="periods_e">
        <el-input v-model="payment.periods_e" placeholder="英文"></el-input>
      </el-form-item>
      <el-form-item label="付款時間" prop="pay_date">
        <el-date-picker type="datetime" placeholder="需付款時間"
                        v-model="payment.pay_date"
                        default-time="12:00:00"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="width: 100%;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="付款金額（HKD）" prop="amount">
        <el-input v-model="payment.amount" placeholder="HKD"></el-input>
      </el-form-item>
      <el-form-item label="付款狀態" prop="status">
        <el-select v-model="payment.status" placeholder="請選擇狀態">
          <el-option value="0" label="已付款"></el-option>
          <el-option value="1" label="未付款"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="submitLoading"  @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  import {
    edit,
    save
  } from '@/api/member/paymentDetail';
  import { baseVanke } from '@/util/index';

  export default {
    name: 'paymentDetail',
    data() {
      return {
        id: '',
        loading: false,
        submitLoading: false,
        memberId: '',
        memberName: '',
        rules: {
          project_id: [
            {required: true, message: '請選擇項目', trigger: 'blur'}
          ],
          periods_c: [
            {required: true, message: '請輸入期數', trigger: 'blur'}
          ],
          periods_e:[
            {required: true, message: '請輸入期數（英）', trigger: 'blur'}
          ],
          amount:[
            {required: true, message: '請輸入金額', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '請選擇狀態', trigger: 'change'}
          ],
          pay_date: [
            {required: true, message: '請選擇日期', trigger: 'change' }
          ],
        },
        projectList: [],

        payment: {
          project_id: "",
          customer_id: "",
          periods_c: "",
          periods_e: "",
          amount:'',
          status: "",
          pay_date: "",
        },
      }
    },
    activated() {
      this.getItemDetail();
    },
    deactivated() {
      this.initDetail();
    },
    methods: {
      initDetail() {
        this.id = '';
        this.memberId= '';
        this.memberName= '';

        this.payment = {
          project_id: "",
          customer_id: "",
          periods_c: "",
          periods_e: "",
          amount:'',
          status: "",
          pay_date: "",
        };
        this.$refs.payment.clearValidate(); // 清空规则
      },
      getItemDetail() {
        this.loading = true;
        const self = this;
        this.memberId = this.$route.query.memberId;
        this.payment.customer_id = this.$route.query.memberId;
        this.memberName = this.$route.query.name;
        edit().then(function(response){
          if (!response.data.VIEW) {
            self.$message.error('沒有權限！');
            self.$router.push('/project/list');
            return;
          }
          self.projectList = baseVanke.elFormatArray(response.data,'id','name_c');
        }).finally(function() {
          self.loading = false;
        });
      },
      onSubmit() {
        const self = this;
        this.$refs.payment.validate((valid)=>{
          if(valid) {
            this.submitLoading = true;
            let data = {
                project_id: this.payment.project_id,
                customer_id: this.payment.customer_id,
                periods_c: this.payment.periods_c,
                periods_e: this.payment.periods_e,
                amount: this.payment.amount,
                status: this.payment.status,
                pay_date: this.payment.pay_date,
            };
            save(data).then(function(){
              self.$message({
                type: 'success',
                message: '提交成功!'
              });
              self.$router.push({
                path: '/payment-record/list',
                query: {
                  id: self.memberId,
                  name: self.memberName,
                }
              })
            }).catch(function(error){
              self.$message.error(error.message)
            }).finally(function() {
              self.submitLoading = false;
            });
          } else {
            self.$message.error('表單填寫有誤！');
            return false;
          }
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  .add-extend {
    width: 50px;
    height:50px;
    line-height: 50px;
  }

  .photo {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>



// WEBPACK FOOTER //
// src/components/member/paymentDetail.vue