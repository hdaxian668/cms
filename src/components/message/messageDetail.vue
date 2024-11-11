<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/message/list' }">消息管理</el-breadcrumb-item>
        <el-breadcrumb-item>消息詳情</el-breadcrumb-item>
      </el-breadcrumb>
    </section>

    <el-form ref="message"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="message"
             :rules="rules"
             label-position="left" label-width="150px">
      <el-form-item label="標題" prop="title_c">
        <el-input v-model="message.title_c"
                  placeholder="請輸入中文標題"
                  :disabled="disable" maxlength="50"
                  id="title-c"></el-input>
      </el-form-item>
      <el-form-item prop="title_e">
        <el-input v-model="message.title_e"
                  :disabled="disable"
                  placeholder="請輸入英文標題" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="消息類型" prop="msg_type">
        <el-select v-model="message.msg_type"
                   placeholder="請選擇消息類型"
                   :disabled="disable"
                   @change="handleTypeChange">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="message.msg_type === 'sales' || message.msg_type === 'other'"
                      label="網址" prop="jump_url">
        <el-input v-model="message.jump_url"
                  :disabled="disable"
                  placeholder="請輸入網址"></el-input>
      </el-form-item>
      <!-- <el-form-item label="選擇活動" prop="jump_id" v-if="message.msg_type === 'activity'">
        <el-select v-model="message.jump_id"
                   placeholder="請選擇活動"
                   :disabled="disable">
          <el-option
            v-for="item in activityList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="選擇折扣" prop="jump_id" v-if="message.msg_type === 'discounted'">
        <el-select v-model="message.jump_id"
                   placeholder="請選擇折扣"
                   :disabled="disable">
          <el-option
            v-for="item in discountedList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="發送目標" prop="send_type">
        <el-radio-group v-model="message.send_type"
                        :disabled="disable"
                        @change="handleSendTypeChange">
          <el-radio-button v-for="item in sendTypeList"  :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="level"
        v-if="message.send_type && message.send_type !== 'all'">
        <el-row>選擇會籍</el-row>
        <!--<el-checkbox v-model="checkAllLevel" @change="handleCheckAllChange">全选</el-checkbox>-->
        <!--<el-checkbox-group v-model="message.send_info.level"-->
                           <!--@change="handleSendInfoChange" >-->
          <!--<el-checkbox-button v-for="item in levelList"-->
                              <!--:label="item.value"-->
                              <!--size="medium">{{item.label}}-->
          <!--</el-checkbox-button>-->
        <!--</el-checkbox-group>-->
        <vk-checkbox-group
          :checkId="message.send_info.level"
          :infoList="levelList"
          :disabled="disable"
          :config="{width: '80px',height: 'auto'}"
          @change="handleSendInfoChange">
        </vk-checkbox-group>
      </el-form-item>
      <el-form-item  prop="project"
                     v-if="message.send_type && message.send_type !== 'all'">
        <el-row>選擇項目</el-row>
        <vk-checkbox-group
          :checkId="message.send_info.project"
          :infoList="projectList"
          :disabled="disable"
          @change="handleSendInfoChange">
        </vk-checkbox-group>
      </el-form-item>
      <el-form-item label="發送時間" prop="date_type">
        <el-radio-group v-model="message.date_type"
                        :disabled="disable"
                        @change="handleDateTypeChange">
          <el-radio-button v-for="item in dateTypeList"
                           :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="send_date" v-if="message.date_type && message.date_type !== 'promptly'">
        <el-date-picker type="datetime" placeholder="選擇發送時間"
                        v-model="message.send_date"
                        :disabled="disable"
                        default-time="8:00:00"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="消息內容" prop="content_c">
        <el-input type="textarea"
                  :rows="5"
                  placeholder="請輸入中文內容"
                  :disabled="disable"
                  maxlength="100"
                  v-model="message.content_c"
                  id="content-c"></el-input>
      </el-form-item>
      <el-form-item prop="content_e">
        <el-input type="textarea"
                  :rows="5"
                  placeholder="請輸入英文內容"
                  :disabled="disable"
                  maxlength="100"
                  v-model="message.content_e"></el-input>
      </el-form-item>

      <div id="message-preview-holder">
          <div id="message-preview1-content" class="message-preview1-content-m">
              <div id="m-message-preview1-title"></div>
              <div id="m-message-preview1-content"></div>
          </div>
          <div id="message-preview2-content" class="message-preview2-content-m">
              <div id="m-message-preview2-title"></div>
              <div id="m-message-preview2-content"></div>
          </div>
      </div>

      <el-form-item label="是否彈出" prop="is_popup">
        <el-radio-group v-model="message.is_popup">
          <el-radio-button :disabled="disable" :label="1">彈出</el-radio-button>
          <el-radio-button :disabled="disable" :label="0">不彈出</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="(CREATE && !id) || (EDIT && id)">
        <el-button type="primary" :loading="submitLoading" @click="onSubmit" :disabled="disable">提交</el-button>
        <el-button id="message-preview-button" type="primary" :disabled="disable">預視App版</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    levelData,
    projectData,
    edit,save } from '@/api/message/messageDetail';
  import { baseVanke, baseUtil } from '@/util/index';
  import VkCheckboxGroup from '../common/VkCheckboxGroup/VkCheckboxGroup'

  export default {
    name: "messageDetail",
    components:{
      VkCheckboxGroup,
    },
    data() {
      const checkSendInfo = (rule, value, callback) => {
        if(value) {
          if (value === 'all') {// this.message.send_type
            callback();
          } else {
            if(this.message.send_info.level.length === 0 && this.message.send_info.project.length === 0) {
              callback(new Error('請選擇至少選擇一個指定條件'));
            } else {
              callback();
            }
          }
        } else {
          callback(new Error('請選擇發送目標'));
        }
      };
      return {
        id: '',
        loading: false,
        submitLoading: false,
        rules: {
          title_c: [
            { required: true, message: '請輸入中文標題', trigger: 'blur' }
          ],
          title_e: [
            { required: true, message: '請輸入英文標題', trigger: 'blur' }
          ],
          msg_type: [
            { required: true, message: '請選擇消息類型', trigger: 'change'},
          ],
          // jump_id: [
          //   { required: true, message: '請選擇项目', trigger: 'change'},
          // ],
          send_type: [
            { required: true, message: '請選擇發送目標', trigger: 'change'},
            { validator: checkSendInfo, trigger: 'change' },
          ],
          date_type: [
            { required: true, message: '請選擇發送時間', trigger: 'change'},
          ],
          send_date: [
            { required: true, message: '請選擇發送時間', trigger: 'change' }
          ],
          content_c:[
            { required: true, message: '請輸入消息內容', trigger: 'blur' }
          ],
          content_e:[
            { required: true, message: '請輸入消息內容', trigger: 'blur' }
          ],
        },

        typeList: [], // 消息类型列表
        sendTypeList: [], // 发送目标类型列表
        levelList: [], // 会籍列表
        checkAllLevel: false, // 会籍全选
        dateTypeList: [ ], // 是否立即发送
        projectList: [], //项目列表
        // activityList: [], // 活动列表
        // discountedList: [], // 折扣列表

        VIEW: false,
        CREATE: false,
        EDIT: false,
        DELETE: false,
        EXPORT: false,
        message: {
          id: '',	// 新增时为空，编辑保存时必须存在
          msg_type: '',	// 消息类别分类
          // jump_id:'', // 跳转ID
          jump_url:'https://',
          title_c:'', //	标题中文
          title_e:'', //	标题英文
          send_type:'', //	发送目标类型
          send_info:{
            level:[], // 所选会籍
            project:[], // 项目信息
          }, // 发送目标

          date_type: '', // 是否立即发送
          send_date: '', // 发送时间
          content_c:'', //	消息内容（中文）
          content_e:'', //	消息内容（英文）
          is_popup: '1', // 0否，1是
          status: '', // 消息是否已發送,0未发送，1已发送
        },
      }
    },
    computed: {
      disable() {
        return this.message.status === '1'; // 已发送则不可编辑
      }
    },
    activated() {
      this.getItemDetail();
    },
    deactivated() {
      this.initDetail();
    },
    methods: {
      /*
       * 初始化页面数据
       * */
      initDetail() {
        this.id = '';
        this.typeList = []; // 消息类型列表
        this.sendTypeList = []; // 发送目标类型列表
        this.levelList = []; // 会籍列表
        this.checkAllLevel = false; // 会籍全选
        this.dateTypeList = []; // 是否立即发送
        this.projectList = []; //项目列表
        // this.activityList = []; // 活动列表
        // this.discountedList = []; // 折扣列表
        this.message = {
          id: '',	// 新增时为空，编辑保存时必须存在
          msg_type: '',	// 消息类别分类
          // jump_id:'',
          jump_url:'https://',
          title_c:'', //	标题中文
          title_e:'', //	标题英文
          send_type:'', //	发送目标类型
          send_info:{
            level:[], // 所选会籍
            project:[], // 项目信息
          }, // 发送目标
          date_type: '', // 是否立即发送
          send_date: '', // 发送时间
          content_c:'', //	消息内容（中文）
          content_e:'', //	消息内容（英文）
          is_popup:'1',
        };
        this.$refs.message.resetFields(); // 表单进行重置
      },
      /*
      * 获取当前页面的详细信息
      * */
      getItemDetail() {
        this.loading = true;
        let self = this;
        this.id = this.$route.query.id;
        let reqData = {
          id: this.id
        };
        edit(reqData).then(function(response){
          if (!response.data.VIEW) {
            self.$message.error('沒有權限！');
            self.$router.push('/message/list');
            return;
          }
          self.VIEW = response.data.VIEW;
					self.CREATE = response.data.CREATE;
					self.EDIT = response.data.EDIT;
					self.DELETE = response.data.DELETE;
					self.EXPORT = response.data.EXPORT;
          self.typeList = baseVanke.elFormatArray(response.data.search.type);
          // self.activityList = baseVanke.elFormatArray(response.data.search.activity,'id','title_c');
          // self.discountedList = baseVanke.elFormatArray(response.data.search.discounted,'id','title_c');
          self.sendTypeList = baseVanke.elFormatArray(response.data.search.send_type);
          // self.levelList = baseVanke.elFormatArray(response.data.search.level,'id','name');
          self.levelList = baseVanke.vkFormatCheckList(response.data.search.level,'name');
          self.projectList = baseVanke.vkFormatCheckList(response.data.search.project,'name_c','address_c');
          self.dateTypeList = baseVanke.elFormatArray(response.data.search.date_type);

          if(self.id) {
            self.message = response.data.messageInfo;
          } else {
            self.message.status = "0"; // 新建则未发送
          }
        }).catch(function(error) {
          self.$message.error(error.message);
        }).finally(function() {
          self.loading = false;
        });
      },
      /**
       * 切换消息类型时，清空jump_id;
       */
      handleTypeChange() {
        this.message.jump_id = '';
        this.message.jump_url = 'https://';
      },
      /**
       * 更改指定选项时，触发规则判断
       */
      handleSendInfoChange() {
        this.$refs.message.validateField('send_type');
      },
      /**
       * 切换发送目标时清空level/project
       */
      handleSendTypeChange() {
        this.message.send_info.level = [];
        this.message.send_info.project = [];
      },
      /**
       * 切换发送时间时，清空send_date;
       */
      handleDateTypeChange() {
        this.message.send_date = '';
      },

      /**
       * 提交保存数据
       */
      onSubmit() {
        const self = this;
        this.$refs.message.validate((valid)=>{
          if(valid) {
            this.submitLoading = true;
            let data = {
              // id: this.message.id,	// 新增时为空，编辑保存时必须存在
              msg_type: this.message.msg_type,	// 消息类别分类
              // jump_id: this.message.jump_id,
              jump_url: this.message.jump_url,
              title_c: this.message.title_c, //	标题中文
              title_e: this.message.title_e, //	标题英文
              send_type: this.message.send_type, //	发送目标类型
              send_info: JSON.stringify(this.message.send_info),
              date_type: this.message.date_type,// 是否立即发送
              content_c: this.message.content_c, //	消息内容（中文）
              content_e: this.message.content_e, //	消息内容（英文）
              is_popup: this.message.is_popup,
            };
            if(this.id) {
              data.id =  this.id;
            }
            if(this.message.date_type !=='promptly') {
              data.send_date=this.message.send_date;// 发送时间
            }
            save(data).then(function() {
              self.$message({
                message: '提交成功',
                type: 'success'
              });
              self.$router.push('/message/list');
            }).catch(function(error) {
              self.$message.error(error.message);
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
</style>

<style scoped>
    /* vietnamese */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 100;
      font-display: swap;
      src: local('Barlow Thin'), local('Barlow-Thin'), url(https://fonts.gstatic.com/s/barlow/v4/7cHrv4kjgoGqM7E3b_s0wH8RnA.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
    }
    /* latin-ext */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 100;
      font-display: swap;
      src: local('Barlow Thin'), local('Barlow-Thin'), url(https://fonts.gstatic.com/s/barlow/v4/7cHrv4kjgoGqM7E3b_s1wH8RnA.woff2) format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 100;
      font-display: swap;
      src: local('Barlow Thin'), local('Barlow-Thin'), url(https://fonts.gstatic.com/s/barlow/v4/7cHrv4kjgoGqM7E3b_s7wH8.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    /* vietnamese */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 300;
      font-display: swap;
      src: local('Barlow Light'), local('Barlow-Light'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3p-ks6FospT4.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
    }
    /* latin-ext */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 300;
      font-display: swap;
      src: local('Barlow Light'), local('Barlow-Light'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3p-ks6VospT4.woff2) format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 300;
      font-display: swap;
      src: local('Barlow Light'), local('Barlow-Light'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3p-ks51os.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    /* vietnamese */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('Barlow Regular'), local('Barlow-Regular'), url(https://fonts.gstatic.com/s/barlow/v4/7cHpv4kjgoGqM7E_A8s52Hs.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
    }
    /* latin-ext */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('Barlow Regular'), local('Barlow-Regular'), url(https://fonts.gstatic.com/s/barlow/v4/7cHpv4kjgoGqM7E_Ass52Hs.woff2) format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('Barlow Regular'), local('Barlow-Regular'), url(https://fonts.gstatic.com/s/barlow/v4/7cHpv4kjgoGqM7E_DMs5.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    /* vietnamese */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: local('Barlow Medium'), local('Barlow-Medium'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3_-gs6FospT4.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
    }
    /* latin-ext */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: local('Barlow Medium'), local('Barlow-Medium'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3_-gs6VospT4.woff2) format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: local('Barlow Medium'), local('Barlow-Medium'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3_-gs51os.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    /* vietnamese */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: local('Barlow Bold'), local('Barlow-Bold'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3t-4s6FospT4.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
    }
    /* latin-ext */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: local('Barlow Bold'), local('Barlow-Bold'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3t-4s6VospT4.woff2) format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: local('Barlow Bold'), local('Barlow-Bold'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3t-4s51os.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    #message-preview-holder {
        position: fixed;
        content: "";
        display: none;
        overflow: hidden;
        width: 100%;
        height: 100%;
        z-index: 1000;
        top: 0;
        left: 0;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.5);
    }
    div#message-preview-holder:after {
        content: "";
        display: inline-block;
        overflow: hidden;
        height: 100%;
        vertical-align: middle;
        width: 1px;
    }
    #message-preview-holder .message-preview1-content-m {
        background: url(../../../static/images/message_bg.png) no-repeat center;
        background-size: contain;
        display: inline-block;
        overflow: hidden;
        width: 400px;
        height: 600px;
        background-color: #FFF;
        vertical-align: middle;
        margin: 0 28px;
        overflow-x: hidden;
        overflow-y: hidden;
    }
    #message-preview-holder #m-message-preview1-title {
        overflow: hidden;
        text-align: left;
        color: #004830;
        font-weight: bold;
        font-size: 14px;
        margin-top: 250px;
        margin-left: 20px;
        margin-right: 20px;
    }
    #message-preview-holder #m-message-preview1-content {
        overflow: hidden;
        text-align: left;
        color: #004830;
        font-size: 14px;
        margin-left: 20px;
        margin-right: 20px;
    }
    #message-preview-holder .message-preview2-content-m {
        background: url(../../../static/images/notification_center_bg.png) no-repeat center;
        background-size: contain;
        display: inline-block;
        overflow: hidden;
        width: 400px;
        height: 600px;
        background-color: #FFF;
        vertical-align: middle;
        margin: 0 28px;
        overflow-x: hidden;
        overflow-y: hidden;
    }
    #message-preview-holder #m-message-preview2-title {
        overflow: hidden;
        text-align: left;
        color: #333333;
        font-weight: bold;
        font-size: 12px;
        margin-top: 125px;
        margin-left: 38px;
        margin-right: 38px;
    }
    #message-preview-holder #m-message-preview2-content {
        overflow: hidden;
        text-align: left;
        color: #333333;
        font-size: 12px;
        margin-left: 38px;
        margin-right: 38px;
    }

</style>


// WEBPACK FOOTER //
// src/components/message/messageDetail.vue