<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>聯繫渠道管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button v-if="CREATE" class="new-button" @click="newFeedbackChannel()">新增</el-button>
    </section>
    <section>
      <!--
      <el-row class="selects-row">
        <el-input class="selects-item"
                  v-model="keyword"
                  @input="handleInputChange"
                  placeholder="請輸入關鍵字搜索">
        </el-input>
      </el-row>
      -->
      <el-table :data="feedbackChannelList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%">
        <el-table-column
          prop="name"
          label="渠道">
        </el-table-column>
        <el-table-column
          prop="prefix"
          label="編號字首">
        </el-table-column>
        <!-- 20230112 hardcode 'ID=3 萬客會APP/WEB' not editable -->
        <el-table-column
          label="操作" min-width="110px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.id != 3"
              type="text"
              @click="handleEdit(scope.row)">瀏覽/編輯</el-button>
            <el-button
              v-if="scope.row.id != 3 && DELETE"
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
    feedbackChannelData,
    deleteItem,
  } from '@/api/feedbackChannel/feedbackChannelList';
  import { baseVanke } from '@/util/index';

  export default {
      name: "feedbackChannel",
      data() {
        return {
          timer: null,
          _csrf: window._csrf,

          keyword: '', // 搜索关键字

          length: 10, // 每页数量
          listLength: 0, // 全部条数
          currentPage: 0, // 当前页
          loading: false,

          VIEW: false,
          CREATE: false,
          EDIT: false,
          DELETE: false,
          EXPORT: false,
          feedbackChannelList: [],
        }
      },
      activated() {
        this.getListData();
      },
      methods: {
        newFeedbackChannel() {
          this.$router.push('/feedback-channel/detail');
        },
        getListData() {
          const self = this;
          this.loading = true;
          let resData = {
            start: (this.currentPage-1)*this.length, // 数据开始位置
            length: this.length, // 每页显示数量
            keyword: this.keyword // 搜索关键字
          };
          feedbackChannelData(resData)
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
              self.feedbackChannelList = baseVanke.elFeedbackChannelList(
                response.data.data,
              );
            }).catch(function(error) {
              self.$message.error(error.message);
             // self.$message.error('数据加載失敗，請重試！');
          }).finally(function() {
            self.loading = false;
          });
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
        // 跳转到详情
        handleEdit(row) {
          this.$router.push({
            path: '/feedback-channel/detail',
            query: {
              id: row.id
            }
          })
        },
        // 发送删除请求，ID标识
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
// src/components/feedbackChannel/feedbackChannelList.vue