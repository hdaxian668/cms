<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>保安員管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button v-if="CREATE" class="new-button" @click="newGuard()">新增保安員</el-button>
    </section>
    <section>
      <el-row class="selects-row">
        <el-input class="selects-item"
                  v-model="keyword"
                  @input="handleInputChange"
                  placeholder="請輸入關鍵字搜索">
        </el-input>
        <el-select v-model="project_id" placeholder="所有物業"
                   class="selects-item" @change="handleChange" style="width:200px">
          <el-option key="" value="" label="全部物業"></el-option>
          <el-option
            v-for="item in projectList"
            :key="item.id"
            :label="item.name_c"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="deleted" placeholder="啟用/停用"
                   class="selects-item" @change="handleChange" style="width:200px">
          <el-option key="" value="" label="全部(啟用/停用)"></el-option>
          <el-option key="0" value="0" label="啟用"></el-option>
          <el-option key="1" value="1" label="停用"></el-option>
        </el-select>
      </el-row>
      <el-table :data="guardList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%">
        <el-table-column
          prop="username"
          label="保安員ID">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名稱">
        </el-table-column>
        <el-table-column
          prop="project_name"
          label="物業">
        </el-table-column>
        <el-table-column
          prop="deleted"
          label="啟用/停用">
          <template slot-scope="scope">
            <label v-if="scope.row.deleted === '0'">啟用</label>
            <label v-if="scope.row.deleted === '1'">停用</label>
          </template>
        </el-table-column>
        <el-table-column
          label="操作" min-width="110px">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">瀏覽/編輯</el-button>
            <el-button v-if="DELETE && scope.row.deleted === '0'" type="text" @click="handleDisable(scope.row)">停用</el-button>
            <el-button v-if="DELETE && scope.row.deleted === '1'" type="text" @click="handleEnable(scope.row)">啟用</el-button>
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
  import { baseVanke } from '@/util/index';
  import { guardData, disable, enable } from '@/api/guard/guardList';
  export default {
      name: "guard",
      data() {
        return {
          timer: null,
          _csrf: window._csrf,

          keyword: '', // 搜索关键字
          project_id: '',
          projectList: [],
          deleted: '',

          length: 10, // 每页数量
          listLength: 0, // 全部条数
          currentPage: 0, // 当前页
          loading: false,

          VIEW: false,
          CREATE: false,
          EDIT: false,
          DELETE: false,
          EXPORT: false,
          guardList: [
            // {
            //   id: '1',
            //   name: 'Oasis',
            //   number: '9999',
            //   benefit: '5'
            // }
          ],
        }
      },
      activated() {
        this.getListData();
      },
      methods: {
        newGuard() {
          this.$router.push('/guard/detail');
        },
        getListData() {
          const self = this;
          this.loading = true;
          let resData = {
            start: (this.currentPage-1)*this.length,
            length: this.length,
            keyword: this.keyword,
            project_id: this.project_id,
            deleted: this.deleted,
          };
          guardData(resData)
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
              self.guardList = baseVanke.elGuardList(response.data.data);
              self.projectList = baseVanke.elPropertyList(response.data.projectList);
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
        handleChange() {
          this.currentPage = 1; // 从第一页开始
          this.getListData();
        },
        // 点击翻页、页码
        handlePageChange() {
          this.getListData();
        },
        // 跳转到详情
        handleEdit(row) {
          this.$router.push({
            path: '/guard/detail',
            query: {
              id: row.id
            }
          })
        },
        handleDisable(row) {
          this.$confirm('是否繼續?', '確認停用操作', {
            confirmButtonText: '確認停用',
            cancelButtonText: '取消操作',
            type: 'warning'
          }).then(() => {
            disable(row.id).then(()=> {
              this.$message({
                type: 'success',
                message: '停用成功!'
              });
              this.getListData();
            }).catch((error) => {
              this.$message.error(error.message);
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消停用'
            });
          });
        },
        handleEnable(row) {
          this.$confirm('是否繼續?', '確認啟用操作', {
            confirmButtonText: '確認啟用',
            cancelButtonText: '取消操作',
            type: 'warning'
          }).then(() => {
            enable(row.id).then(()=> {
              this.$message({
                type: 'success',
                message: '啟用成功!'
              });
              this.getListData();
            }).catch((error) => {
              this.$message.error(error.message);
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消啟用'
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
// src/components/guard/guardList.vue