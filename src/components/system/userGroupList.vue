<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>權限管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button v-if="CREATE" class="new-button" @click="newUserGroup()">新增權限</el-button>
    </section>
    <section>
      <el-row class="selects-row">
        <el-input class="selects-item"
                  v-model="keyword"
                  @input="handleInputChange"
                  placeholder="請輸入關鍵字搜索">
        </el-input>
      </el-row>

      <el-table :data="userGroupList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%">
        <el-table-column
          prop="name"
          label="名稱">
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
  import {
    list,
    deleteItem,
  } from '@/api/system/userGroupList';
  import { baseVanke } from '@/util/index';
  export default {
      name: "userGroupList",
      data() {
          return {
            timer: null,
            _csrf: window._csrf,

            keyword: '',
            length: 10, 
            listLength: 0, 
            currentPage: 0, 
            loading: false,

            VIEW: false,
            CREATE: false,
            EDIT: false,
            DELETE: false,
            EXPORT: false,
            userGroupList: [],
          }
      },
      activated() {
        this.getListData();
      },
      methods: {
        newUserGroup() {
          this.$router.push('/user-group/detail');
        },
        getListData() {
          const self = this;
          this.loading = true;
          let resData = {
            start: (this.currentPage-1)*this.length,
            length: this.length,
            keyword: this.keyword
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
              self.listLength = parseInt(response.data.count);
              self.userGroupList = baseVanke.elUserGroupList(
                response.data.data,
              );
            }).catch(function(error) {
            self.$message.error(error.message);
          }).finally(function() {
            self.loading = false;
          });
        },
        handleInputChange() {
          this.currentPage = 1;
          clearTimeout(this.timer);
          let self = this;
          this.timer = setTimeout(function() {
            self.getListData();
          },200);
        },
        handlePageChange() {
          this.getListData();
        },
        handleEdit(row) {
          this.$router.push({
            path: '/user-group/detail',
            query: {
              id: row.id
            }
          })
        },
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
  .selects-item {
    width: 30%;
  }
</style>



// WEBPACK FOOTER //
// src/components/system/userGroupList.vue