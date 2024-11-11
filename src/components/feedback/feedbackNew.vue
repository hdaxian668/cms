<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/feedback/list' }">聯繫管理</el-breadcrumb-item>
        <el-breadcrumb-item>聯繫詳情</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-form ref="feedback"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="feedback"
             :rules="rules"
             label-position="left" label-width="150px">

      <div class="feedback-container">
        <div class="feedback-container-item item-left">
          <el-form-item label="查詢編號" prop="enquiry_id">
            <el-input placeholder="" v-model="feedback.enquiry_id" readonly="true"></el-input>
          </el-form-item>

          <!--
          <el-form-item label="查詢渠道" prop="channel_id">
            <el-select v-model="feedback.channel_id" placeholder="查詢渠道" class="selects-item" value-key="feedback.channel_id" :disabled="(!IS_CHANNEL_EDITABLE)">
              <el-option key="" value="" label="請選擇查詢渠道"></el-option>
              <el-option key="1" value="1" label="熱線電話"></el-option>
              <el-option key="2" value="2" label="電郵"></el-option>
              <el-option key="3" value="3" label="萬客會APP"></el-option>
              <el-option key="4" value="4" label="Facebook訊息"></el-option>
              <el-option key="5" value="5" label="其他"></el-option>
            </el-select>
          </el-form-item>
          -->
          <el-form-item label="查詢渠道" prop="channel_id">
            <el-select v-model="feedback.channel_id" placeholder="查詢渠道" class="selects-item" value-key="feedback.channel_id" :disabled="(!IS_CHANNEL_EDITABLE)">
              <el-option key="" value="" label="請選擇查詢渠道"></el-option>
              <el-option
                v-for="item in feedbackChannelList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-select>
          </el-form-item>

          <!--
          <el-form-item label="查詢類別" prop="category">
            <el-select v-model="feedback.category" placeholder="查詢類別" class="selects-item" value-key="feedback.category" :disabled="!((CREATE && !id) || (EDIT && id))">
              <el-option key="" value="" label="請選擇查詢類別"></el-option>
              <el-option key="1" value="1" label="會籍查詢"></el-option>
              <el-option key="2" value="2" label="銷售查詢"></el-option>
              <el-option key="3" value="3" label="物業管理查詢"></el-option>
            </el-select>
          </el-form-item>
          -->
          <el-form-item label="查詢類別" prop="category">
            <el-select v-model="feedback.category" placeholder="查詢類別" class="selects-item" value-key="feedback.category" :disabled="!((CREATE && !id) || (EDIT && id))">
              <el-option key="" value="" label="請選擇查詢類別"></el-option>
              <el-option
                v-for="item in feedbackCategoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-select>
          </el-form-item>

          <el-form-item label="查詢日期" prop="enquiry_date">
            <el-date-picker type="datetime" placeholder="日期"
                            v-model="feedback.enquiry_date"
                            default-time="12:00:00"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :picker-options="pickerOptions"
                            :readonly="!((CREATE && !id) || (EDIT && id))"></el-date-picker>
          </el-form-item>

          <el-form-item label="跟進群組" prop="assigned_group_id">
            <el-select v-model="feedback.assigned_group_id" placeholder="跟進群組" class="selects-item" value-key="feedback.assigned_group_id" :disabled="!(ASSIGN)">
              <el-option key="" value="" label="請選擇跟進群組" :disabled="(true)"></el-option>
              <el-option
                v-for="item in userGroupList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <!--
          <el-form-item label="聯絡人" prop="contact_person">
            <el-select v-model="feedback.contact_person" placeholder="聯絡人" class="selects-item" value-key="feedback.contact_person">
              <el-option key="" value="" label="聯絡人"></el-option>
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          -->

          <el-form-item label="狀態" prop="status">
            <el-select v-model="feedback.status" placeholder="狀態" class="selects-item" value-key="feedback.status" :disabled="!((CREATE && !id) || (EDIT && id))">
              <el-option key="" value="" label="請選擇狀態"></el-option>
              <el-option key="1" value="1" label="待處理" :disabled="(!UPDATE_TO_STATUS_1)"></el-option>
              <el-option key="2" value="2" label="處理中" :disabled="(!UPDATE_TO_STATUS_2)"></el-option>
              <el-option key="3" value="3" label="已完成" :disabled="(!UPDATE_TO_STATUS_3)"></el-option>
              <el-option key="4" value="4" label="關閉" :disabled="(!UPDATE_TO_STATUS_4)"></el-option>
              <el-option key="5" value="5" label="拒絕" :disabled="(!UPDATE_TO_STATUS_5)"></el-option>
              <el-option key="6" value="6" label="取消" :disabled="(!UPDATE_TO_STATUS_6)"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="創建時間" prop="create_time" v-if="(id)">
            <el-input placeholder="" v-model="feedback.create_time" readonly="true"></el-input>
          </el-form-item>

          <el-form-item label="最後更新時間" prop="alter_time" v-if="(id)">
            <el-input placeholder="" v-model="feedback.alter_time" readonly="true"></el-input>
          </el-form-item>
        </div>
        
        <div class="feedback-container-item item-right">
          <el-form-item label="物業" prop="project_id">
            <el-select v-model="feedback.project_id" placeholder="所有物業" class="selects-item" value-key="feedback.project_id" :disabled="!((CREATE && !id) || (EDIT && id))">
              <el-option key="" value="" label="其他"></el-option>
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :label="item.name_c"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <!--
          <el-form-item label="單位" prop="project_address">
            <el-input placeholder="請輸入單位" v-model="feedback.project_address" :readonly="!((CREATE && !id) || (EDIT && id))"></el-input>
          </el-form-item>
          -->
          <el-form-item label="單位" prop="project_address">
            <el-autocomplete
                v-model="feedback.project_address"
                :fetch-suggestions="unitSearch"
                placeholder="請輸入單位"
                @select="handleSelect"></el-autocomplete>
          </el-form-item>

          <el-form-item label="會員號碼" prop="club_id">
            <el-input placeholder="請輸入會員號碼 (VCxxxxxx)" v-model="feedback.club_id" :readonly="!((CREATE && !id) || (EDIT && id))"></el-input>
          </el-form-item>

          <el-form-item label="查詢者姓名/公司" prop="username">
            <el-input placeholder="請輸入查詢者姓名/公司" v-model="feedback.username" :readonly="!((CREATE && !id) || (EDIT && id))"></el-input>
          </el-form-item>
          
          <el-form-item label="手提電話" prop="phone">
            <el-row :gutter="20">
              <el-col :span="10" style="padding-left: 0;">
                <el-select v-model="feedback.nationcode" placeholder="請選擇地區號"  :disabled="!((CREATE && !id) || (EDIT && id))">
                  <el-option
                    v-for="item in codeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-input placeholder="請輸入手提電話" v-model="feedback.phone" :readonly="!((CREATE && !id) || (EDIT && id))"></el-input>
              </el-col>
            </el-row>

          </el-form-item>

          <el-form-item label="郵箱地址" prop="email">
            <el-input placeholder="請輸入郵箱地址" v-model="feedback.email" :readonly="!((CREATE && !id) || (EDIT && id))"></el-input>
          </el-form-item>

          <el-form-item label="創建人" prop="create_by_name" v-if="(id)">
            <el-input placeholder="" v-model="feedback.create_user_info.name" readonly="true"></el-input>
          </el-form-item>
        </div>
      </div>

      <el-form-item label="反饋內容" prop="content" style="width: 80%;">
        <el-input type="textarea"
                  :rows="5"
                  placeholder="請輸入反饋內容"
                  v-model="feedback.content" 
                  :readonly="(id)"
                  style="margin-bottom: 22px; border-bottom: 1px solid #ebeef5; padding-bottom: 25px;"></el-input>

        <feedback-content-item v-for="(item,index) in feedback.contentList"
                      ref="feedbackContent"
                      :item="item"
                      :index="index"
                      @sortUp="feedbackContentItemSortUp"
                      @sortDown="feedbackContentItemSortDown"
                      @itemDelete="feedbackContentItemDelete"></feedback-content-item>
        <i class="el-icon-plus uploader-icon add-extend"
           @click="addFeedbackContentItem" v-if="(CREATE && !id)"></i>
        <br />
        <label v-if="(CREATE && !id)">*若提交多於一項反饋內容，儲存後每項反饋內容將被拆分為一條獨立記錄</label>
      </el-form-item>


      <!--<el-form-item label="跟進備註" prop="" style="width: 80%; border-top: 1px solid #ebeef5; padding-top: 25px;" v-if="(VIEW_REMARK)">-->
      <div style="width: 90%; border-top: 1px solid #ebeef5; padding-top: 25px;" v-if="(VIEW_REMARK && id)">
        <div style="margin-bottom: 5px;">
          <label style="width: 15%; display: inline-block;">負責人</label>
          <label style="width: 15%; display: inline-block;">跟進群組</label>
          <label style="width: 15%; display: inline-block;">狀態</label>
          <label style="width: 20%; display: inline-block;">跟進日期</label>
          <label style="width: 33%; display: inline-block;">跟進備註</label>
        </div>
        <remark-item v-for="(item,index) in feedback.extend"
                      ref="remark"
                      :item="item"
                      :index="index"
                      @sortUp="extendSortUp"
                      @sortDown="extendSortDown"
                      @itemDelete="extendItemDelete"></remark-item>
        <i class="el-icon-plus uploader-icon add-extend" @click="addRemarkItem" v-if="(CREATE_REMARK)"></i>
      </div>
      <!--</el-form-item>-->

      <el-form-item v-if="(CREATE && !id) || (EDIT && id) || (CREATE_REMARK) || (ASSIGN)">
        <el-button type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
      </el-form-item>
      </el-form>
  </div>
