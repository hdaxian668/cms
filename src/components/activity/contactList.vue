<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>活動管理</el-breadcrumb-item>
        <el-breadcrumb-item>聯絡管理</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <section>
      <el-row class="selects-row">
        <el-input class="selects-item"
                  v-model="keyword"
                  @input="handleInputChange"
                  placeholder="請輸入關鍵字搜索">
        </el-input>
        <el-date-picker type="date" placeholder="選擇開始篩選日期"
                        v-model="begin_date"
                        class="selects-item"
                        value-format="yyyy-MM-dd"
                        @change="handleChange">
        </el-date-picker>
        <el-date-picker type="date" placeholder="選擇結束篩選日期"
                        v-model="end_date"
                        class="selects-item"
                        value-format="yyyy-MM-dd"
                        @change="handleChange">
        </el-date-picker>
      </el-row>
      <el-radio-group v-model="status"
                      @change="handleChange"
                      style="margin-bottom: 30px;">
        <el-radio-button v-for="item in statusList"  :label="item.value">{{item.label}}</el-radio-button>
      </el-radio-group>
      <el-table :data="contactList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%">
      <el-table-column
        prop="title_c"
        label="活動標題">
      </el-table-column>
      <el-table-column
        prop="email"
        label="郵箱">
      </el-table-column>
      <el-table-column
        prop="content"
        label="詳細內容">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="提交時間"
        min-width="170px">
      </el-table-column>
      <el-table-column
        v-if="EDIT"
        label="狀態">
        <template slot-scope="scope">
          <el-select v-model="scope.row.status" class="status-change-input"
                     @change="handleStatusChange(scope.row)">
            <el-option
              v-for="item in valueStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
  import {
    selectLists,
    contactData,
    status,
  } from '@/api/activity/contactList';
  import { baseVanke } from '@/util/index';
  export default {
    name: "contactList",
    data() {
      return {
        timer: null,
        // begin: new Date(),
        _csrf: window._csrf,

        keyword: '', // 搜索关键字
        begin_date: '',
        end_date: '',
        status: '', // 状态
        statusList: [],
        valueStatusList: [], // 可选的状态

        length: 10, // 每页数量
        listLength: 0, // 全部条数
        currentPage: 0, // 当前页
        loading: false,

        VIEW: false,
        CREATE: false,
        EDIT: false,
        DELETE: false,
        EXPORT: false,
        contactList: [
          // {
          //   id: "39e5f4fd-2b4f-ee99-e85f-a219de2333cc",
          //   activity_id: "39e5f4fd-2b4f-ee99-e85f-a219de7548cc",
          //   title_c: "保存测试",
          //   create_time: "2018-04-23 16:48:00",
          //   email: "850814116@qq.com",
          //   status: '0',
          //   content: "内容管理内容管理内容管理内容管理内容管理",
          // }
        ],
      }
    },
    activated() {
      this.loading = true;
      // 請求选择菜单
      let self = this;
      selectLists().then(function(response) {
        self.statusList = baseVanke.elFormatArray(response.data.status);
        self.valueStatusList = self.valueList(self.statusList);
        self.getListData();
      }).catch(function(error) {
        self.loading = false;
        self.$message.error(error.message);
        // self.$message.error('数据加載失敗，請重試！');
      });

    },
    methods: {
      /* 获取列表数据 */
      getListData() {
        this.loading = true;
        const self = this;
        let resData = {
          start: (this.currentPage-1)*this.length, // 数据开始位置
          length: this.length, // 每页显示数量
          begin_date: this.begin_date, // 活动开始时间
          end_date: this.end_date,
          status: this.status,
          keyword: this.keyword // 搜索关键字
        };
        contactData(resData)
          .then(function(response){
            if (!response.data.VIEW) {
              self.$message.error('沒有權限！');
              return;
            }
            self.VIEW = response.data.VIEW;
            self.CREATE = response.data.CREATE;
            self.EDIT = response.data.EDIT;
            self.DELETE = response.data.DELETE;
            self.EXPORT = response.data.EXPORT;
            self.listLength = parseInt(response.data.count); // 全部条目数
            self.contactList = baseVanke.elContactList(
              response.data.list,
            );
          }).catch(function(error) {
            self.$message.error(error.message);
        }).finally(function() {
          self.loading = false;
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
        }).finally(function() {
          self.getListData(); // 成不成功都要刷新页面
        });
      },
    }
  }
</script>

<style scoped>
  .status-change-input input{
    border: none;
  }
</style>



// WEBPACK FOOTER //
// src/components/activity/contactList.vue