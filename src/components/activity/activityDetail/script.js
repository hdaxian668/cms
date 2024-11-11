import { edit,save, deleteAttributeItem } from '@/api/activity/activityDetail';
import { baseVanke, baseUtil } from '@/util/index';
import SingleImgUpload from "@/components/common/SingleImgUpload/SingleImgUpload";
import ImgCardsUpload from "@/components/common/ImgCardsUpload/ImgCardsUpload";
import VideoUpload from "@/components/common/VideoUpload/VideoUpload";
import UEditor from '@/components/common/UEditor';
import VideoCard from "@/components/common/VideoListUploadWithCover/VideoCardWithCover"
import activityExtend from "./activityExtend"
const FR = FormRules.required;

export default {
  name: "activityDetail",
  components:{
    SingleImgUpload,
    ImgCardsUpload,
    VideoUpload,
    UEditor,
    VideoCard,
    activityExtend,
  },
  data() {
    const checkEnrolMax = (rule,value,callback) => {
      if(this.activity.userlimit != 0 && parseInt(value) > parseInt(this.activity.userlimit)) {
        callback(new Error('每人限報名額不能超過總人數'));
      } else {
          callback();
      }
    };
    /**
     * 时间段规则
     * @param rule
     * @param value
     * @param callback
     */
    const checkActivityExtend = (rule, value, callback) => {
      if(value === []) {
        callback(new Error('請添加活動時間段數據'));
      } else if(this.activity.userlimit === '0') {
          callback();
        } else {
          let extendTotal = 0;
          value.forEach((item)=> {
            extendTotal += parseInt(item.total);
          })
          if(extendTotal > parseInt(this.activity.userlimit)) {
            callback(new Error('活動時間段報名人數超過總人數限制'));
          } else {
            callback();
          }
        }
    };
    /**
     * 活动结束时间规则
     * @param rule
     * @param value
     * @param callback
     */
    const checkActivityEndDate = (rule, value, callback) => {
      if(value === '') {
        callback(new Error('請選擇日期'));
      } else {
        if(value < this.activity.activity_begin_date) {
          callback(new Error('結束日期應大於開始日期'));
        } else {
          callback();
        }
      }
    };
    /**
     * 报名时间规则
     * @param rule
     * @param value
     * @param callback
     */
    const checkAttendEndDate = (rule, value, callback) => {
      if(value === '') {
        callback(new Error('請選擇日期'));
      } else {
        if(value < this.activity.attend_begin_date) {
          callback(new Error('結束日期應大於開始日期'));
        } else {
          callback();
        }
      }
    };

    return {
      id: '',
      uploadAction: '/upload/handle?action=uploadimage',
      loading: false,
      submitLoading: false,
      category: '',
      rules: {
        category: [
          { required: true, message: '請選擇活動區域', trigger: 'change'},
        ],
        userlimit: [
          { required: true, message: '請輸入限制人數',trigger: 'blur'},
          FormRules.onlyNumber(),
        ],
        enrol_max: [
          { required: true, message: '請輸入每人限報名額',trigger: 'blur'},
          FormRules.onlyPositive(),
          { validator: checkEnrolMax, trigger: 'blur'},
        ],
        activity_begin_date: [
          {required: true, message: '請選擇日期', trigger: 'change' }
        ],
        activity_end_date: [
          { required: true, message: '請選擇日期', trigger: 'change' },
          { validator: checkActivityEndDate, trigger: 'change'},
        ],
        activityExtendShow: [
          { required: true, message: '請添加活動時間段數據', trigger: 'change'},
          { validator: checkActivityExtend, trigger: 'change' },
        ],
        attend_begin_date: [
          {required: true, message: '請選擇日期', trigger: 'change' }
        ],
        attend_end_date: [
          {required: true, message: '請選擇日期', trigger: 'change' },
          { validator: checkAttendEndDate, trigger: 'change'},
        ],
        levels: [
          {required: true, message: '請選擇會籍', trigger: 'change'}
        ],
        cover_c:[
          { required: true, message: '請添加封面圖片（中）', trigger: 'change' }
        ],
        cover_e:[
          { required: true, message: '請添加封面圖片（英）', trigger: 'change' }
        ],
        images:[
          { required: true, message: '請添加活動圖片', trigger: 'change' }
        ],
        title_c: [
          { required: true, message: '請輸入活動標題', trigger: 'blur' }
        ],
        title_e: [
          { required: true, message: '請輸入活動標題（英）', trigger: 'blur' }
        ],
        place_c: [
          { required: true, message: '請輸入活動地點', trigger: 'blur' }
        ],
        place_e:  [
          { required: true, message: '請輸入活動地點（英）', trigger: 'blur' }
        ],
        alert_c: [
          { required: true, message: '請輸入提示內容', trigger: 'blur' }
        ],
        alert_e:  [
          { required: true, message: '請輸入提示內容（英）', trigger: 'blur' }
        ],
        content_c:[
          { required: true, message: '請輸入活動內容', trigger: 'blur' }
        ],
        content_e:[
          { required: true, message: '請輸入活動內容（英）', trigger: 'blur' }
        ],
        clause_c:[
          { required: true, message: '請輸入活動條款', trigger: 'blur' }
        ],
        clause_e:[
          { required: true, message: '請輸入活動條款（英）', trigger: 'blur' }
        ],
        email_c:[
          { required: true, message: '請輸入電郵範例(常規名單)', trigger: 'blur' }
        ],
        /*email_e:[
          { required: true, message: '請輸入電郵範例(常規名單)（英）', trigger: 'blur' }
        ],*/
        email_waiting_c:[
          { required: true, message: '請輸入電郵範例(後補名單)', trigger: 'blur' }
        ],
        /*email_waiting_e:[
          { required: true, message: '請輸入電郵範例(後補名單)（英）', trigger: 'blur' }
        ],*/
      },
      categoryList: [],
      visibleList: [],
      windowTypeList: [], // 是否在首页展示
      levelList: [],

      VIEW: false,
      CREATE: false,
      EDIT: false,
      DELETE: false,
      EXPORT: false,
      activity: {
        id: '',	// 新增时为空，编辑保存时必须存在
        category: '',	// 活动分类
        title_c:'', //	标题中文
        title_e:'', //	标题英文
        place_c:'', //	活动地点（中文）
        place_e: '', //	活动地点（英文）
        alert_c:'', //  提示內容（中文）
        alert_e: '', // 提示內容（英文）
        activity_begin_date:'' ,//	活动开始时间
        activity_end_date:'', //	活动结束时间
        activityExtend: [], // 活動時間段
        activityExtendShow: [], // 活動時間段显示数据
        attend_begin_date:'', //	报名开始时间
        attend_end_date:'', //	报名截止时间
        levels: [],
        cover_c:'', //	封面图片
        cover_e:'', //	封面图片英
        images:[], //	活动图片
        video:[], //	影片介绍
        userlimit:'', //	限制人数
        enrol_max: 0, // 每人限报名额
        content_c:'', //	活动内容（中文）
        content_e:'', //	活动内容（英文）
        clause_c:'', //	活动条款（中文）
        clause_e:'', //	活动条款（英文）
        email_c:'', // 電郵範例(常規名單)（中文）
        email_e:'', // 電郵範例(常規名單)（英文）
        email_waiting_c:'', // 電郵範例(後補名單)（中文）
        email_waiting_e:'', // 電郵範例(後補名單)（英文）
        visible:'', //		状态（0显示1隐藏），默认隐藏
        floating_window: '', // 是否在首页展示，（1是0否）默认否
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
    /*
     * 初始化页面数据
     * */
    initDetail() {
      this.id = '';
      this.categoryList = [];
      this.visibleList = [];
      this.windowTypeList = []; // 是否在首页展示
      this.levelList = [];
      this.activity = {
        id: '',	// 新增时为空，编辑保存时必须存在
        category: '',	// 活动分类
        title_c:'', //	标题中文
        title_e:'', //	标题英文
        place_c:'', //	活动地点（中文）
        place_e: '', //	活动地点（英文）
        alert_c:'', //  提示內容（中文）
        alert_e: '', // 提示內容（英文）
        activity_begin_date:'' ,//	活动开始时间
        activity_end_date:'', //	活动结束时间
        activityExtend: [], // 活動時間段
        activityExtendShow: [], // 活動時間段显示数据
        attend_begin_date:'', //	报名开始时间
        attend_end_date:'', //	报名截止时间
        levels: [],
        cover_c:'', //	封面图片
        cover_e:'', //	封面图片
        images:[], //	活动图片
        video:[], //	影片介绍
        userlimit:'', //	限制人数
        content_c:'', //	活动内容（中文）
        content_e:'', //	活动内容（英文）
        clause_c:'', //	活动条款（中文）
        clause_e:'', //	活动条款（英文）
        email_c:'', // 電郵範例(常規名單)（中文）
        email_e:'', // 電郵範例(常規名單)（英文）
        email_waiting_c:'', // 電郵範例(後補名單)（中文）
        email_waiting_e:'', // 電郵範例(後補名單)（英文）
        visible:'', //		状态（0显示1隐藏）
        floating_window: '', // 是否在首页展示
      };
      this.$refs.activity.resetFields();
      // this.$refs.activity.clearValidate(); // 清空规则
    },
    /*
    * 获取当前页面的详细信息
    * */
    async getItemDetail() {
      try {
        this.loading = true;
        this.id = this.$route.query.id;
        let reqData = {
          id: this.id
        };
        let response = await edit(reqData);
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
        this.categoryList = baseVanke.elFormatArray(response.data.category);
        this.visibleList = baseVanke.elFormatArray(response.data.status);
        this.windowTypeList = baseVanke.elFormatArray(response.data.float_window);
        this.levelList = baseVanke.elFormatArray(response.data.levelList);
        if(this.id) {
          this.activity = Object.assign({},this.activity,response.data.activityInfo);
          this.activity.category = parseInt(this.activity.category); // 后端传来的数据是字符串
          this.activity.activityExtendShow = this.extendFormat(this.activity.activityExtend);
        }
        this.loading = false;
      } catch(error) {
          this.loading = false;
          this.$message.error(error.message);
      }

    },
    /**
     * 生成显示时间段数据
     * @param activityExtend - 获取的时间
     * @returns {Array}
     */
    extendFormat(activityExtend) {
      if(activityExtend instanceof Array) {
        let formatArray = [];
        activityExtend.forEach((item)=>{
          formatArray.push({
            id: item.id,
            range: [item.start_date,item.end_date],
            total: item.total,
          });
        });
        return formatArray;
      }
    },
    /**
     * 生成提交时间数据
     */
    extendFormatSubmit(activityExtendShow) {
      if(activityExtendShow instanceof Array) {
        let formatArray = [];
        activityExtendShow.forEach((item)=>{
          formatArray.push({
            id: item.id,
            start_date: item.range[0],
            end_date: item.range[1],
            total: item.total,
          });
        });
        return formatArray;
      }
    },
    /**
     * 活动限制人数修改触发限报名额校验
     */
    handleUserlimitChange() {
      this.$refs.activity.validateField('enrol_max');
    },
    /*
    * 添加活动时间段
     */
    addExtendItem() {
      this.$refs.activity.validateField('activity_begin_date');
      this.$refs.activity.validateField('activity_end_date');
      this.$refs.activity.validateField('userlimit');
      if(this.activity.userlimit && this.activity.activity_begin_date && this.activity.activity_end_date && this.activity.activity_begin_date < this.activity.activity_end_date) {
          this.activity.activityExtendShow.push({
            id: '',
            range: [],
            total: '',
          }); // 活動時間段
      }
    },
    // 删除条目
    async extendItemDelete(index) {
      try {
        let resq = await this.$confirm('請注意此操作無法恢復，是否繼續?', '確認刪除', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        if(resq === 'confirm') {
          if(!!this.activity.activityExtendShow[index].id) {
            //  删除已保存过的时间段
            await deleteAttributeItem(this.activity.activityExtendShow[index].id);
          }
          this.activity.activityExtendShow.splice(index,1);
          this.$message({type: 'success', message: '刪除成功!'});
        }
      } catch(e) {
        this.$message({type: 'info', message: '已取消刪除'});
      }
    },
    /**
     * 活动开始日期改变触发规则
     */
    handleActivityBeginChange() {
      this.$refs.activity.validateField('activity_end_date');
    },
    /**
     * 报名开始日期改变触发规则
     */
    handleAttendBeginChange() {
      this.$refs.activity.validateField('attend_end_date');
    },
    /*
    * 上传图片失败
    * */
    handleImgError(err) {
      this.$message.error(err.message);
    },
    /*
    * 上传封面图片
    * */
    handleCoverImgSuccess(event,type) {
      this.activity[type] = event.url;
      this.$refs.activity.validateField(type); // 验证images是否符合规则
      this.$message({
        type: 'success',
        message: '上传成功!'
      });
    },
    /*
     * 删除封面
     */
    handleCoverImgRemove(type) {
      this.activity[type] = '';
      this.$refs.activity.validateField(type); // 验证images是否符合规则
      this.$message({
        type: 'success',
        message: '刪除成功!'
      });
    },
    /**
     * 上传图片成功，将图片信息存入数组中
     * @param res - 上传图片成功的返回值
     */
    handleImgItemSuccess(res) {
      this.activity.images.push(res.url);
      this.$refs.activity.validateField('images'); // 验证images是否符合规则
      this.$message({
        type: 'success',
        message: '上传成功!'
      });
    },
    /*
    * 删除图片
    * */
    handleImgItemRemove(index) {
      this.activity.images.splice(index,1); // 刪除這一項
      this.$refs.activity.validateField('images'); // 验证images是否符合规则
      this.$message({
        type: 'success',
        message: '刪除成功!'
      });
    },
    /**
     * 图片上移
     */
    handleImgItemSortUp(index) {
      let list = this.activity.images;
      if(index> 0) { // 不是第一个的可以上移
        list = baseUtil.arrayChangeItem(list,index,index-1);
      }
    },
    /**
     * 图片下移
     */
    handleImgItemSortDown(index) {
      let list = this.activity.images;
      if(index < list.length-1) { // 不是最后一个的可以下移
        list  = baseUtil.arrayChangeItem(list ,index,index+1);
      }
    },
    /**
     * 新增视频
     * */
    addVideoItem() {
      let item = {
        image_url: '',
        video_url: '',
      };
      this.activity.video.push(item);
    },
    /*
    * 上传视频成功
    * */
    handleVideoSuccess(res,index) {
      // this.activity.video[index].video_url = res.url;
      this.$message({
        type: 'success',
        message: '上传成功!'
      });
    },
    /*
    * 上传视频封面成功
    * */
    handleCoverSuccess(res,index) {
      // this.activity.video[index].image_url = res.url;
      this.$message({
        type: 'success',
        message: '上传成功!'
      });
    },
    // 排序上移
    videoSortUp(index) {
      let videos = this.activity.video;
      if(index> 0) { // 不是第一个的可以上移
        videos = baseUtil.arrayChangeItem(videos,index,index-1);
      }
    },
    // 排序下移
    videoSortDown(index) {
      let videos = this.activity.video;
      if(index < videos.length-1) { // 不是最后一个的可以下移
        videos = baseUtil.arrayChangeItem(videos,index,index+1);
      }
    },
    /*
     * 删除视频
     */
    handleVideoRemove(index) {
      const self = this;
      this.$confirm('請注意此操作無法恢復，是否繼續?', '確認刪除', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        self.activity.video.splice(index,1);
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
    * 获取UEditor编辑器中的内容
    * */
    getUeditorContent() {
      this.activity.content_c = this.$refs.content_c.getUEContent();
      this.activity.content_e = this.$refs.content_e.getUEContent();
      this.activity.clause_c = this.$refs.clause_c.getUEContent();
      this.activity.clause_e = this.$refs.clause_e.getUEContent();
      this.activity.email_c = this.$refs.email_c.getUEContent();
      this.activity.email_e = this.$refs.email_e.getUEContent();
      this.activity.email_waiting_c = this.$refs.email_waiting_c.getUEContent();
      this.activity.email_waiting_e = this.$refs.email_waiting_e.getUEContent();
    },
    /**
     * 提交保存数据
     */
    onSubmit() {
      this.getUeditorContent();
      const self = this;
      let videoValid = true;
      this.activity.activityExtendShow.forEach((item,index)=> {
        videoValid = videoValid && this.$refs.extend[index].validateForm();
      });
      this.activity.video && this.activity.video.length > 0 && this.activity.video.forEach((item,index)=>{
        videoValid = videoValid && this.$refs.videoItem[index].validateForm();
      });
      this.$refs.activity.validate((valid)=>{
        if(valid && videoValid) {
          this.submitLoading = true;
          this.activity.activityExtend = this.extendFormatSubmit(this.activity.activityExtendShow);
          let data = {
            // id:this.activity.id,	// 新增时为空，编辑保存时必须存在
            category: this.activity.category,	// 活动分类
            title_c: this.activity.title_c, //	标题中文
            title_e: this.activity.title_e, //	标题英文
            place_c: this.activity.place_c, //	活动地点（中文）
            place_e: this.activity.place_e, //	活动地点（英文）
            alert_c: this.activity.alert_c, //  提示內容（中文）
            alert_e: this.activity.alert_e, //  提示內容（英文）
            activity_begin_date: this.activity.activity_begin_date,//	活动开始时间
            activity_end_date: this.activity.activity_end_date, //	活动结束时间
            activityExtend: this.activity.activityExtend, // 活动时间段
            attend_begin_date: this.activity.attend_begin_date, //	报名开始时间
            attend_end_date: this.activity.attend_end_date, //	报名截止时间
            levels: JSON.stringify(this.activity.levels),
            cover_c: this.activity.cover_c, //	封面图片
            cover_e: this.activity.cover_e, //	封面图片英
            images: JSON.stringify(this.activity.images), //	活动图片
            video:  JSON.stringify(this.activity.video), //	影片介绍
            userlimit: this.activity.userlimit, //	限制人数
            enrol_max: this.activity.enrol_max, //每人限报名额
            content_c: this.activity.content_c, //	活动内容（中文）
            content_e: this.activity.content_e, //	活动内容（英文）
            clause_c: this.activity.clause_c, //	活动条款（中文）
            clause_e: this.activity.clause_e, //	活动条款（英文）
            email_c: this.activity.email_c, //  電郵範例(常規名單)（中文）
            email_e: this.activity.email_e, //  電郵範例(常規名單)（英文）
            email_waiting_c: this.activity.email_waiting_c, //  電郵範例(後補名單)（中文）
            email_waiting_e: this.activity.email_waiting_e, //  電郵範例(後補名單)（英文）
            visible: this.activity.visible, //		状态（0显示1隐藏）
            floating_window: this.activity.floating_window,
          };
          if(this.id) {
            data.id =  this.id;
          }
          save(data).then(function() {
            self.$message({
              message: '提交成功',
              type: 'success'
            });
            self.$router.push('/activity/list');
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



// WEBPACK FOOTER //
// ./src/components/activity/activityDetail/script.js