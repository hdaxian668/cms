<template>
  <div class="page">

    <div id="app"></div>
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/project/list' }">項目管理</el-breadcrumb-item>
        <el-breadcrumb-item>銷售紀錄</el-breadcrumb-item>
        <el-breadcrumb-item>{{ projectName }}</el-breadcrumb-item>

      </el-breadcrumb>

    </section>
    <section>
      <el-row class="selects-row">
        <el-input class="selects-item"
          v-model="keyword"
          @input="handleInputChange"
          placeholder="請輸入關鍵字搜索">
        </el-input>
      </el-row>
      <el-table :data="salesList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%">
        <el-table-column
          prop="unit_id"
          label="樓盤編號">
        </el-table-column>
        <el-table-column
          prop="tower_number"
          label="座數">
        </el-table-column>
        <el-table-column
          prop="floor_display_name"
          label="樓層">
        </el-table-column>
        <el-table-column
          prop="unit_number"
          label="單位">
        </el-table-column>
         
        

        <el-table-column
          label="操作" min-width="110px">
          <template slot-scope="scope">
            <el-button
              v-if="SALES"
              type="text"
              @click="handleEdit(scope.row)">瀏覽/編輯</el-button>
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
    salesData,
    deleteItem
  } from '@/api/project/salesList';
  import { baseVanke,baseUtil } from '@/util/index';

  export default {
    name: 'salesList',
    data() {
      return {
        timer: null,
        // begin: new Date(),

        _csrf: window._csrf,
        /* 类型选项列表 */

        currentPage: 1, // 当前页数
        length: 10, // 每页显示条数
        listLength: 0, // 全部条数
        loading: false,

        projectId: '', // 项目ID
        projectName:'', // 项目名称

        VIEW: false,
        CREATE: false,
        EDIT: false,
        DELETE: false,
        EXPORT: false,
        SALES: false,
        salesList: [
          // {
          //   unit_id,
          //   pasp_number,
          //   tower_number,
          //   floor_display_name,
          //   unit_number,
          // },
        ], // 项目列表
      }
    },
    created() {},
    activated() {
      this.getListData();
    },
    methods: {
      /* 新建项目，跳转到项目详情页 */
      newSales() {
        this.$router.push({
          path: '/sales/detail',
          query: {
            projectId: this.projectId,
            name: this.projectName,
          }
        })
      },
      /* 获取项目列表 */
      getListData() {
        const self = this;
        this.loading = true;
        this.projectId = this.$route.query.id;
        this.projectName = this.$route.query.name;
        const data = {
          start: (this.currentPage-1)*this.length,
          length: this.length,
          keyword: this.keyword,
          project_id: this.projectId,
        };
        salesData(data)
          .then(function(response){
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
            self.SALES = response.data.SALES;
            self.listLength = parseInt(response.data.count); // 全部条目数
            self.salesList = baseVanke.elSalesList(
              response.data.data,
             );
          }).catch(function(error) {
           self.$message.error(error.message);
        }).finally(function() {
          self.loading = false;
        });
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
      // 跳转到项目详情页
      handleEdit(row) {
        this.$router.push({
          path: '/sales/detail',
          query: {
            id: row.unit_id,
            projectId: this.projectId,
            name: this.projectName,
          }
        })
      },
      // 发送删除请求，ID标识项目
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

<style lang="less" scoped>

</style>



// WEBPACK FOOTER //
// src/components/project/salesList.vue