<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>聯繫我們</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button v-if="CREATE" class="new-button" @click="newFeedback()">新增聯繫記錄</el-button>
    </section>
    <section>
      <el-row class="selects-row">
        <el-button v-if="EXPORT" @click="exportFeedbackList()" type="primary">導出查詢資料</el-button>
        <el-button v-if="EXPORT" @click="exportFeedbackListWithRemark()" type="primary">導出查詢資料及備註</el-button>
      </el-row>

      <el-row class="selects-row">
        <el-input class="selects-item"
                  v-model="keyword"
                  @input="handleInputChange"
                  placeholder="請輸入關鍵字">
        </el-input>

        <el-select v-model="channel_id" class="selects-item" placeholder="請選擇渠道" @change="handleChange">
          <el-option key="" value="" label="全部渠道"></el-option>
          <el-option
            v-for="item in feedbackChannelList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-select>

        <el-select v-model="category" class="selects-item" placeholder="請選擇查詢" @change="handleChange">
          <el-option key="" value="" label="全部查詢"></el-option>
          <el-option
            v-for="item in feedbackCategoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-select>

        <el-select v-model="status" class="selects-item" placeholder="請選擇狀態" @change="handleChange">
          <el-option key="" value="" label="全部狀態"></el-option>
          <el-option key="1" value="1" label="待處理"></el-option>
          <el-option key="2" value="2" label="處理中"></el-option>
          <el-option key="3" value="3" label="已完成"></el-option>
          <el-option key="4" value="4" label="關閉"></el-option>
          <el-option key="5" value="5" label="拒絕"></el-option>
          <el-option key="6" value="6" label="取消"></el-option>
        </el-select>

        <el-button type="text" class="adv-search-btn" v-if="(!isEnableAdvSearch)" v-on:click="toggleAdvSearch(true)">顯示更多 &gt;</el-button>
        <el-button type="text" class="adv-search-btn" v-if="(isEnableAdvSearch)" v-on:click="toggleAdvSearch(false)">&lt; 顯示較少</el-button>
      </el-row>

      <el-row class="selects-row" v-if="(isEnableAdvSearch)">
        <el-select v-model="assigned_group_id" placeholder="跟進群組"
                   class="selects-item" @change="handleChange">
          <el-option key="" value="" label="跟進群組"></el-option>
          <el-option
            v-for="item in userGroupList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>

        <el-input class="selects-item"
                  v-model="username"
                  @input="handleInputChange"
                  placeholder="請輸入會員姓名">
        </el-input>

        <el-input class="selects-item"
                  v-model="phone"
                  @input="handleInputChange"
                  placeholder="請輸入手提電話">
        </el-input>

        <el-input class="selects-item"
                  v-model="email"
                  @input="handleInputChange"
                  placeholder="請輸入郵箱地址">
        </el-input>
      </el-row>

      <el-row class="selects-row" v-if="(isEnableAdvSearch)">
        <el-select v-model="project_id" placeholder="所有物業"
                   class="selects-item" @change="handleChange">
          <el-option key="" value="" label="全部物業"></el-option>
          <el-option
            v-for="item in projectList"
            :key="item.id"
            :label="item.name_c"
            :value="item.id">
          </el-option>
        </el-select>

        <el-input class="selects-item"
                  v-model="project_address"
                  @input="handleInputChange"
                  placeholder="請輸入單位">
        </el-input>
      </el-row>

      <el-row class="selects-row" v-if="(isEnableAdvSearch)">
        <el-date-picker class="selects-item" type="date" placeholder="日期" value-format="yyyy-MM-dd"
                  v-model="enquiry_date_from"
                  @input="handleInputChange"
                  placeholder="查詢日期(由)"
                  style="width: 20%;">
        </el-date-picker>

        <el-date-picker class="selects-item" type="date" placeholder="日期" value-format="yyyy-MM-dd"
                  v-model="enquiry_date_to"
                  @input="handleInputChange"
                  placeholder="查詢日期(至)"
                  style="width: 20%;">
        </el-date-picker>
        
        <el-date-picker class="selects-item" type="date" placeholder="日期" value-format="yyyy-MM-dd"
                  v-model="alter_time_from"
                  @input="handleInputChange"
                  placeholder="最後更新時間(由)"
                  style="width: 20%;">
        </el-date-picker>

        <el-date-picker class="selects-item" type="date" placeholder="日期" value-format="yyyy-MM-dd"
                  v-model="alter_time_to"
                  @input="handleInputChange"
                  placeholder="最後更新時間(至)"
                  style="width: 20%;">
        </el-date-picker>
      </el-row>

      <el-table :data="listData"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%">
        <el-table-column
          prop="enquiry_id"
          label="查詢編號">
        </el-table-column>
        <el-table-column
          prop="channel"
          label="查詢渠道">
        </el-table-column>
        <el-table-column
          prop="username"
          label="查詢者姓名/公司">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手提電話">
        </el-table-column>
        <el-table-column
          prop="email"
          label="郵箱地址">
        </el-table-column>
        <el-table-column
          prop="content"
          label="內容"
          min-width="200px">
          <template slot-scope="scope">
            <span v-html="scope.row.content"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="狀態">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="創建時間"
          min-width="150px">
        </el-table-column>
        <el-table-column
          label="操作" min-width="110px">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleEdit(scope.row)">瀏覽/編輯</el-button>
            <el-button
              v-if="DELETE"
              type="text"
              @click="handleDelete(scope.row)">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section class="page-footer">
      <span class="list-num">共{{listLength}}條記錄</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="listLength"
        :page-size="length"
        :current-page.sync ="currentPage"
        @current-change="handlePageChange"
        class="page-num">
      </el-pagination>
    </section>

  </div>
