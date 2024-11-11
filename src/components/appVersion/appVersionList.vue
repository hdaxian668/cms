<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>App版本管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button v-if="CREATE" class="new-button" @click="newAppVersion()">新增版本</el-button>
    </section>
    <section>
      <el-row class="selects-row">
        <el-select v-model="os" class="selects-item" placeholder="請選擇OS" @change="handleChange">
          <el-option key="" value="" label="全部OS"></el-option>
          <el-option key="iOS" value="iOS" label="iOS"></el-option>
          <el-option key="Android" value="Android" label="Android"></el-option>
        </el-select>
      </el-row>
      <el-table :data="listData"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%">
        <el-table-column
          prop="os"
          label="OS">
        </el-table-column>
        <el-table-column
          prop="build_version"
          label="版本號">
        </el-table-column>
        <el-table-column
          prop="force_update"
          label="強制更新">
        </el-table-column>
        <el-table-column
          prop="release_note"
          label="更新內容"
          min-width="400px">
          <template slot-scope="scope">
            <span v-html="scope.row.release_note"></span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="DELETE"
          label="操作"
          min-width="240">
          <template slot-scope="scope">
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
  import { baseVanke } from '@/util/index';
  import { appVersion } from '@/api/system/app-version';
  import { deleteItem } from '@/api/appVersion/appVersionList';

  export default {
    name: "app-version",
    data() {
      return {
        timer: null,
        _csrf: window._csrf,

        os: '',

        length: 10, // 每页数量
        listLength: 0, // 全部条数
        currentPage: 0, // 当前页
        loading: false,

        VIEW: false,
        CREATE: false,
        EDIT: false,
        DELETE: false,
        EXPORT: false,
        listData: [

        ],
      }
    },
    activated() {
    // 請求选择菜单
      this.getListData();
    },
    methods: {
      getListData() {
        this.loading = true;
        const self = this;
        let resData = {
          start: (this.currentPage-1)*this.length, // 数据开始位置
          length: this.length, // 每页显示数量
          os: this.os,
        };
        appVersion(resData)
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
            self.listData = baseVanke.elAppVersionList(
              response.data.data,
            );
          }).catch(function(error) {
            self.$message.error(error.message);
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
      handleDelete(row) {
        this.$confirm('是否刪除版本?', '確認刪除', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
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
            message: '已取消删除'
          });
        });
      },
      newAppVersion() {
        this.$router.push('/app-version/detail');
      },
      // 点击翻页、页码
      handlePageChange() {
        this.getListData();
      },
    }
  }
</script>

<style scoped>

</style>



// WEBPACK FOOTER //
// src/components/appVersion/appVersionList.vue