<template>
  <div class="page">
    <!--<form class="login-form"  method="post">-->
      <!--<input name="_csrf" type="hidden" id="_csrf" value="<?= Yii::$app->request->csrfToken ?>">-->
    <!--</form>-->
    <div id="app"></div>
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>項目管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="new-button" v-if="CREATE" @click="newProject()">新增項目</el-button>
    </section>
    <section>
      <el-row class="selects-row">
        <el-select v-model="type" placeholder="所有類型"
                   class="selects-item"
                   @change="handleChange">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="category" placeholder="所有類別"
                   class="selects-item" @change="handleChange">
          <el-option
            v-for="item in categoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input class="selects-item"
          v-model="keyword"
          @input="handleInputChange"
          placeholder="請輸入關鍵字搜索">
        </el-input>
      </el-row>
      <el-table :data="projectList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%">
        <el-table-column
          prop="name"
          label="項目名">
        </el-table-column>
        <el-table-column
          prop="type"
          label="類型">
        </el-table-column>
        <el-table-column
          prop="category"
          label="發展類別">
        </el-table-column>
        <el-table-column
          prop="status"
          label="狀況">
        </el-table-column>
        <el-table-column
          prop="visibleLabel"
          label="狀態">
        </el-table-column>

        <el-table-column
          v-if="EDIT"
          label="排序"
          min-width="75">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleUp(scope.row)">上移</el-button>
            <el-button
              type="text"
              @click="handleDown(scope.row)">下移</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="550px">
          <template slot-scope="scope">
            <el-button
              v-if="EDIT && scope.row.visible"
              type="text"
              @click="handleVisible(scope.row)">下架</el-button>
            <el-button
              v-if="EDIT && !scope.row.visible"
              type="text"
              @click="handleVisible(scope.row)">上架</el-button>
            <el-button
              v-if="FLOORPLAN"
              type="text"
              @click="handleFloorplan(scope.row)">平面圖</el-button>
            <el-button
              v-if="SALES"
              type="text"
              @click="handleSales(scope.row)">銷售紀錄</el-button>
            <el-button
              v-if="PROGRESS"
              type="text"
              @click="handleProgress(scope.row)">施工進度</el-button>
            <el-button
              v-if="UNITIMPORT"
              type="text"
              @click="handleUnit(scope.row)">單位導入</el-button>
            <el-button
              v-if="UNITEXPORT"
              type="text"
              @click="handleExport(scope.row)">單位導出</el-button>
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
    searchList,
    projectData,
    visible,
    sort,
    deleteItem
  } from '@/api/project/projectList';
  import { baseVanke,baseUtil } from '@/util/index';

  export default {
    name: 'projectList',
    data() {
      return {
        timer: null,
        // begin: new Date(),

        _csrf: window._csrf,
        /* 类型选项列表 */
        type: '', // 当前选择类型
        typeList: [], // 类型列表
        category: '', // 当前选择类别
        categoryList:[], // 类别列表
        statusList: [], // 状况列表
        keyword: '', // 搜索关键字
        visibleList: [
          {
            value: '0',
            label: '上架',
          },
          {
            value: '1',
            label: '下架'
          }
        ],

        currentPage: 1, // 当前页数
        length: 10, // 每页显示条数
        listLength: 0, // 全部条数
        loading: false,

        VIEW: false,
        CREATE: false,
        EDIT: false,
        DELETE: false,
        EXPORT: false,
        FLOORPLAN: false,
        SALES: false,
        PROGRESS: false,
        UNITIMPORT: false,
        UNITEXPORT: false,
        projectList: [
          // { // 项目列表数据
          //   id: '1',
          //   name: '柏傲湾',
          //   type: '销售物业',
          //   category: '住宅及商业',
          //   status: '发展中项目',
          //   visible: true
          // },{
          //   id: '2',
          //   name: '丽景中心',
          //   type: '服务式住宅',
          //   category: '其他类别',
          //   status: '发展中项目',
          //   visible: false
          // }
          ], // 项目列表
      }
    },
    created() {
    },
    activated() {
      this.loading = true;
      this._csrf = window._csrf;
      let self = this;
      searchList().then(function(response) {
        self.typeList = baseVanke.elFormatArray(response.data.type);
        self.categoryList = baseVanke.elFormatArray(response.data.category);
        self.statusList = baseVanke.elFormatArray(response.data.status);
        self.getListData();
      }).catch(function(error) {
        self.loading = false;
        self.$message.error(error.message);
      });
    },
    computed: {
      /* 当前页第一条，从0开始 */
      start: function() {
        return (this.currentPage-1)*this.length;
      }
    },
    methods: {
      /* 新建项目，跳转到项目详情页 */
      newProject() {
        this.$router.push('/project/detail');
      },
      /* 获取项目列表 */
      getListData() {
        const self = this;
        this.loading = true;
        const data = {
          type: this.type,
          category: this.category,
          keyword: this.keyword,
          start: (this.currentPage-1)*this.length,
          length: this.length
        };
        projectData(data)
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
            self.FLOORPLAN = response.data.FLOORPLAN;
            self.SALES = response.data.SALES;
            self.PROGRESS = response.data.PROGRESS;
            self.UNITIMPORT = response.data.UNITIMPORT;
            self.UNITEXPORT = response.data.UNITEXPORT;
            self.listLength = parseInt(response.data.count); // 全部条目数
            self.projectList = baseVanke.elProjectList(
              response.data.data,
              self.typeList,
              self.categoryList,
              self.statusList,
              self.visibleList
            );
            // response.data = {count: '1',data:[]}
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
      // 更改上下架
      handleVisible(row) {
        const self = this;
        const rowVisible = row.visible ? '1':'0';
        visible(row.id,rowVisible,this._csrf).then(function(){
          self.$message({
            type: 'success',
            message: '狀態修改成功！'
          });
          self.getListData();
        }).catch( function(error) {
          self.$message.error(error.message);
        })
      },
      // 上移操作，向后端请求数据
      handleUp(row) {
        const self = this;
        const isUp = true;
        sort(row.id,isUp,this._csrf).then(function(){
          self.$message({
            type: 'success',
            message: '上移成功！'
          });
          self.getListData();
        }).catch(function(error) {
          self.$message.error(error.message);
        });
      },
      // 下移操作，向后端请求数据
      handleDown(row) {
        const self = this;
        const isUp = false;
        sort(row.id,isUp).then(function(){
          self.$message({
            type: 'success',
            message: '下移成功！'
          });
          self.getListData();
        }).catch(function(error) {
          self.$message.error(error.message);
        });
      },
      // 项目进度
      handleProgress(row) {
        this.$router.push({
          path: '/progress/list',
          query: {
            id: row.id,
            name: row.name,
          }
        });
      },
      // 銷售紀錄
      handleSales(row) {
        this.$router.push({
          path: '/sales/list',
          query: {
            id: row.id,
            name: row.name,
          }
        });
      },
      // 平面圖
      handleFloorplan(row) {
        this.$router.push({
          path: '/floorplan/list',
          query: {
            id: row.id,
            name: row.name,
          }
        });
      },
      // 單位
      handleUnit(row) {
        this.$router.push({
          path: '/unit/import',
          query: {
            id: row.id,
            name: row.name,
          }
        });
      },
      handleExport(row) {
        const url = '/project/export-units?project_id=' + row.id;
        console.log(url);
        window.open(url);
      },
      // 跳转到项目详情页
      handleEdit(row) {
        this.$router.push({
          path: '/project/detail',
          query: {
            id: row.id
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
// src/components/project/projectList.vue