<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/customer/list' }">會員管理</el-breadcrumb-item>
        <el-breadcrumb-item>會員信息</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="member" :model="member" 
             v-loading="loading"
             element-loading-text="數據加載中"
             :rules="rules"
             :disabled="member.deleted === '1'"
             label-position="left" label-width="160px">
      <el-form-item label="會員號碼">
        <el-input v-model="member.club_id" placeholder="會員號碼"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="稱謂" prop="title">
        <el-radio-group v-model="member.title">
          <el-radio-button v-for="item in titleList" :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="中文全名" prop="name_c">
        <el-input v-model="member.name_c" placeholder="中文全名"></el-input>
      </el-form-item>
      <el-form-item label="英文全名" prop="name_e">
        <el-input v-model="member.name_e" placeholder="英文全名"></el-input>
      </el-form-item>
      <el-form-item label="英文別稱">
        <el-input v-model="member.name_alias_e" placeholder="英文別稱"></el-input>
      </el-form-item>
      <!--<el-form-item label="身份證號">
        <el-input v-model="member.card_num" placeholder=""></el-input>
      </el-form-item>-->
      <el-form-item label="郵箱" prop="email">
        <el-input v-model="member.email" placeholder="郵箱"></el-input>
      </el-form-item>
      <el-form-item label="手提電話" prop="phone">
        <el-row :gutter="20">
          <el-col :span="8" style="padding-left: 0;">
            <el-select v-model="member.nationcode" placeholder="請選擇地區號">
              <el-option
                v-for="item in codeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-input v-model="member.phone" placeholder="手提電話"></el-input>
          </el-col>
        </el-row>

      </el-form-item>
      <!-- <el-form-item label="出生日期" prop="birthday">
        <el-date-picker
          v-model="member.birthday"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="請選擇出生日期">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item label="出生月份" prop="birthday_month">
        <el-radio-group v-model="member.birthday_month">
          <el-radio-button :label="1">1</el-radio-button>
          <el-radio-button :label="2">2</el-radio-button>
          <el-radio-button :label="3">3</el-radio-button>
          <el-radio-button :label="4">4</el-radio-button>
          <el-radio-button :label="5">5</el-radio-button>
          <el-radio-button :label="6">6</el-radio-button>
          <el-radio-button :label="7">7</el-radio-button>
          <el-radio-button :label="8">8</el-radio-button>
          <el-radio-button :label="9">9</el-radio-button>
          <el-radio-button :label="10">10</el-radio-button>
          <el-radio-button :label="11">11</el-radio-button>
          <el-radio-button :label="12">12</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年齡" prop="birthday_age_range">
        <el-radio-group v-model="member.birthday_age_range">
          <el-radio-button :label="'18-20'">18-20</el-radio-button>
          <el-radio-button :label="'21-30'">21-30</el-radio-button>
          <el-radio-button :label="'31-40'">31-40</el-radio-button>
          <el-radio-button :label="'41-50'">41-50</el-radio-button>
          <el-radio-button :label="'51-60'">51-60</el-radio-button>
          <el-radio-button :label="'61+'">61+</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="會籍" prop="level_id">
        <el-select v-model="member.level_id" placeholder="請選擇會籍">
          <el-option
            v-for="item in levelList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="會籍信息">
        <el-form-item label=""
                      v-if="member.proprietor && member.proprietor.length > 0"
                      v-for="(property,index) in member.proprietor">
          <el-row>物業 {{index+1}}</el-row>
          <el-row>
            身份：
            <el-radio-group v-model="property.customer_type">
              <el-radio-button :label="0">業主</el-radio-button>
              <el-radio-button :label="1">住戶</el-radio-button>
              <el-radio-button :label="2">租戶</el-radio-button>
            </el-radio-group>
          </el-row>
          <el-row>
            單位：<span v-for="item in proprietorList" v-if="item.id == property.role">{{item.name}}</span> {{ property.unit }}
          </el-row>
          <el-row>
            證明：<a :href="property.pic">{{ property.pic }}</a>
          </el-row>
        </el-form-item>
      </el-form-item>
      <el-form-item label="通訊地址">
        <el-input v-model="member.address"
                  placeholder="通訊地址"></el-input>
      </el-form-item>
      <el-form-item label="地區/分區">
        <el-cascader
          :options="regionList"
          v-model="region_area"
          @change="handleRegionChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="感興趣類別">
        <el-checkbox-group v-model="member.hobby">
          <el-checkbox
            v-for="item in hobbyList"
            :label="item.value" :key="item.value">
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="職業">
        <el-select v-model="member.occupation" class="selects-item" placeholder="請選擇職業" @change="handleChange">
          <el-option
            v-for="item in occuptaionList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年薪">
        <el-select v-model="member.yearly_salary" class="selects-item" placeholder="請選擇年薪" @change="handleChange">
          <el-option
            v-for="item in yearSalList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="婚姻狀況">
        <el-select v-model="member.marital" class="selects-item" placeholder="請選擇婚姻狀況" @change="handleChange">
          <el-option
            v-for="item in maritalList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="您的家庭子女數">
        <el-select v-model="member.family_number" class="selects-item" placeholder="請選擇家庭子女數" @change="handleChange">
          <el-option
            v-for="item in familyNumList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上傳已關注Facebook" v-if="false">
        <img-card v-if="member.facebook_url" :imgUrl="member.facebook_url" :disabled="true"></img-card>
        <span v-else>(空)</span>
      </el-form-item>
      <el-form-item v-if="(CREATE && !id) || (EDIT && id)">
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit" v-if="member.status == '1'" >保存</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit" v-if="member.status != '1'" >待審批</el-button>
        <el-button type="primary" @click="handleActivateEmail()" v-if="member.id != ''">激活電郵</el-button>
        <el-button type="primary" @click="handleResetPassword()" v-if="member.id != ''">重置密碼</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    save,
    edit,
    activateEmail,
    resetPassword,
    getDefaultArray,
  } from '@/api/member/memberDetail';
  import {
    searchLists,
  } from '@/api/member/memberList';
  import {
    baseVanke,
  } from '@/util/index';
  import ImgCard from "../common/ImgCard";

  export default {
    name: "memberDetail",
    components:{
      ImgCard,
    },
    data() {
        return {
          id: '',
          defaultArray: '',
          titleList: [], // 称谓选项
          proprietorList: [], // 是否是万科业主
          hobbyList: [],//兴趣列表
          regionList: [],// 区域和分区
          levelList: [],
          familyNumList: [],
          maritalList: [],
          yearSalList: [],
          occuptaionList: [],
          codeList: [],
          statusList: [],
          loading: false,
          submitLoading: false,
          region_area: [],

          VIEW: false,
          CREATE: false,
          EDIT: false,
          DELETE: false,
          EXPORT: false,
          member: {
            id: '',
            level_id: '39e6702a-c478-9b5b-35b4-59efdbe9a467',
            club_id:'',
            title: 'Mr',
            name_c: '',
            name_e: '',
            name_alias_e: '', //英文别称
            birthday: '',
            birthday_month: '',
            birthday_age_range: '',
            region: '',
            area: '',
            address: '',
            hobby: [],
            card_num: '',
            nationcode: '852',
            phone: '',
            email: '',
            occupation: '',
            family_number: '',
            marital: '',
            yearly_salary: '',
            proprietor: [],
            status: '1',
            deleted: '',
            is_use: '', //是否同意本公司使用个人资料（1为不同意，0为同意） is_use integer
            is_share: '',
          },

          rules: {
            title: [
              { required: true, message: '請輸入稱謂', trigger: 'blur' }
            ],
            name_c: [
              { required: true, message: '請輸入中文全名', trigger: 'blur' }
            ],
            name_e: [
              { required: true, message: '請輸入英文全名', trigger: 'blur' }
            ],
            email: [
              { required: true, message: '請輸入郵箱', trigger: 'blur' }
            ],
            phone: [
              { required: true, message: '請輸入手提電話', trigger: 'blur' }
            ],
            birthday: [
              { required: true, message: '請輸入出生日期', trigger: 'blur' }
            ],
            birthday_month: [
              { required: true, message: '請輸入出生月份', trigger: 'blur' }
            ],
            birthday_age_range: [
              { required: true, message: '請輸入年齡', trigger: 'blur' }
            ],
            level_id: [
              { required: true, message: '請輸入會籍', trigger: 'blur' }
            ],
          }
        }
    },
    mounted() {
      this.defaultArray = JSON.parse(sessionStorage.getItem("defaultArray"));
      if(!!this.defaultArray) {
        this.setDefault();
      }
    },
    activated() {
      if(!this.defaultArray) {
        getDefaultArray().then((response) => {
          this.defaultArray = response.data;
          sessionStorage.setItem("defaultArray", JSON.stringify(response.data));
          this.setDefault();
          this.getItemDetail();
        });
      } else {
        console.log(this.defaultArray);
        this.getItemDetail();
      }

    },
    deactivated() {
      this.resetForm();
    },
    methods: {
      // 重置页面数据
      resetForm() {
        this.id = '';
        this.defaultArray = '';
        this.titleList = [];
        this.proprietorList = [];
        this.hobbyList = [];
        this.regionList = [];
        this.levelList = [];
        this.familyNumList = [];
        this.maritalList = [];
        this.yearSalList = [];
        this.occuptaionList = [];
        this.codeList = [];
        this.statusList = [];
        this.loading = false;
        this.submitLoading = false;
        this.region_area = [];
        this.member.id = '';
        this.member.level_id = '39e6702a-c478-9b5b-35b4-59efdbe9a467';
        this.member.club_id = '';
        this.member.title = 'Mr';
        this.member.name_c = '';
        this.member.name_e = '';
        this.member.name_alias_e = '';
        this.member.birthday = '';
        this.member.birthday_month = '';
        this.member.birthday_age_range = '';
        this.member.region = '';
        this.member.area = '';
        this.member.address = '';
        this.member.hobby = [];
        this.member.card_num = '';
        this.member.nationcode = '852';
        this.member.phone = '';
        this.member.email = '';
        this.member.occupation = '';
        this.member.family_number = '';
        this.member.marital = '';
        this.member.yearly_salary = '';
        this.member.proprietor = [];
        this.member.status = '1';
        this.member.deleted = '';
        this.member.is_use = '';
        this.member.is_share = '';
        this.$refs.member.resetFields();
      },
      // 初始化页面默认数据
      setDefault() {
        this.titleList = this.defaultArray.title;
        this.proprietorList = this.defaultArray.proprietor;
        this.hobbyList = this.defaultArray.hobby;
        this.regionList = this.defaultArray.region;
        this.familyNumList = this.defaultArray.family_number;
        this.maritalList = this.defaultArray.marital;
        this.yearSalList = this.defaultArray.yearly_salary;
        this.occuptaionList = this.defaultArray.occuptaion;
        this.codeList = baseVanke.elFormatCodeArray(this.defaultArray.phone_code,'nationcode','name_c','nationcode');
      },
      /*
      * 获取当前页面的详细信息
      * */
     getItemDetail() {
        this.loading = true;
        const self = this;
        this.id = this.$route.query.id;
        let reqData = {
          id: this.id
        };
        searchLists().then(function(response){
          if (!response.data.VIEW) {
            self.$message.error('沒有權限！');
            self.$router.push('/customer/list');
            return;
          }
          self.VIEW = response.data.VIEW;
          self.CREATE = response.data.CREATE;
          self.EDIT = response.data.EDIT;
          self.DELETE = response.data.DELETE;
          self.EXPORT = response.data.EXPORT;
          self.levelList = baseVanke.elFormatArray(response.data.level.list,'id', 'name');
          if (reqData.id) {
            edit(reqData).then(function(response){
              if(self.id) {
                self.member = response.data.data;
                self.region_area = [];
                self.region_area.push(self.member.region,self.member.area);
              }
            }).catch(function(error) {
              self.$message.error(error.message);
            }).finally(function() {
              self.loading = false;
            });
          }
          else {
            self.loading = false;
          }
        }).catch(function(error) {
          self.loading = false;
          self.$message.error(error.message);
        });
      },
      // 地区切换
      handleRegionChange(value) {
        if(!!value) {
          this.member.region = value[0];
          this.member.area = value[1];
        }
        console.log(value);
      },
      // activate email
      async handleActivateEmail() {
        try {
          let req = await this.$confirm('此操作將向會員郵箱發送激活郵件，確定重置?', '警告', {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            type: 'warning'
          });
          let reset = await activateEmail(this.id);
          if(reset.data.errcode === 0) {
            this.$message({
              type: 'success',
              message: reset.data.errmsg,
            });
          }
        } catch(e) {
          if(e === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          }
          if(!!e.data) {
            this.$message.error(e.data.errmsg);
          }
        }
      },
      // 重置密码
      async handleResetPassword() {
        try {
          let req = await this.$confirm('此操作將向會員郵箱發送重置密碼郵件，確定重置?', '警告', {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            type: 'warning'
          });
          let reset = await resetPassword(this.id);
          if(reset.data.errcode === 0) {
            this.$message({
              type: 'success',
              message: reset.data.errmsg,
            });
          }
        } catch(e) {
          if(e === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          }
          if(!!e.data) {
            this.$message.error(e.data.errmsg);
          }
        }
      },
      // 生成提交格式的爱好
      getSubmitHobby() {
        let hobbys = '';
        const hobbyCheck = this.member.hobby;
        hobbyCheck.forEach( (item) => {
          hobbys += item + ',';
        });
        return !!hobbys ? hobbys.substring(0, hobbys.length - 1) : '';
      },
      // 点击保存提示
      handleSubmit() {
        const self = this;
        this.$refs.member.validate((valid)=>{
          if(!valid) {
            self.$message.error('表單填寫有誤！');
            return false;
          }
          this.$confirm('此操作將修改會員資料且不可撤銷, 是否继续?', '警告', { confirmButtonText: '確定', cancelButtonText: '取消', type: 'warning' })
          .then(() => {
            this.submitLoading = true;
            let data = {
              id: this.member.id,
              level_id: this.member.level_id,
              club_id: this.member.club_id,
              title: this.member.title,
              name_c: this.member.name_c,
              name_e: this.member.name_e,
              name_alias_e: this.member.name_alias_e,
              birthday: this.member.birthday,
              birthday_month: this.member.birthday_month,
              birthday_age_range: this.member.birthday_age_range,
              region: this.member.region,
              area: this.member.area,
              address: this.member.address,
              hobby: this.getSubmitHobby(),
              card_num: this.member.card_num,
              nationcode: this.member.nationcode,
              phone: this.member.phone,
              email: this.member.email,
              proprietor: JSON.stringify(this.member.proprietor || []),
              occupation: this.member.occupation,
              yearly_salary: this.member.yearly_salary,
              marital: this.member.marital,
              family_number: this.member.family_number,
              facebook_url: this.member.facebook_url,
              status: this.member.status,
              is_use: this.member.is_use, //是否同意本公司使用个人资料（1为不同意，0为同意） is_use integer
              is_share: this.member.is_share, //是否同意本公司指定伙伴公司共用个人资料（1为不同意，0为同意） is_share integer
            };
            save(data)
              .then(() => {
                self.submitLoading = false;
                self.$message({
                  message: '保存成功',
                  type: 'success'
                });
                self.$router.push('/customer/list');
              })
              .catch(function(error) {
                self.$message.error(error.message)
              }).finally(function() {
                self.submitLoading = false;
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  .region-line {
    display: flex;
  }
  .region-line .el-input {
    flex:1;
    &:nth-of-type(1) {
      margin-right: 10px;
    }
  }
  .el-tag {
    margin-right: 10px;
  }
</style>



// WEBPACK FOOTER //
// src/components/member/memberDetail.vue