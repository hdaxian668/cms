<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/project/list' }">項目管理</el-breadcrumb-item>
        <el-breadcrumb-item>項目詳情</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="project"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="project"
             :rules="rules"
             label-position="left"
             label-width="160px">
      <el-form-item label="項目名稱" prop="name_c">
        <el-input v-model="project.name_c" placeholder="項目中文名稱"></el-input>
      </el-form-item>
      <el-form-item prop="name_e">
        <el-input v-model="project.name_e" placeholder="項目英文名稱"></el-input>
      </el-form-item>
      <el-form-item label="所在區域" prop="region_c">
        <el-select v-model="project.region_c" placeholder="請選擇所在區域（中）">
          <el-option
            v-for="item in regionCList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="region_e">
        <el-select v-model="project.region_e" placeholder="請選擇所在區域（英）">
          <el-option
            v-for="item in regionEList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="項目地址" prop="address_c">
        <el-input v-model="project.address_c" placeholder="項目中文地址"></el-input>
      </el-form-item>
      <el-form-item prop="address_e">
        <el-input v-model="project.address_e" placeholder="項目英文地址"></el-input>
      </el-form-item>
      <el-form-item label="類型" prop="type">
        <el-select v-model="project.type" placeholder="請選擇" @change="handleTypeChange">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="發展類別" prop="category">
        <el-select v-model="project.category" placeholder="請選擇">
          <el-option
            v-for="item in categoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="狀況" prop="status">
        <el-select v-model="project.status" placeholder="請選擇">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="project.type === '2'"
                    label="服務公寓面積" prop="area_min"
                    class = "items is-required">
        <el-input v-model="project.area_min" placeholder="最小面積"></el-input>
        <span>到</span>
        <el-input v-model="project.area_max" placeholder="最大面積"></el-input>
        <span class="inner-label">平呎</span>
      </el-form-item>
      <el-form-item v-show="project.type === '2'"
                    label="最低租金" prop="amount" class="is-required">
        <el-input v-model="project.amount" placeholder="最低租金"></el-input>
       <span class="inner-label">起</span>
      </el-form-item>
      <el-form-item label="店家電話">
        <el-input v-model="project.store_phone" placeholder="請輸入店家電話"></el-input>
      </el-form-item>
      <el-form-item label="更多詳情" prop>
        <el-input v-model="project.more_url" placeholder="連接地址"></el-input>
      </el-form-item>
      <el-form-item label="圖片展示">
        <el-row class="vk-waring-text">圖片建議尺寸 16 : 9</el-row>
      </el-form-item>
      <el-form-item label="封面圖片" prop="cover">
        <single-img-upload
          :img-url="project.cover"
          @uploadOnSuccess="handleCoverImgSuccess"
          @uploadOnRemove="handleCoverImgRemove"
          @uploadOnError="handleImgError"></single-img-upload>
      </el-form-item>
      <el-form-item label="項目圖片" prop="images">
        <img-cards-upload
          :upload-list="project.images"
          @uploadOnSuccess="handleImgItemSuccess"
          @uploadOnRemove="handleImgItemRemove"
          @uploadOnError="handleImgError"
          @sortUp="handleImgItemSortUp"
          @sortDown="handleImgItemSortDown"></img-cards-upload>
      </el-form-item>
      <el-form-item label="項目介紹" prop="remark_c">
        <p>中文介紹</p>
        <el-input type="textarea"
                  :rows="5"
                  placeholder="請輸入中文"
                  v-model="project.remark_c"></el-input>
        <!--<div class="editor-container">-->
          <!--<u-editor ref="remark_c" :defaultMsg="project.remark_c"  id="remark_c"></u-editor>-->
        <!--</div>-->
      </el-form-item>
      <el-form-item prop="remark_e">
        <p>英文介紹</p>
        <el-input type="textarea"
                  :rows="5"
                  placeholder="請輸入英文"
                  v-model="project.remark_e"></el-input>
        <!--<div class="editor-container">-->
          <!--<u-editor ref="remark_e" :defaultMsg="project.remark_e"  id="remark_e"></u-editor>-->
        <!--</div>-->
      </el-form-item>
      <el-form-item label="第三方信息" prop="extend" v-if="project.type !== '2'">
        <extend-msg v-for="(item,index) in project.extend"
                    ref="extend"
                   :item="item"
                   :index="index"
                   @sortUp="extendSortUp"
                   @sortDown="extendSortDown"
                   @itemDelete="extendItemDelete">
        </extend-msg>
        <i class="el-icon-plus uploader-icon add-extend"
           @click="addExtendItem"></i>
      </el-form-item>


      <el-form-item label="用戶手冊" prop="is_user_guide">
        <el-radio-group v-model="project.is_user_guide">
          <el-radio-button v-for="item in isUserGuideList"  :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用戶手冊" prop="user_guide_url_tc">
        <el-input v-model="project.user_guide_url_tc" placeholder="繁體中文用戶手冊"></el-input>
      </el-form-item>
      <el-form-item prop="user_guide_url_sc">
        <el-input v-model="project.user_guide_url_sc" placeholder="簡體中文用戶手冊"></el-input>
      </el-form-item>
      <el-form-item prop="user_guide_url_en">
        <el-input v-model="project.user_guide_url_en" placeholder="英文用戶手冊"></el-input>
      </el-form-item>

      <el-form-item label="修繕報告" prop="is_defect">
        <el-radio-group v-model="project.is_defect">
          <el-radio-button v-for="item in isDefectList"  :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="產權認證API" prop="is_auth_api_ready">
        <el-radio-group v-model="project.is_auth_api_ready">
          <el-radio-button v-for="item in isAuthApiList"  :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="大門" prop="is_door_lock">
        <el-radio-group v-model="project.is_door_lock">
          <el-radio-button v-for="item in isDoorList"  :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="智能家居" prop="is_home_auto">
        <el-radio-group v-model="project.is_home_auto">
          <el-radio-button v-for="item in isHomeList"  :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="訪客邀請" prop="is_friend_pass">
        <el-radio-group v-model="project.is_friend_pass">
          <el-radio-button v-for="item in isFriendList"  :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="訪客證使用次數" prop="visitor_pass_number_of_access">
        <el-input v-model="project.visitor_pass_number_of_access" placeholder="訪客證使用次數" maxlength="2"></el-input>
      </el-form-item>
      <el-form-item label="訪客證有效時間(小時)" prop="visitor_pass_allow_hour">
        <el-input v-model="project.visitor_pass_allow_hour" placeholder="訪客證有效時間(小時)" maxlength="3"></el-input>
      </el-form-item>
      <el-form-item label="訪客證車牌輸入" prop="visitor_pass_driving_license_enable">
        <el-radio-group v-model="project.visitor_pass_driving_license_enable">
          <el-radio-button v-for="item in friendDrivingLicenseEnableList"  :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="訪客記錄保留日數" prop="visitor_log_clean_up_day">
        <el-input v-model="project.visitor_log_clean_up_day" placeholder="訪客記錄保留日數" maxlength="3"></el-input>
      </el-form-item>

      <el-form-item label="藍芽開門" prop="is_bluetooth">
        <el-radio-group v-model="project.is_bluetooth">
          <el-radio-button v-for="item in isBluetoothList"  :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="信箱" prop="is_mail_box">
        <el-radio-group v-model="project.is_mail_box">
          <el-radio-button v-for="item in isMailList"  :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="物管" prop="is_property_management">
        <el-radio-group v-model="project.is_property_management">
          <el-radio-button v-for="item in isPropertyManagementList"  :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="餐廳" prop="is_restaurant">
        <el-radio-group v-model="project.is_restaurant">
          <el-radio-button v-for="item in isRestaurantList"  :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="餐廳URL" prop="restaurant_url">
        <el-input v-model="project.restaurant_url" placeholder="餐廳URL"></el-input>
      </el-form-item>

      <el-form-item label="聯繫" prop="feedback_enable">
        <el-radio-group v-model="project.feedback_enable">
          <el-radio-button v-for="item in feedbackEnableList"  :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="聯繫電郵(用','分隔)" prop="feedback_email">
        <el-input v-model="project.feedback_email" placeholder="聯繫電郵(用','分隔)"></el-input>
      </el-form-item>

      <el-form-item v-if="(CREATE && !id) || (EDIT && id)">
        <el-button type="primary" :loading="submitLoading"  @click="onSubmit">提交</el-button>
        <!--<el-button type="primary" @click="resetForm('project')">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  // import UEditor from '../common/UEditor';
  import ExtendMsg from './ExtendMsg';
  import SingleImgUpload from "../common/SingleImgUpload/SingleImgUpload";
  import ImgCardsUpload from "../common/ImgCardsUpload/ImgCardsUpload";
  import {
    edit,
    save
  } from '@/api/project/projectDetail';
  import {
    baseVanke,
    baseUtil,
  } from '@/util/index';

  export default {
    name: 'projectDetail',
    components: {
      // UEditor,
      ExtendMsg,
      SingleImgUpload,
      ImgCardsUpload,
    },
    data() {
      const checkAreaData = (rule, value, callback) => {
        if(this.project.type === '2') {
          if(value !== '') {
            if(!this.project.area_max || parseFloat(value) > parseFloat(this.project.area_max)) {
              callback(new Error('最大面積應大於最小面積'));
            } else {
              callback();
            }
          } else {
            callback(new Error('請輸入面積信息'));
          }
        } else {
          callback();
        }
      };
      const checkAmountData = (rule, value, callback) => {
        if(this.project.type === '2') {
          if(value !== '') {
              callback();
          } else {
            callback(new Error('請輸入最低租金'));
          }
        } else {
          callback();
        }
      };
      const checkAtLeastOne = (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('請輸入大於0'));
        } else {
          callback()
        }
      };
      return {
        id: '',
        loading: false,
        submitLoading: false,
        rules: {
          name_c: [
            {required: true, message: '請輸入項目名稱', trigger: 'blur'}
          ],
          name_e: [
            {required: true, message: '請輸入項目名稱（英）', trigger: 'blur'}
          ],
          region_c: [
            {required: true, message: '請選擇所在區域', trigger: 'change'}
          ],
          region_e: [
            {required: true, message: '請選擇所在區域（英）', trigger: 'change'}
          ],
          category:  [
            {required: true, message: '請選擇項目發展類別', trigger: 'change'}
          ],
          status:  [
            {required: true, message: '請選擇項目狀況', trigger: 'change'}
          ],
          type:  [
            {required: true, message: '請選擇項目類型', trigger: 'change'}
          ],
          is_user_guide: [
            {required: true, message: '請選擇用戶手冊', trigger: 'change'}
          ],
          is_defect: [
            {required: true, message: '請選擇修繕報告', trigger: 'change'}
          ],
          is_auth_api_ready: [
            {required: true, message: '請選擇產權認證API', trigger: 'change'}
          ],
          is_door_lock: [
            {required: true, message: '請選擇大門', trigger: 'change'}
          ],
          is_home_auto: [
            {required: true, message: '請選擇智能家居', trigger: 'change'}
          ],
          is_friend_pass: [
            {required: true, message: '請選擇訪客邀請', trigger: 'change'}
          ],
          is_bluetooth: [
            {required: true, message: '請選擇藍芽開門', trigger: 'change'}
          ],
          is_mail_box: [
            {required: true, message: '請選擇信箱', trigger: 'change'}
          ],
          is_property_management: [
            {required: true, message: '請選擇物管', trigger: 'change'}
          ],
          is_restaurant: [
            {required: true, message: '請選擇餐廳', trigger: 'change'}
          ],
          feedback_enable: [
            {required: true, message: '請選擇聯繫', trigger: 'change'}
          ],
          remark_c:[
            {required: true, message: '請輸入項目描述', trigger: 'blur'}
          ],
          remark_e:[
            {required: true, message: '請輸入項目描述（英）', trigger: 'blur'}
          ],
          address_c:[
            {required: true, message: '請輸入項目地址', trigger: 'blur'}
          ],
          address_e:[
            {required: true, message: '請輸入項目地址（英）', trigger: 'blur'}
          ],
          feedback_email: [
            {required: true, message: '聯繫電郵', trigger: 'blur'},
          ],
          cover:[
            {required: true, message: '請添加封面圖片', trigger: 'change'}
          ],
          images: [
            {required: true, message: '請添加項目圖片', trigger: 'change'}
          ],
          amount:[
            { validator: checkAmountData, trigger: 'blur'},
          ],
          area_min: [
            { validator: checkAreaData, trigger: 'blur'},
          ],
          visitor_pass_driving_license_enable: [
            {required: true, message: '請選擇訪客證車牌輸入', trigger: 'change'}
          ],
          visitor_pass_number_of_access:[
            { validator: checkAtLeastOne, trigger: 'blur'},
          ],
          visitor_pass_allow_hour:[
            { validator: checkAtLeastOne, trigger: 'blur'},
          ],
          visitor_log_clean_up_day:[
            { validator: checkAtLeastOne, trigger: 'blur'},
          ],
        },        
        regionCList: [], // 所在區域
        regionEList: [], // 所在區域
        typeList: [],
        categoryList:[],
        statusList:[],
        isDefectList:[],
        isBluetoothList:[],
        isMailList:[],
        isFriendList:[],
        isHomeList:[],
        isDoorList:[],

        VIEW: false,
        CREATE: false,
        EDIT: false,
        DELETE: false,
        EXPORT: false,
        project: {
          address_c: '', // 中文地址
          address_e: '', // 英文地址
          feedback_enable: '0',
          feedback_email: '',
          category: '', // 发展类别
          more_url:'', // 更多详情
          store_phone: '', //店家電話
          cover: '',
          id: '', //
          images: [],
          name_c: '',
          name_e: '',
          remark_c: '', // 项目描述
          remark_e: '', // 项目描述
          user_guide_url_en: '', //用戶手冊
          user_guide_url_tc: '', //用戶手冊
          user_guide_url_sc: '', //用戶手冊
          sort: "",
          status: '', // 状况
          type: '', // 类型
          visible: "",
          region_c:'',
          region_e:'',
          area:'',
          area_min: '',
          area_max:'',
          amount: '',
          extend: [
            // {
            //   id: "1",
            //   project_id: "1",
            //   name_c: "2",
            //   name_e: "2",
            //   url: "2",
            //   sort: "1"
            // },
          ], // 第三方信息
          is_defect: '0', 
          is_bluetooth: '0', 
          is_mail_box: '0', 
          is_friend_pass: '0', 
          visitor_pass_number_of_access: '1', 
          visitor_pass_allow_hour: '1', 
          visitor_pass_driving_license_enable: '0', 
          visitor_log_clean_up_day: '30', 
          is_home_auto: '0', 
          is_door_lock: '0', 
          is_auth_api_ready: '0',
          is_property_management: '0',
          is_restaurant: '0',
          restaurant_url: '',
          is_user_guide: '0',
        },
      }
    },
    activated() {
      this.getItemDetail();
    },
    deactivated() {
      // this.resetForm('project'); // 通过elementUI清空表单，但其余部分不会清空，所以不适用
      this.initDetail();
    },
    methods: {
      /*
      * elementUI 提供的表单清空函数，但我们并不仅仅要清空表单
      * */
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      initDetail() {
          this.id = '';
          this.regionCList=[]; // 所在區域
          this.regionEList=[]; // 所在區域
          this.typeList = [];
          this.categoryList = [];
          this.statusList = [];
          this.isDefectList = [];
          this.isBluetoothList = [];
          this.isMailList = [];
          this.isFriendList = [];
          this.isHomeList = [];
          this.isDoorList = [];
          this.project = {
            address_c: '', // 中文地址
            address_e: '', // 英文地址
            feedback_enable: '0',
            feedback_email: '',
            more_url:'',
            store_phone: '', //店家電話
            category: '', // 发展类别
            cover: '',
            id: '', //
            images: [],
            name_c: '',
            name_e: '',
            remark_c: '', // 项目描述
            remark_e: '', // 项目描述
            user_guide_url_en: '', // 用戶手冊
            user_guide_url_tc: '', // 用戶手冊
            user_guide_url_sc: '', // 用戶手冊
            sort: "",
            status: '', // 状况
            type: '', // 类型
            visible: "",
            region_c:'',
            region_e:'',
            area:'',
            amount: '',
            extend: [], // 第三方信息
            is_defect: '0', 
            is_bluetooth: '0', 
            is_mail_box: '0', 
            is_friend_pass: '0', 
            visitor_pass_number_of_access: '1', 
            visitor_pass_allow_hour: '1', 
            visitor_pass_driving_license_enable: '0', 
            visitor_log_clean_up_day: '30', 
            is_home_auto: '0', 
            is_door_lock: '0', 
            is_auth_api_ready: '0',
            is_property_management: '0',
            is_restaurant: '0',
            restaurant_url: '',
            is_user_guide: '0',
        };
          this.$refs.project.clearValidate(); // 清空规则
      },
      /* 获取当前页面的详细信息 */
      getItemDetail() {
        this.loading = true;
        let self = this;
        // this.id = this.$route.params.id;
        this.id = this.$route.query.id;
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
          self.regionCList = baseVanke.elFormatArray(response.data.region.CNTW,'name','name');
          self.regionEList = baseVanke.elFormatArray(response.data.region.EN,'name','name');
          self.typeList = baseVanke.elFormatArray(response.data.type);
          self.categoryList = baseVanke.elFormatArray(response.data.category);
          self.statusList = baseVanke.elFormatArray(response.data.status);
          self.isDefectList = baseVanke.elFormatArray(response.data.is_defect);
          self.isBluetoothList = baseVanke.elFormatArray(response.data.is_bluetooth);
          self.isMailList = baseVanke.elFormatArray(response.data.is_mail_box);
          self.isFriendList = baseVanke.elFormatArray(response.data.is_friend_pass);
          self.friendDrivingLicenseEnableList = baseVanke.elFormatArray(response.data.visitor_pass_driving_license_enable);
          self.isHomeList = baseVanke.elFormatArray(response.data.is_home_auto);
          self.isDoorList = baseVanke.elFormatArray(response.data.is_door_lock);
          self.isAuthApiList = baseVanke.elFormatArray(response.data.is_auth_api_ready);
          self.isPropertyManagementList = baseVanke.elFormatArray(response.data.is_property_management);
          self.isRestaurantList = baseVanke.elFormatArray(response.data.is_restaurant);
          self.isUserGuideList = baseVanke.elFormatArray(response.data.is_user_guide);
          self.feedbackEnableList = baseVanke.elFormatArray(response.data.feedback_enable);
          if(self.id) {
            self.project = response.data.project;
            self.project.extend = self.extendFormat(self.project.extend);
            if(!!response.data.project.area) {
              self.project.area_min = response.data.project.area.split('-')[0];
              self.project.area_max = response.data.project.area.split('-')[1];
            }
            // self.setUeditorContent();
          }
        }).catch(function(error) {
          self.$message.error(error.message);
        }).finally(function(){
          self.loading = false;
        });
      },
      /* 切换类型清空相应的数据 */
      handleTypeChange() {
        this.project.extend.splice(0, this.project.extend.length);
        this.project.amount = '';
        this.project.area_min = '';
        this.project.area_max = '';
      },

      /*
      * 上传图片失败
      * */
      handleImgError(err) {
        this.$message.error(err.message);
      },
      /**
       * 上传图片成功，将图片信息存入数组中
       * @param res - 上传图片成功的返回值
       */
      handleImgItemSuccess(res) {
        this.project.images.push(res.url);
        this.$refs.project.validateField('images'); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '上传成功!'
        });
      },
      /*
      * 删除图片
      * */
      handleImgItemRemove(index) {
        this.project.images.splice(index,1); // 刪除這一項
        this.$refs.project.validateField('images'); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '刪除成功!'
        });
      },
      handleImgItemSortUp(index) {
        let list = this.project.images;
        if(index> 0) { // 不是第一个的可以上移
          list = baseUtil.arrayChangeItem(list,index,index-1);
        }
      },
      handleImgItemSortDown(index) {
        let list = this.project.images;
        if(index < list.length-1) { // 不是最后一个的可以下移
          list  = baseUtil.arrayChangeItem(list ,index,index+1);
        }
      },
      /*
      * 上传封面图片
      * */
      handleCoverImgSuccess(res) {
        this.project.cover = res.url;
        this.$refs.project.validateField('cover'); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '上传成功!'
        });
      },
      /*
      * 删除封面图片
      * */
      handleCoverImgRemove() {
        this.project.cover = '';
        this.$refs.project.validateField('cover'); // 验证images是否符合规则
        this.$message({
          type: 'success',
          message: '刪除成功!'
        });
      },
      /*
      * 设置UEditor内容
      * */
      // setUeditorContent() {
      //   this.project.remark_c = this.project.remark_c || '';
      //   this.project.remark_e = this.project.remark_e || '';
      //   this.$refs.remark_c.setUEContent(this.project.remark_c);
      //   this.$refs.remark_e.setUEContent(this.project.remark_e);
      // },
      /*
      * 获取UEditor编辑器中的内容
      * */
      // getUeditorContent() {
      //   this.project.remark_c = this.$refs.remark_c.getUEContent();
      //   this.project.remark_e = this.$refs.remark_e.getUEContent();
      // },
      /**
       * 第三方信息列表操作
       */
      extendFormat(oldArray) {
        if(oldArray instanceof Array) {
          let formatArray = [];
          oldArray.forEach(function(item){
            formatArray.push({
              project_id: item.project_id,
              name_c: item.name_c,
              name_e: item.name_e,
              url: item.url,
            })
          });
          return formatArray;
        }
      },
      // 添加新第三方信息
      addExtendItem() {
        let item = {
          project_id: this.project.id,
          name_c: "",
          name_e: "",
          url: "",
        };
        this.project.extend.push(item);
      },
      // 排序上移
      extendSortUp(index) {
        let extend = this.project.extend;
        if(index> 0) { // 不是第一个的可以上移
          extend = baseUtil.arrayChangeItem(extend,index,index-1);
        }
      },
      // 排序下移
      extendSortDown(index) {
        let extend = this.project.extend;
        if(index < extend.length-1) { // 不是最后一个的可以下移
          extend = baseUtil.arrayChangeItem(extend,index,index+1);
        }
      },
      // 删除条目
      extendItemDelete(index) {
        const self = this;
        this.$confirm('請注意此操作無法恢復，是否繼續?', '確認刪除', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          self.project.extend.splice(index,1);
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
      /*
      *  提交代码
      */
      onSubmit() {
        // this.getUeditorContent();
        const self = this;

        // 验证扩展组件的规则
        let extendValid = true;
        this.project.extend && this.project.extend.length > 0 && this.project.extend.forEach(function(item,index){
          extendValid = extendValid && self.$refs.extend[index].validateForm();
        });
        this.$refs.project.validate((valid)=>{
          if(valid && extendValid) {
            this.submitLoading = true;
            let data = {
              project:{
                id: this.project.id,
                name_c: this.project.name_c,
                name_e: this.project.name_e,
                region_c: this.project.region_c,
                region_e: this.project.region_e,
                address_c: this.project.address_c,
                address_e: this.project.address_e,
                feedback_enable: this.project.feedback_enable,
                feedback_email: this.project.feedback_email,
                more_url: this.project.more_url,
                store_phone: this.project.store_phone, //店家電話
                cover: this.project.cover,
                images: JSON.stringify(this.project.images),
                type: this.project.type,
                category: this.project.category,
                status: this.project.status,
                remark_c: this.project.remark_c,
                remark_e: this.project.remark_e,
                user_guide_url_en: this.project.user_guide_url_en,
                user_guide_url_tc: this.project.user_guide_url_tc,
                user_guide_url_sc: this.project.user_guide_url_sc,
                is_defect: this.project.is_defect,
                is_bluetooth: this.project.is_bluetooth,
                is_mail_box: this.project.is_mail_box,
                is_friend_pass: this.project.is_friend_pass,
                visitor_pass_number_of_access: this.project.visitor_pass_number_of_access,
                visitor_pass_allow_hour: this.project.visitor_pass_allow_hour,
                visitor_pass_driving_license_enable: this.project.visitor_pass_driving_license_enable,
                visitor_log_clean_up_day: this.project.visitor_log_clean_up_day,
                is_home_auto: this.project.is_home_auto,
                is_door_lock: this.project.is_door_lock,
                is_auth_api_ready: this.project.is_auth_api_ready,
                is_property_management: this.project.is_property_management,
                is_restaurant: this.project.is_restaurant,
                restaurant_url: this.project.restaurant_url,
                is_user_guide: this.project.is_user_guide,
              },
              projectExtend: []
            };
            if(this.project.extend === []) {
              data.projectExtend = '';
            }
            if(this.project.type === '2') {
              data.project.area = this.project.area_min + '-' + this.project.area_max;
              data.project.amount = this.project.amount;
            } else {
              data.projectExtend = this.project.extend || [];
            }
            save(data).then(function() {
              self.$message({
                type: 'success',
                message: '提交成功!'
              });
              self.$router.push('/project/list');
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

</style>



// WEBPACK FOOTER //
// src/components/project/projectDetail.vue