</template>

<script>
  import { feedback, deleteItem } from '@/api/system/feedback';
  import { baseVanke } from '@/util/index';

  export default {
    name: "feedback",
    data() {
      return {
        timer: null,
        _csrf: window._csrf,

        projectList: [],
        userGroupList: [],
        feedbackChannelList: [],
        feedbackCategoryList: [],

        isEnableAdvSearch: false,

        keyword: '',
        
        enquiry_id: '',
        channel_id: '',
        project_id: '',
        project_address: '',
        category: '',
        username: '',
        phone: '',
        email: '',
        assigned_group_id: '',
        status: '',
        enquiry_date_from: '',
        enquiry_date_to: '',
        alter_time_from: '',
        alter_time_to: '',

        order_by: '',
        order_method: '',

        length: 10, // 每頁數量
        listLength: 0, // 全部條數
        currentPage: 0, // 當前頁
        loading: false,

        VIEW: false,
        VIEW_SELF: false,
        CREATE: false,
        EDIT: false,
        DELETE: false,
        EXPORT: false,
        listData: [],
        queryDataForExport: [
          'keyword', 'channel_id', 'category', 'status', 
          'assigned_group_id', 'username', 'phone', 'email', 
          'project_id', 'project_address',
          'enquiry_date_from', 'enquiry_date_to', 'alter_time_from', 'alter_time_to'
        ],
      }
    },
    activated() {
    // 請求選擇菜單
      this.getListData();
    },
    methods: {
      newFeedback() {
        this.$router.push('/feedback/new');
      },
      getListData() {
        this.loading = true;
        const self = this;
        let resData = {
          start: (this.currentPage-1)*this.length,
          length: this.length,
          keyword: this.keyword,
          enquiry_id: this.enquiry_id,
          channel_id: this.channel_id,
          project_id: this.project_id,
          project_address: this.project_address,
          category: this.category,
          username: this.username,
          phone: this.phone,
          email: this.email,
          assigned_group_id: this.assigned_group_id,
          status: this.status,
          enquiry_date_from: this.enquiry_date_from,
          enquiry_date_to: this.enquiry_date_to,
          alter_time_from: this.alter_time_from,
          alter_time_to: this.alter_time_to,
          order_by: this.order_by,
          order_method: this.order_method
        };
        feedback(resData)
          .then(function(response){
            if (!(response.data.VIEW || response.data.VIEW_SELF)) {
              self.$message.error('沒有權限！');
              return;
            }
            self.VIEW = response.data.VIEW;
            self.VIEW_SELF = response.data.VIEW_SELF;
            self.CREATE = response.data.CREATE;
            self.EDIT = response.data.EDIT;
            self.DELETE = response.data.DELETE;
            self.EXPORT = response.data.EXPORT;
            self.listData = baseVanke.elFeedbackList(response.data.data);
            self.listLength = parseInt(response.data.count);

            self.projectList = baseVanke.elPropertyList(response.data.projectList);
            self.userGroupList = baseVanke.elUserGroupList(response.data.userGroupList);
            self.feedbackChannelList = response.data.feedbackChannelList;
            self.feedbackCategoryList = response.data.feedbackCategoryList;
            
          }).catch(function(error) {
            self.$message.error(error.message);
        }).finally(function() {
          self.loading = false;
        });
      },
      // 輸入框內容變化
      handleInputChange() {
        this.currentPage = 1; // 從第一頁開始
        clearTimeout(this.timer);
        let self = this;
        this.timer = setTimeout(function() {
          self.getListData();
        },200);
      },
      handleChange() {
        this.currentPage = 1; // 從第一頁開始
        this.getListData();
      },
      // 點擊翻頁、頁碼
      handlePageChange() {
        this.getListData();
      },
      exportFeedbackList() {
        //const url = '/feedback/export?keyword=' + this.keyword + '&category=' + this.category + '&project_id=' + this.project_id;
        //console.log(url);
        
        let url = '/feedback/export';
        let parameters = "";
        for (let q = 0; q < this.queryDataForExport.length; q++) {
          let key = this.queryDataForExport[q];
          parameters += (parameters == '' ? '?' : '&') + key + '=' + this[key];
        }
        url += parameters;

        window.open(url);
      },
      exportFeedbackListWithRemark() {
        //const url = '/feedback/export-with-remark?keyword=' + this.keyword + '&category=' + this.category + '&project_id=' + this.project_id;
        //console.log(url);

        let url = '/feedback/export-with-remark';
        let parameters = "";
        for (let q = 0; q < this.queryDataForExport.length; q++) {
          let key = this.queryDataForExport[q];
          parameters += (parameters == '' ? '?' : '&') + key + '=' + this[key];
        }
        url += parameters;

        window.open(url);
      },
      // 跳轉到詳情
      handleEdit(row) {
        this.$router.push({
          path: '/feedback/detail',
          query: {
            id: row.id
          }
        })
      },
      // 發送刪除請求，ID標識項目
      handleDelete(row) {
        this.$confirm('請注意此操作無法恢復，是否繼續?', '確認刪除操作', {
          confirmButtonText: '確認刪除',
          cancelButtonText: '取消操作',
          type: 'warning'
        }).then(() => {
          deleteItem(row.id).then(()=> {
            this.$message({
              type: 'success',
              message: '刪除成功!'
            });
            this.getListData();
          }).catch((error) => {
            this.$message.error(error.message);
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消刪除'
          });
        });
      },
      toggleAdvSearch(status) {
        this.isEnableAdvSearch = status;
      },
    }
  }
</script>

<style scoped>
  .adv-search-btn {
    text-align: left;
    padding-left: 10px;
  }
</style>



// WEBPACK FOOTER //
// src/components/feedback/feedback.vue