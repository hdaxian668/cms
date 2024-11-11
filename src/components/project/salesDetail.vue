<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/project/list' }">項目管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/sales/list',query: {id:projectId,name:projectName } }">銷售紀錄</el-breadcrumb-item>
        <el-breadcrumb-item>詳情</el-breadcrumb-item>
        <el-breadcrumb-item>{{ projectName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="sales"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="sales"
             :rules="rules"
             label-position="left"
             label-width="160px">
      <el-form-item label="單位編號" prop="unit_id">
        <el-input v-model="sales.unit_id" placeholder="單位編號" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="座數" prop="tower_number">
        <el-input v-model="sales.tower_number" placeholder="座數" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="樓層" prop="floor_display_name">
        <el-input v-model="sales.floor_display_name" placeholder="樓層" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="單位" prop="unit_number">
        <el-input v-model="sales.unit_number" placeholder="單位" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="地址(EN)" prop="address_en">
        <el-input v-model="sales.address_en" placeholder="地址(EN)"></el-input>
      </el-form-item>
      <el-form-item label="地址(TC)" prop="address_tc">
        <el-input v-model="sales.address_tc" placeholder="地址(TC)"></el-input>
      </el-form-item>
      <el-form-item label="地址(SC)" prop="address_sc">
        <el-input v-model="sales.address_sc" placeholder="地址(SC)"></el-input>
      </el-form-item>
      <el-form-item label="平面圖" prop="floor_plan">
        <el-input v-model="sales.floor_plan" placeholder="平面圖"></el-input>
      </el-form-item>
      <!-- <el-form-item label="銷售號碼" prop="pasp_number">
        <el-input v-model="sales.pasp_number" placeholder="銷售號碼" disabled="disabled"></el-input>
      </el-form-item> -->
      <el-form-item label="律師信日期" prop="legal_letter_date">
        <el-date-picker
          v-model="sales.legal_letter_date"
          placeholder="律師信日期"
          type="date"
          value-format="yyyy-MM-dd"
           @change="handleLegalLetterDateChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="執修參考結束日(律師信日期+6個月)" prop="defect_official_expire_date">
        <el-date-picker
          v-model="sales.defect_official_expire_date"
          placeholder="執修參考結束日(律師信日期+6個月)"
          type="date"
          value-format="yyyy-MM-dd"
          disabled="disabled">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="執修實際結束日(DLP)" prop="defect_expire_date">
        <el-date-picker
          v-model="sales.defect_expire_date"
          placeholder="執修實際結束日(DLP)"
          type="date"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="交樓日期" prop="handover_date">
        <el-date-picker
          v-model="sales.handover_date"
          placeholder="交樓日期"
          type="date"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="進入方法" prop="enter_method">
        <el-radio-group v-model="sales.enter_method">
          <el-radio-button :label="0">不明</el-radio-button>
          <el-radio-button :label="1">鎖匙</el-radio-button>
          <el-radio-button :label="2">匙卡</el-radio-button>
          <el-radio-button :label="3">預約</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="單位狀況" prop="unit_status">
        <el-radio-group v-model="sales.unit_status">
          <el-radio-button :label="0">不明</el-radio-button>
          <el-radio-button :label="1">未出售</el-radio-button>
          <el-radio-button :label="2">未交樓</el-radio-button>
          <el-radio-button :label="3">已交樓</el-radio-button>
          <el-radio-button :label="4">有傢俬</el-radio-button>
          <el-radio-button :label="5">裝修中</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="居住狀況" prop="living_status">
        <el-radio-group v-model="sales.living_status">
          <el-radio-button :label="0">不明</el-radio-button>
          <el-radio-button :label="1">已自住</el-radio-button>
          <el-radio-button :label="2">已租出</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="HotCase" prop="is_hotcase">
        <el-radio-group v-model="sales.is_hotcase">
          <el-radio-button :label="0">否</el-radio-button>
          <el-radio-button :label="1">是</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="買家列表" v-if="APPUSER">
        <benefit-item v-for="(item,index) in sales.extend"
                      ref="benefit"
                      :item="item"
                      :index="index"
                      @itemDelete="extendItemDelete"></benefit-item>
        <i class="el-icon-plus uploader-icon add-extend"
           @click="addBenefitItem"></i>
      </el-form-item>

      <el-form-item v-if="SALES">
        <el-button type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>



<script>
  // import UEditor from '../common/UEditor';
  import ImgCardsUpload from "../common/ImgCardsUpload/ImgCardsUpload";
  import BenefitItem from './benefitItem';
  import {
    edit,
    save
  } from '@/api/project/salesDetail';
  import {
    baseVanke,
    baseUtil,
  } from '@/util/index';

  export default {
    name: 'salesDetail',
    components: {
      // UEditor,
      ImgCardsUpload,
      BenefitItem,
    },
    data() {
      return {
        id: '',
        loading: false,
        submitLoading: false,
        projectId: '',
        projectName: '',
        rules: {
          address_en: [
            { required: true, message: '請輸入地址(EN)', trigger: 'blur' }
          ],
          address_tc: [
            { required: true, message: '請輸入地址(TC)', trigger: 'blur' }
          ],
          address_sc: [
            { required: true, message: '請輸入地址(SC)', trigger: 'blur' }
          ],
          // pasp_number: [
          //   { required: true, message: '請輸入銷售號碼', trigger: 'blur' }
          // ],
          floor_plan: [
            { required: true, message: '請輸入平面圖', trigger: 'blur' }
          ],
          legal_letter_date: [
            { required: true, message: '律師信日期', trigger: 'blur' }
          ],
          // defect_official_expire_date: [
          //   { required: true, message: '執修參考結束日', trigger: 'blur' }
          // ],
          defect_expire_date: [
            { required: true, message: '執修實際結束日(DLP)', trigger: 'blur' }
          ],
          handover_date: [
            { required: true, message: '交樓日期', trigger: 'blur' }
          ],
        },

        VIEW: false,
        CREATE: false,
        EDIT: false,
        DELETE: false,
        EXPORT: false,
        SALES: false,
        APPUSER: false,
        sales: {
          id: '',
          property_id: '',
          property_name: '',
          tower_number: '',
          floor_display_name: '',
          unit_number: '',
          address_en: '',
          address_tc: '',
          address_sc: '',
          // pasp_number: '',
          floor_plan: '',
          defect_expire_date: '',
          legal_letter_date: '',
          defect_official_expire_date: '',
          handover_date: '',
          enter_method: '',
          unit_status: '',
          living_status: '',
          is_hotcase: '',
          extend: [],
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
        this.projectId= '';
        this.projectName='';
        this.sales = {
          id: '',
          unit_id: '',
          tower_number: '',
          floor_display_name: '',
          unit_number: '',
          address_en: '',
          address_tc: '',
          address_sc: '',
          // pasp_number: '',
          floor_plan: '',
          club_id: '',
          defect_expire_date: '',
          legal_letter_date: '',
          defect_official_expire_date: '',
          handover_date: '',
          enter_method: '',
          unit_status: '',
          living_status: '',
          is_hotcase: '',
          extend: [],
        };

        //this.$refs.activity.resetFields();
        this.$refs.sales.clearValidate(); // 清空规则
      },
      /* 获取当前页面的详细信息 */
      getItemDetail() {
        this.loading = true;
        const self = this;
        // this.id = this.$route.params.id;
        this.id = this.$route.query.id;
        this.projectId = this.$route.query.projectId;
        this.projectName = this.$route.query.name;
        let reqData = {
          id: this.id
        };
        edit(reqData).then(function(response){
          if (!response.data.VIEW) {
            self.$message.error('沒有權限！');
            self.$router.push('/project/list');
            return;
          }
          self.VIEW = response.data.VIEW;
          self.CREATE = response.data.CREATE;
          self.EDIT = response.data.EDIT;
          self.DELETE = response.data.DELETE;
          self.EXPORT = response.data.EXPORT;
          self.SALES = response.data.SALES;
          self.APPUSER = response.data.APPUSER;
          if(self.id) {
            self.sales = response.data.salesInfo;
            //self.sales.activityExtendShow = self.extendFormat(self.sales.activityExtend);

            //console.log(self.extendFormat(self.sales.activityExtend));
            // self.setUeditorContent();
          }
        }).catch(function(error) {
          self.$message.error(error.message);
        }).finally(function() {
          self.loading = false;
        });
      },

      extendFormat(activityExtend) {
        if(activityExtend instanceof Array) {
          let formatArray = [];
          activityExtend.forEach((item)=>{
            formatArray.push({
              id: item.id,
              club_id: item.club_id,
            });
          });
          return formatArray;
        }
      },
      /*
      * 上传图片失败
      * */
      handleImgError() {
        this.$message.error('上传失败，請稍後重試！');
      },

      addBenefitItem() {
        let item ={
          id: '',
          club_id: '',
          allow_report_defect: 0,

        };
        this.sales.extend.push(item);
      },


      extendItemDelete(index) {
        const self = this;
        this.$confirm('請注意此操作無法恢復，是否繼續?', '確認刪除操作', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          self.sales.extend.splice(index,1);
          self.$message({
            type: 'success',
            message: '刪除成功!'
          });
        }).catch(function() {
          self.$message({
            type: 'info',
            message: '已取消刪除'
          });
        });
      },

      /**
       * 上传图片成功，将图片信息存入数组中
       * @param res - 上传图片成功的返回值
       */
      handleImgItemSuccess(res) {
        this.progress.pic_url.push(res.url);
        this.$refs.progress.validateField('pic_url'); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '上传成功!'
        });
      },
      /*
      * 删除图片
      * */
      handleImgItemRemove(index) {
        this.progress.pic_url.splice(index,1); // 刪除這一項
        this.$refs.progress.validateField('pic_url'); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '刪除成功!'
        });
      },
      /*
      * 图片前移
      * */
      handleImgItemSortUp(index) {
        let list = this.progress.pic_url;
        if(index> 0) { // 不是第一个的可以上移
          list = baseUtil.arrayChangeItem(list,index,index-1);
        }
      },
      /*
      * 图片后移
      * */
      handleImgItemSortDown(index) {
        let list = this.progress.pic_url;
        if(index < list.length-1) { // 不是最后一个的可以下移
          list  = baseUtil.arrayChangeItem(list ,index,index+1);
        }
      },
      /*
      * 设置UEditor内容
      * */
      // setUeditorContent() {
      //   this.progress.desc_c = this.progress.desc_c || '';
      //   this.progress.desc_e = this.progress.desc_e || '';
      //   this.$refs.desc_c.setUEContent(this.progress.desc_c);
      //   this.$refs.desc_e.setUEContent(this.progress.desc_e);
      // },
      /*
      * 获取UEditor编辑器中的内容
      * */
      // getUeditorContent() {
      //   this.progress.desc_c = this.$refs.desc_c.getUEContent();
      //   this.progress.desc_e = this.$refs.desc_e.getUEContent();
      // },
      handleLegalLetterDateChange() {
        var legalLetterDate = new Date(this.sales.legal_letter_date);
        var newSubmitDate = new Date(legalLetterDate.setMonth(legalLetterDate.getMonth() + 6));
        this.sales.defect_official_expire_date = newSubmitDate;
        if (this.sales.defect_expire_date <= '1990-01-01') {
          this.sales.defect_expire_date = newSubmitDate;
        }
        else {
          var newSubmitDateString = newSubmitDate.toISOString().substring(0,10);
          if (confirm('是否更改執修實際結束日(DLP)為' + newSubmitDateString + '?')) {
            this.sales.defect_expire_date = newSubmitDate;
          }
        }
      },
      onSubmit() {
        // this.getUeditorContent();
        const self = this;
        var checkallow = 0;
        var checknone = 0;
        var checkcustomer = 0
        this.sales.extend.forEach(function(item){
          if (item.allow_report_defect == 1){
            checkallow = checkallow + 1;
          } 
          if (item.allow_report_defect == null){
            checknone = 1;
          }
          checkcustomer = 1
        });
        if (checkcustomer == 1){
          if (checknone == 1){
          self.$message.error("請選擇修繕");
          return false;
          }
          // if (checkallow == 0){
          // self.$message.error("請選擇修繕");
          // return false;
          // }
          if (checkallow > 1){
          self.$message.error("修繕只能選擇一位");
          return false;
          }
        }
        this.$refs.sales.validate((valid)=>{
          if (valid) {
            this.submitLoading = true;
            let data = {
              sales:{
                unit_id: this.unit_id,
                tower_number: this.sales.tower_number,
                floor_display_name: this.sales.floor_display_name,
                unit_number: this.sales.unit_number,
                address_en: this.sales.address_en,
                address_tc: this.sales.address_tc,
                address_sc: this.sales.address_sc,
                // pasp_number: this.sales.pasp_number,
                floor_plan: this.sales.floor_plan,
                defect_expire_date: this.sales.defect_expire_date,
                legal_letter_date: this.sales.legal_letter_date,
                defect_official_expire_date: this.sales.defect_official_expire_date,
                handover_date: this.sales.handover_date,
                enter_method: this.sales.enter_method,
                unit_status: this.sales.unit_status,
                living_status: this.sales.living_status,
                is_hotcase: this.sales.is_hotcase,
              },
              salesExtend: this.sales.extend || []
            };
            console.log(data);
            if(this.id) {
              data.sales.id =  this.id;
            }
            save(data).then(function() {
              self.$message({
                type: 'success',
                message: '提交成功!'
              });
              self.getItemDetail();
              // self.$router.push({
              //   path: '/sales/detail',
              //   query: {
              //     id: self.id,
              //     projectId: self.projectId,
              //     name: self.projectName,
              //   }
              // })
            }).catch(function(error) {
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
// src/components/project/salesDetail.vue