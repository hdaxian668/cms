import {
  selectLists,
  registrationData,
  status,
  amends,
  attend,
  enrolMax,
  attendNumber,
} from '@/api/activity/registration';
import { baseVanke } from '@/util/index';
export default {
  name: "registrationManagement",
  data() {
    return {
      timer: null,
      // begin: new Date(),
      isAble: true,
      _csrf: window._csrf,

      activity_id: '', // 活动ID
      activity_name: '', // 活动名称

      keyword: '', // 搜索关键字
      begin_date: '',
      end_date: '',
      status: '', // 状态
      enrolMaxValue:'',
      statusList: [],
      valueStatusList: [], // 可选的状态
      is_amends: '', // 是否后补
      batch_amends: '', // 是否后补
      check2:[],
      amendsList: [], // 后补状态列表
      attendList: [], // 出席状态列表
      attributesList: [], // 活动时间段
      attributes: '', // 活动时间段

      length: 10, // 每页数量
      listLength: 0, // 全部条数
      currentPage: 0, // 当前页
      loading: false,
      userlimit: 0,
      attend_number: 0,

      VIEW: false,
      CREATE: false,
      EDIT: false,
      DELETE: false,
      EXPORT: false,
      registrationList: [
        // {
        //   activity_id: "39e5f4c5-44f6-834c-be0b-a09f1fd922c5",
        //   attend_date: "2018-05-04 15:33:43",
        //   customer_id: "39e636df-e945-2e79-5f31-2279f417bb38",
        //   email: "770252080@qq.com",
        //   id: "39e63c3e-f794-8f0e-bade-2211fdf00325",
        //   name_c: "田亮",
        //   status: "0",
        //   title_c: "测试1",
        // }
      ],
    }
  },
  activated() {
    this.activity_id = this.$route.params.id; // 活动ID
    this.activity_name = this.$route.params.name;// 活动名称
    if(!this.activity_id) {
      this.$router.push({
        path: '/activity/list',
      })
    }
    this.loading = true;
    // 請求选择菜单
    /*enrolMax(this.activity_id).then((response) =>{
      this.enrolMaxValue = response.data.val;
      alert(enrolMaxValue);
    }).catch((error) => {
      this.loading = false;
      this.$message.error(error.message);
    });*/

    selectLists(this.activity_id).then((response) =>{
      this.statusList = baseVanke.elFormatArray(response.data.status);
      this.valueStatusList = this.valueList(this.statusList);
      this.amendsList = baseVanke.elFormatArray(response.data.is_amends);
      this.valueAmendsList = this.valueList(this.amendsList);
      this.attendList = baseVanke.elFormatArray(response.data.is_attend);
      this.valueAttendList = this.valueList(this.attendList);
      this.attributesList = response.data.attributes;
      this.enrolMaxValue = response.data.enrolMax;
      console.log(this.attributesList);
      this.getListData();
    }).catch((error) => {
      this.loading = false;
      this.$message.error(error.message);
    });

  },
  deactivated() {
    this.activity_id = '';// 活动ID
    this.activity_name = ''; // 活动名称

    this.enrolMaxValue ='';
    this.keyword = '';// 搜索关键字
    this.begin_date = '';
    this.end_date = '';
    this.status= '';// 状态
    this.is_amends= '';// 是否后补
    this.is_attend='';//是否出席

    this.length= 10;// 每页数量
    this.listLength = 0;// 全部条数
    this.currentPage = 0; // 当前页
    this.attend_number = 0;
    this.userlimit = 0;
  },
  methods: {
    /* 获取列表数据 */
    getListData() {
      this.isAble= true,
      this.loading = true;
      let resData = {
        activity_id: this.activity_id,
        start: (this.currentPage-1)*this.length, // 数据开始位置
        length: this.length, // 每页显示数量
        begin_date: this.begin_date, // 活动开始时间
        end_date: this.end_date,
        status: this.status,
        is_amends: this.is_amends,
        is_attend: this.is_attend,
        //batch_amends : this.batch_amends,
        attend_number: this.attend_number,
        attribute_id: this.attributes,
        keyword: this.keyword, // 搜索关键字
        enrolMaxValue: this.enrolMaxValue,
      };
      registrationData(resData).then((response) => {
          if (!response.data.VIEW) {
            this.$message.error('沒有權限！');
            this.$router.push('/activity/list');
            return;
          }
          this.VIEW = response.data.VIEW;
          this.CREATE = response.data.CREATE;
          this.EDIT = response.data.EDIT;
          this.DELETE = response.data.DELETE;
          this.EXPORT = response.data.EXPORT;
          this.listLength = parseInt(response.data.count); // 全部条目数
          this.attend_number = parseInt(response.data.attend_number); 
          this.userlimit = parseInt(response.data.userlimit); 
          if(this.userlimit==0){
            this.userlimit ='不限';
          }
          response.data.list.forEach((item)=> {
            item.attributes = item.start_date + '至' + item.end_date;
          });
          this.registrationList = response.data.list;
          console.log(this.registrationList);
        }).catch((error) => {
        this.$message.error(error.message);
      }).finally(() =>{
        this.loading = false;
      });
    },
    /**
     * 将statusList中value='' 的项去掉
     * @param statusList
     * @returns {Array}
     */
    valueList(statusList) {
      let valueList = [];
      statusList.forEach(function(item) {
        if(item.value) {
          valueList.push(item);
        }
      });
      return valueList;
    },
    // 获取导出列表
    exportRegList() {
      const url = '/activity-attend/export?activity_id=' + this.activity_id
        + '&begin_date=' + this.begin_date
        + '&end_date=' + this.end_date
        + '&status=' + this.status
        + '&is_amends='+ this.is_amends
        + '&keyword=' + this.keyword
        + '&attribute_id='+ this.attributes;
      console.log(url);
      window.open(url);
    },
    // 选择框内容变化
    handleChange() {
      this.currentPage = 1; // 从第一页开始
      this.getListData();
    },
    // 输入框内容变化
    handleInputChange() {
      this.currentPage = 1; // 从第一页开始
      clearTimeout(this.timer);
      let self = this;
      this.timer = setTimeout(function() {
        self.getListData();
      },200);
    },
    // 点击翻页、页码
    handlePageChange() {
      this.getListData();
    },
    /**
     * 列表项状态改变
     * @param row
     */
    handleStatusChange(row) {
      const self = this;
      status(row.id,row.status).then(function(){
        self.$message({
          type: 'success',
          message: '狀態修改成功！'
        });
      }).catch( function(error) {
        self.$message.error(error.message);
        // self.$message.error('狀態修改失敗，請重試！');
      }).finally(function() {
        self.getListData(); // 成不成功都要刷新页面
      });
    },
    /**
     * 列表项状态改变
     * @param row
     */
    handleAttendChange(row) {
      const self = this;
      attend(row.id,row.is_attend).then(function(){
        self.$message({
          type: 'success',
          message: '出席狀態修改成功！'
        });
      }).catch( function(error) {
        self.$message.error(error.message);
        // self.$message.error('狀態修改失敗，請重試！');
      }).finally(function() {
        self.getListData(); // 成不成功都要刷新页面
      });
    },
    /**
     * 列表项侯補状态改变
     * @param row
     */
    async handleAmendsChange(row) {
      try {
          if(row.is_amends =='1' || row.is_amends =='0'){
            let req = await this.$confirm('此操作將向用戶郵箱發送郵件，確定更改?', '警告', {
              confirmButtonText: '確定',
              cancelButtonText: '取消',
              type: 'warning'
            });
          }
            const self = this;
            this.loading = true;
            amends(row.id,row.is_amends).then(function(){
              self.$message({
                type: 'success',
                message: '狀態修改成功！'
              });
            }).catch( function(error) {
              self.$message.error(error.message);
              // self.$message.error('狀態修改失敗，請重試！');
            }).finally(function() {
              self.getListData(); // 成不成功都要刷新页面
            });
      } catch(e) {
          if(e === 'cancel') {
            this.getListData();
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
    /**
     * 列表项侯補状态改变
     * @param row
     */
    handleAttendNumberChange(row) {
      const self = this;
      this.loading = true;
      attendNumber(row.id,row.attend_number).then(function(){
        self.$message({
          type: 'success',
          message: '報名人數修改成功！'
        });
      }).catch( function(error) {
        self.$message.error(error.message);
        // self.$message.error('狀態修改失敗，請重試！');
      }).finally(function() {
        self.getListData(); // 成不成功都要刷新页面
      });
    },

    async batchAmends(batch_amends){
      const self = this;
      let arr = this.check2;
      for(const item of arr){
        //const res = await (item.id);
        //console.log(res);
        if(item.is_amends != batch_amends){
          await amends(item.id,batch_amends);
        }
      }
      console.log('end');
      /*this.check2.forEach(function(item) {
        if(item.is_amends != batch_amends){
          amends(item.id,batch_amends);
        }
      });*/
    },

    async handleBatchAmendsChange() {

      var batch_amends = this.batch_amends;
      try {
          if(batch_amends =='1' || batch_amends =='0'){
              await this.$confirm('此操作將向用戶郵箱發送郵件，如果狀態沒有更改不會重覆發送，確定更改?', '警告', {
              confirmButtonText: '確定',
              cancelButtonText: '取消',
              type: 'warning'
            });
          }
            const self = this;
            this.loading = true;
            await this.batchAmends(batch_amends);
            this.loading = false;
            /*await this.check2.forEach(function(item) {
              if(item.is_amends != batch_amends){
                amends(item.id,batch_amends);
              }
            });*/

            this.$message({
              type: 'success',
              message: '批量狀態修改成功！'
            });

            this.getListData();
            this.batch_amends='';
      } catch(e) {
          if(e === 'cancel') {
            this.batch_amends='';
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


    async batchAttend(batch_attend){
      const self = this;
      let arr = this.check2;
      for(const item of arr){
        //const res = await (item.id);
        //console.log(res);
        if(item.is_attend != batch_attend){
          await attend(item.id,batch_attend);
        }
      }
      console.log('end');
      /*this.check2.forEach(function(item) {
        if(item.is_amends != batch_amends){
          amends(item.id,batch_amends);
        }
      });*/
    },

    async handleBatchAttendChange() {

      var batch_attend = this.batch_attend;
      try {

            const self = this;
            this.loading = true;
            await this.batchAttend(batch_attend);
            this.loading = false;

            this.$message({
              type: 'success',
              message: '批量出席狀態修改成功！'
            });

            this.getListData();
            this.batch_attend='';
      } catch(e) {
          if(e === 'cancel') {
            this.batch_attend='';
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


    selectAll (selection) {
      const self = this;
      
      if(selection.length >0){
        this.isAble = false;
        this.check2 = selection;
      }else{
        this.isAble = true;
        this.check2 = selection;
      }
    },
    selectionChange(selection) {
      const self = this;

      if(selection.length >0){
        this.isAble = false;
        this.check2 = selection;
      }else{
        this.isAble = true;
        this.check2 = selection;
      }
      
      
    },
  }
}



// WEBPACK FOOTER //
// ./src/components/activity/registration/script.js