</template>


<script>
  // import UEditor from '../common/UEditor';
  import RemarkItem from './remarkItem';
  import FeedbackContentItem from './feedbackContentItem';
  import SingleImgUpload from "../common/SingleImgUpload/SingleImgUpload";
  import {
    edit,
    save,
    getDefaultArray
  } from '@/api/feedback/feedbackDetail';
  import {
    baseVanke,
    baseUtil,
  } from '@/util/index';
  import moment from 'moment';

  export default {
    name: "feedbackDetail",
    components: {
      // UEditor,
      RemarkItem,
      FeedbackContentItem,
      SingleImgUpload
    },
    data() {

      const checkEmailFormat = (rule, value, callback) => {
        const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!value) {
          callback()
        } else {
          if (emailReg.test(value)) {
            callback()
          } else {
            callback(new Error('郵箱格式不正確'))
          }
        }
      };

      return {
        id: '',
        loading: false,
        submitLoading: false,
        rules: {
          username: [
            {required: true, message: '請輸入查詢者姓名/公司', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '請輸入反饋內容', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '請選擇狀態', trigger: 'blur'}
          ],
          enquiry_date: [
            {required: true, message: '請選擇查詢日期', trigger: 'blur'}
          ],
          channel_id: [
            {required: true, message: '請輸入查詢渠道', trigger: 'blur'}
          ],
          category: [
            {required: true, message: '請輸入查詢類別', trigger: 'blur'}
          ],
          email: [
            { validator: checkEmailFormat, trigger: 'blur'},
          ],
        },

        VIEW: false,
        VIEW_SELF: false,
        CREATE: false,
        EDIT: false,
        EDIT_SELF: false,
        DELETE: false,
        EXPORT: false,
        VIEW_REMARK: false,
        CREATE_REMARK: false,
        ASSIGN: false,

        UPDATE_TO_STATUS_1: false,
        UPDATE_TO_STATUS_2: false,
        UPDATE_TO_STATUS_3: false,
        UPDATE_TO_STATUS_4: false,
        UPDATE_TO_STATUS_5: false,
        UPDATE_TO_STATUS_6: false,

        IS_SELF_CREATE: false,
        IS_CHANNEL_EDITABLE: false,
        
        feedback: {
          id: '',
          enquiry_id: '(系統自動填寫)',
          channel_id: '',
          club_id: '',
          project_id: '',
          project_address: '',
          username: '',
          nationcode: '852',
          phone: '',
          email: '',
          category: '',
          content: '',
          contact_person: '',
          assigned_group_id: '',
          status: '',
          enquiry_date: moment().format("YYYY-MM-DD HH:mm:ss"),
          extend: [],
          contentList: [],
          create_user_info: {},
        },
        projectList: [],
        userList: [],
        userGroupList: [],
        projectUnitList: [],
        codeList: [],
        feedbackChannelList: [],
        feedbackCategoryList: [],

        defaultArray: '',

        

        pickerOptions: { disabledDate: this.disabledDate },
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
        });
      }

      this.getItemDetail();
    },
    deactivated() {
      this.initDetail();
    },
    methods: {
      /*
       * 初始化頁面數據
       * */
      initDetail() {
        this.id = '';
        this.feedback = {
          id: '',
          enquiry_id: '(系統自動填寫)',
          channel_id: '',
          club_id: '',
          project_id: '',
          project_address: '',
          username: '',
          nationcode: '852',
          phone: '',
          email: '',
          category: '',
          content: '',
          contact_person: '',
          assigned_group_id: '',
          status: '',
          enquiry_date: moment().format("YYYY-MM-DD HH:mm:ss"),
          extend: [],
          contentList: [],
          create_user_info: {},
        };
        this.$refs.feedback.clearValidate(); // 清空規則
      },
      /*
      * 獲取當前頁面的詳細信息
      * */
      getItemDetail() {
        this.loading = true;
        const self = this;
        this.id = this.$route.query.id;
        let reqData = {
          id: this.id
        };
        edit(reqData).then(function(response){
          self.IS_SELF_CREATE = (response.data.current_user_id == response.data.feedbackInfo.create_by);
          self.IS_IN_ASSIGNED_GROUP = (response.data.current_user_group_id == response.data.feedbackInfo.assigned_group_id);

          let hasPermission = (
            response.data.VIEW ||
            (response.data.VIEW_SELF && (self.IS_SELF_CREATE || self.IS_IN_ASSIGNED_GROUP)) ||
            (response.data.CREATE && !self.id)
          );

          if (!hasPermission) {
            self.$message.error('沒有權限！');
            self.$router.push('/feedback/list');
            return;
          }

          self.VIEW = response.data.VIEW;
          self.VIEW_SELF = response.data.VIEW_SELF;
          self.CREATE = response.data.CREATE;
          self.EDIT = ((response.data.EDIT) || (response.data.EDIT_SELF && (self.IS_SELF_CREATE || self.IS_IN_ASSIGNED_GROUP)));
          self.EDIT_SELF = response.data.EDIT_SELF;
          self.DELETE = response.data.DELETE;
          self.EXPORT = response.data.EXPORT;
          self.VIEW_REMARK = response.data.VIEW_REMARK;
          self.CREATE_REMARK = response.data.CREATE_REMARK;
          self.ASSIGN = response.data.ASSIGN;
        
          self.UPDATE_TO_STATUS_1 = response.data.UPDATE_TO_STATUS_1;
          self.UPDATE_TO_STATUS_2 = response.data.UPDATE_TO_STATUS_2;
          self.UPDATE_TO_STATUS_3 = response.data.UPDATE_TO_STATUS_3;
          self.UPDATE_TO_STATUS_4 = response.data.UPDATE_TO_STATUS_4;
          self.UPDATE_TO_STATUS_5 = response.data.UPDATE_TO_STATUS_5;
          self.UPDATE_TO_STATUS_6 = response.data.UPDATE_TO_STATUS_6;

          if(self.id) {
            self.feedback =  Object.assign({}, self.feedback,response.data.feedbackInfo);
            // self.setUeditorContent();
          }

          self.projectList = baseVanke.elPropertyList(response.data.projectList);
          self.userList = baseVanke.elUserList(response.data.userList);
          self.userGroupList = baseVanke.elUserGroupList(response.data.userGroupList);
          self.projectUnitList = response.data.projectUnitList;
          self.feedbackChannelList = response.data.feedbackChannelList;
          self.feedbackCategoryList = response.data.feedbackCategoryList;

          self.IS_CHANNEL_EDITABLE = (
            (self.CREATE && !self.id) || 
            (self.EDIT && self.id && (self.feedback.channel_id == '' || !self.feedback.channel_id))
          );

          if (self.id) {
            self.addRemarkItem();
          }
          
	  
        }).catch(function(error) {
          self.$message.error(error.message);
        }).finally(function() {
          self.loading = false;
        });
      },

      /**
       * 跟進備註列表操作
       */
      extendSubmitFormat(extend) {
        if(extend instanceof Array) {
          extend.forEach((item,index) => {
            item.sort = index + 1;
          });
        }
      },
      /**
       * 添加跟進備註
       */
      addRemarkItem() {
        let item ={
          feedback_id: this.id,
          content: '',
          remark_date: moment().format("YYYY-MM-DD HH:mm:ss"),
          create_user_info: {
            'name': '(系統自動填寫)'
          },
          assigned_group_name: '(系統自動填寫)',
          sort: ''
        };
        this.feedback.extend.push(item);
      },
      // 排序上移
      extendSortUp(index) {
        let extend = this.feedback.extend;
        if(index> 0) { // 不是第一個的可以上移
          extend = baseUtil.arrayChangeItem(extend,index,index-1);
        }
      },
      // 排序下移
      extendSortDown(index) {
        let extend = this.feedback.extend;
        if(index < extend.length-1) { // 不是最後一個的可以下移
          extend = baseUtil.arrayChangeItem(extend,index,index+1);
        }
      },
      // 刪除條目
      extendItemDelete(index) {
        const self = this;
        this.$confirm('請注意此操作無法恢復，是否繼續?', '確認刪除操作', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          self.feedback.extend.splice(index,1);
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
       * 添加備註 (for create only)
       */
      addFeedbackContentItem() {
        let item ={
          content: '',
          category: ''
        };
        this.feedback.contentList.push(item);
      },
      // 排序上移
      feedbackContentItemSortUp(index) {
        let contentList = this.feedback.contentList;
        if(index> 0) { // 不是第一個的可以上移
          contentList = baseUtil.arrayChangeItem(contentList,index,index-1);
        }
      },
      // 排序下移
      feedbackContentItemSortDown(index) {
        let contentList = this.feedback.contentList;
        if(index < extend.length-1) { // 不是最後一個的可以下移
          contentList = baseUtil.arrayChangeItem(contentList,index,index+1);
        }
      },
      // 刪除條目
      feedbackContentItemDelete(index) {
        const self = this;
        this.$confirm('請注意此操作無法恢復，是否繼續?', '確認刪除操作', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          self.feedback.contentList.splice(index,1);
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

      // 提交
      onSubmit() {
        // this.getUeditorContent(); //獲取富文本編輯器內容
        const self = this;
        // 驗證擴展組件的規則
        let remarkValid = true;

        if (this.VIEW_REMARK && this.id) {
          this.feedback.extend.forEach(function(item,index){
            remarkValid = remarkValid && self.$refs.remark[index].validateForm();
          });
        }

        this.$refs.feedback.validate((valid)=>{
          if(valid && remarkValid) {
            this.submitLoading = true;
            this.extendSubmitFormat(this.feedback.extend); // 給extend添加sort字段值
            let data = {
              feedback:{
                channel_id: this.feedback.channel_id,
                club_id: this.feedback.club_id,
                project_id: this.feedback.project_id,
                project_address: this.feedback.project_address,
                username: this.feedback.username,
                nationcode: this.feedback.nationcode,
                phone: this.feedback.phone,
                email: this.feedback.email,
                category: this.feedback.category,
                content: this.feedback.content,
                contact_person: this.feedback.contact_person,
                assigned_group_id: this.feedback.assigned_group_id,
                status: this.feedback.status,
                enquiry_date: this.feedback.enquiry_date
              },
              feedbackExtend: (this.VIEW_REMARK ? this.feedback.extend || [] : []),
              feedbackContent: this.feedback.contentList || []
            };
            if(this.id) { // 編輯狀態，
              data.feedback.id =  this.id;
            }
            save(data).then(function() {
              self.$message({
                type: 'success',
                message: '提交成功!'
              });
              self.$router.push('/feedback/list');
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

      unitSearch (queryString, cb) {
        var units = this.projectUnitList;
        var results = this.feedback.project_id != "" ? units.filter(this.createUnitFilter(queryString)) : [];
        cb(results);
      },

      createUnitFilter(queryString) {
        return (units) => {
          return (units.value.toLowerCase().includes(queryString.toLowerCase()) && units.property_id == this.feedback.project_id)
          return (units.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0 && units.property_id == this.feedback.project_id);
        };
      },

      // 初始化页面默认数据
      setDefault() {
        this.codeList = baseVanke.elFormatCodeArray(this.defaultArray.phone_code,'nationcode','name_e','nationcode');
      },

      disabledDate(date) {
        return date.getTime() > Date.now();
      },
    }
  }
</script>

<style scoped>

  .add-extend {
    width: 50px;
    height:50px;
    line-height: 50px;
  }

  .feedback-container {
    width: 100%;
  }

  .feedback-container-item {
    width: 48%;
    display: inline-block;
    vertical-align: top;
  }
</style>



// WEBPACK FOOTER //
// src/components/feedback/feedbackNew.vue