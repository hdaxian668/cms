<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>審計日誌</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <section>

      <el-row class="selects-row">
        <el-input class="selects-item"
                  v-model="keyword"
                  @input="handleInputChange"
                  placeholder="請輸入記錄編號">
        </el-input>
        
        <el-date-picker class="selects-item" type="date" placeholder="日期" value-format="yyyy-MM-dd"
                  v-model="create_time_from"
                  @input="handleInputChange"
                  placeholder="執行日期(由)">
        </el-date-picker>

        <el-date-picker class="selects-item" type="date" placeholder="日期" value-format="yyyy-MM-dd"
                  v-model="create_time_to"
                  @input="handleInputChange"
                  placeholder="執行日期(至)">
        </el-date-picker>

        <el-select v-model="operator" placeholder="執行自" class="selects-item" @change="handleChange">
          <el-option key="" value="" label="全部員工"></el-option>
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-row>

      <el-table :data="listData"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%"
                @row-click="handleEdit(scope.row)">
        <el-table-column
          prop="create_time"
          label="執行日期">
        </el-table-column>
        <el-table-column
          prop="module_display"
          label="模塊">
        </el-table-column>
        <el-table-column
          prop="keyword"
          label="記錄編號">
        </el-table-column>
        <el-table-column
          prop="action_display"
          label="動作">
        </el-table-column>
        <el-table-column
          prop="operator"
          label="執行自">
        </el-table-column>
        <el-table-column
          prop="content"
          label="內容"
          min-width="200px">
        </el-table-column>

        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleEdit(scope.row)"
              v-if="(scope.row.action != 'delete')">瀏覽</el-button>
          </template>
        </el-table-column>
		
		<!--
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
		-->
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
  import { list } from '@/api/auditLog/auditLogList';
  import { baseVanke } from '@/util/index';

  export default {
    name: "auditLog",
    data() {
      return {
        timer: null,
        _csrf: window._csrf,

        projectList: [],
        userGroupList: [],
        userList: [],

        keyword: '',
        create_time_from: '',
        create_time_to: '',
        operator: '',

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
      }
    },
    activated() {
    // 請求選擇菜單
      this.getListData();
    },
    methods: {
      getListData() {
        this.loading = true;
        const self = this;
        let resData = {
          start: (this.currentPage-1)*this.length,
          length: this.length,
          keyword: this.keyword,
          create_time_from: this.create_time_from,
          create_time_to: this.create_time_to,
          operator: this.operator
        };
        list(resData)
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
            self.listData = baseVanke.elAuditLogList(response.data.data);
            self.listLength = parseInt(response.data.count);

            self.projectList = baseVanke.elPropertyList(response.data.projectList);
            self.userGroupList = baseVanke.elUserGroupList(response.data.userGroupList);
            self.userList = baseVanke.elUserList(response.data.userList);
            
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
      // 跳轉到詳情
      handleEdit(row) {
        this.$router.push({
          path: '/' + row.module + '/detail',
          query: {
            id: row.item_id
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
    }
  }
</script>

<style scoped>

</style>



// WEBPACK FOOTER //
// src/components/auditLog/auditLogList.vue