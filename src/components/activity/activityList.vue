<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>活動管理</el-breadcrumb-item>
        <el-breadcrumb-item>活動列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button v-if="CREATE" class="new-button" @click="newActivity()">新增活動</el-button>
    </section>
    <section>
      <el-row class="selects-row">
        <el-select v-model="category" placeholder="所有活動"
                   class="selects-item"
                   @change="handleChange">
          <el-option
            v-for="item in categoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="visible" placeholder="所有狀態"
                   class="selects-item"
                   @change="handleChange">
          <el-option
            v-for="item in visibleList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker type="month" placeholder="活動開始月份"
                        v-model="activityStartDate"
                        class="selects-item"
                        value-format="yyyy-MM"
                        @change="handleChange">
        </el-date-picker>
        <el-input class="selects-item"
                  v-model="keyword"
                  @input="handleInputChange"
                  placeholder="請輸入關鍵字搜索">
        </el-input>
      </el-row>
      <el-table :data="activityList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%">
        <el-table-column prop="category"
                         label="活動類別">
        </el-table-column>
        <el-table-column prop="title_c"
                         label="活動標題">
        </el-table-column>
        <el-table-column prop="activity_begin_date"
                         label="活動開始時間"
                         width="170px">
        </el-table-column>
        <el-table-column prop="attend_end_date"
                         label="報名截止時間"
                         width="170px">
        </el-table-column>
        <el-table-column prop="userlimit"
                         label="限制人數">
        </el-table-column>
        <el-table-column label="狀態" v-if="EDIT">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.visible"
              type="text"
              @click="handleVisible(scope.row)">取消展示</el-button>
            <el-button
              v-else
              type="text"
              @click="handleVisible(scope.row)">取消隱藏</el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="EDIT"
          label="排序"
          min-width="95">
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
          label="操作" min-width="200px">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleAttend(scope.row)">查看報名</el-button>
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
    selectLists,
    activityData,
    visible,
    sort,
    deleteItem,
  } from '@/api/activity/activityList';
  import { baseVanke } from '@/util/index';

  export default {
    name: "activityList",
    data() {
      return {
        timer: null,
        _csrf: window._csrf,

        visible: '', // 当前选择状态
        visibleList:[], // 状态列表
        category: '', // 活动种类
        categoryList: [],
        activityStartDate: '', // 活动开始时间
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
        activityList: [],
      }
    },
    created() {},
    activated() {
      this.loading = true;
      // 請求选择菜单
      let self = this;
      selectLists().then(function(response) {
        self.visibleList = baseVanke.elFormatArray(response.data.visible);
        self.categoryList = baseVanke.elFormatArray(response.data.category_list);
        self.getListData();
      }).catch(function(error) {
        self.loading = false;
        self.$message.error(error.message);
        // self.$message.error('数据加載失敗，請重試！');
      });

    },
    methods: {
      newActivity() {
        this.$router.push('/activity/detail');
      },
      /* 获取列表数据 */
      getListData() {
        this.loading = true;
        const self = this;
        let resData = {
          start: (this.currentPage-1)*this.length, // 数据开始位置
          length: this.length, // 每页显示数量
          category:this.category, // 活动分类
          begin_date: this.activityStartDate, // 活动开始时间
          visible: this.visible, // 活动状态
          title_c: this.keyword // 搜索关键字
        };
        activityData(resData)
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
            self.activityList = baseVanke.elActivityList(
              response.data.list,
              self.categoryList,
              self.visibleList,
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
      // 更改顯示隱藏
      handleVisible(row) {
        const self = this;
        const changeVisible = row.visible ? 1:0; // 后台要求传int类型
        visible(row.id,changeVisible).then(function(){
          // row.visible = !row.visible;
          self.$message({
            type: 'success',
            message: '狀態修改成功！'
          });
          self.getListData();
        }).catch( function(error) {
          self.$message.error(error.message);
          // self.$message.error('狀態修改失敗，請重試！');
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
      // 跳转报名管理
      handleAttend(row) {
        this.$router.push({
          path: '/attend/attend-list/'+row.id+'/'+row.title_c,
        })
      },
      // 跳转到项目详情
      handleEdit(row) {
        this.$router.push({
          path: '/activity/detail',
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
  .selects-item {
    width:20%;
  }
</style>



// WEBPACK FOOTER //
// src/components/activity/activityList.vue