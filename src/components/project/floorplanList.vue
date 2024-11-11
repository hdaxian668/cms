<template>
  <div class="page">

    <div id="app"></div>
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/project/list' }">項目管理</el-breadcrumb-item>
        <el-breadcrumb-item>平面圖</el-breadcrumb-item>
        <el-breadcrumb-item>{{ projectName }}</el-breadcrumb-item>

      </el-breadcrumb>
      <el-button v-if="FLOORPLAN" class="new-button" @click="newFloorplan()">新增平面圖</el-button>
    </section>
    <section>
      <el-row class="selects-row">
        <el-input class="selects-item"
          v-model="keyword"
          @input="handleInputChange"
          placeholder="請輸入編號搜索">
        </el-input>
      </el-row>
      <el-table :data="floorplanList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%">
        <el-table-column
          prop="image"
          label="平面圖">
        <template slot-scope="scope">            
          <img :src="scope.row.image+ '?rand=' + rand"  max-width="200" height="100" />
        </template> 
        </el-table-column>
        <el-table-column
          prop="mapping"
          label="編號">
        </el-table-column>
        <el-table-column
          label="操作" min-width="110px">
          <template slot-scope="scope">
            <el-button
              v-if="FLOORPLAN"
              type="text"
              @click="handleEdit(scope.row)">瀏覽/編輯</el-button>
            <el-button
              v-if="FLOORPLAN && DELETE"
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
    floorplanData,
    deleteItem
  } from '@/api/project/floorplanList';
  import { baseVanke,baseUtil } from '@/util/index';

  export default {
    name: 'floorplanList',
    data() {
      return {
        timer: null,
        rand: 1,
        // begin: new Date(),

        _csrf: window._csrf,
        /* 类型选项列表 */

        currentPage: 1, // 当前页数
        length: 10, // 每页显示条数
        listLength: 0, // 全部条数
        loading: false,
        id:'',
        projectId: '', // 项目ID
        projectName:'', // 项目名称

        VIEW: false,
        CREATE: false,
        EDIT: false,
        DELETE: false,
        EXPORT: false,
        FLOORPLAN: false,
        floorplanList: [
          // {
          //    id,
          //   property_id,
          //   image,
          //   mapping,
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
      newFloorplan() {
        this.$router.push({
          path: '/floorplan/detail',
          query: {
            projectId: this.projectId,
            name: this.projectName,
          }
        })
      },
      /* 获取项目列表 */
      getListData() {
        const self = this;
        this.rand = Date.now()
        this.loading = true;
        this.projectId = this.$route.query.id;
        this.id = this.$route.query.id;
        this.projectName = this.$route.query.name;
        const data = {
          start: (this.currentPage-1)*this.length,
          length: this.length,
          keyword: this.keyword,
          property_id: this.projectId,
        };
        floorplanData(data)
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
            self.FLOORPLAN = response.data.FLOORPLAN;
            self.listLength = parseInt(response.data.count); // 全部条目数
            self.floorplanList = baseVanke.elFloorplanList(
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
          path: '/floorplan/detail',
          query: {
            id: row.floorplan_id,
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
          deleteItem(row.floorplan_id).then(()=> {
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
// src/components/project/floorplanList.vue