<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>折扣管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button v-if="CREATE" class="new-button" @click="newDiscount()">新增折扣</el-button>
    </section>
    <section>
      <el-row class="selects-row">
        <el-date-picker type="date" placeholder="折扣日期篩選"
                        class="selects-item"
                        v-model="discountedDate"
                        value-format="yyyy-MM-dd"
                        @change="handleChange"></el-date-picker>
        <el-select v-model="visible" placeholder="所有狀態"
                   class="selects-item" @change="handleChange">
          <el-option
            v-for="item in visibleList"
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
      <el-table :data="discountedList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%">
        <el-table-column
          prop="name"
          label="標題"
          width="320px">
        </el-table-column>
        <el-table-column
          prop="date"
          label="發佈日期"
          width="200px"
          min-width="170px" >
        </el-table-column>
        <el-table-column
          prop="visible"
          label="狀態">
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
    selectLists,
    discountData,
    sort,
    deleteItem
  } from '@/api/discounted/discountedList';
  import { baseVanke } from '@/util/index';
  export default {
    name: 'discountedList',
    data() {
      return {
        timer: null,
        // begin: new Date(),
        _csrf: window._csrf,

        discountedDate: '', // 折扣时间
        visible: '', // 当前选择状态
        visibleList:[
          // {
          //   value:'',
          //   label: '所有狀態'
          // }, {
          //   value:'1',
          //   label:'顯示'
          // }, {
          //   value:'2',
          //   label:'隱藏'
          // }
        ], // 状态列表
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
        discountedList: [
          // { // 项目列表数据
          //     id: '1',
          //     name: '万客会送你Pacific Coffice $100 礼券',
          //     date: '2018-03-15 18:15:00',
          //     visible: '显示'
          //   },
          //   {
          //     id: '2',
          //     name: '万客会送你Pacific Coffice $100 礼券',
          //     date: '2018-03-15 18:15:00',
          //     visible: '隐藏'
          //   }
          ], // 列表数据
      }
    },
    created() {},
    activated() {
      this.loading = true;
      let self = this;
      selectLists().then(function(response) {
        self.visibleList = baseVanke.elFormatArray(response.data.visible);
        self.getListData();
      }).catch(function(error) {
        self.loading = false;
        self.$message.error(error.message);
        // self.$message.error('頁面加載失敗，請重試！');
      });

    },
    methods: {
      /* 新建折扣，跳转到折扣详情页 */
      newDiscount() {
        this.$router.push('/discounted/detail');
      },
      /* 获取列表数据 */
      getListData() {
        this.loading = true;
        const self = this;
        let resData = {
          start: (this.currentPage-1)*this.length,
          length: this.length,
          date: this.discountedDate,
          visible: this.visible,
          keyword: this.keyword
        };
        discountData(resData)
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
            self.discountedList = baseVanke.elDiscountedList(
              response.data.list,
              self.visibleList
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
      // 跳转到项目详情
      handleEdit(row) {
        this.$router.push({
          path: '/discounted/detail',
          query: {
            id: row.id
          }
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
    width:30%;
  }
</style>



// WEBPACK FOOTER //
// src/components/discounted/discountedList.vue