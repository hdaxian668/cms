<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>訂閱管理</el-breadcrumb-item>
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
      <el-table :data="subscribeList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%">
        <el-table-column
          prop="email"
          label="電郵地址">
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
    subscribeData,
    deleteItem,
  } from '@/api/subscribe/subscribe';
  import { baseVanke } from '@/util/index';

  export default {
    name: "subscribe",
    data() {
      return {
        timer: null,
        _csrf: window._csrf,

        keyword: '', // 搜索关键字

        length: 10, // 每页数量
        listLength: 0, // 全部条数
        currentPage: 0, // 当前页
        loading: false,

        subscribeList: [
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
      this.loading = true;
      // 請求选择菜单
     this.getListData();
    },
    methods: {
      getListData() {
        const self = this;
        this.loading = true;
        let resData = {
          start: (this.currentPage-1)*this.length, // 数据开始位置
          length: this.length, // 每页显示数量
          email: this.keyword // 搜索关键字
        };
        subscribeData(resData)
          .then(function(response){
            if (!response.data.VIEW) {
              self.$message.error('沒有權限！');
              return;
            }
            self.listLength = parseInt(response.data.count); // 全部条目数
            self.subscribeList = baseVanke.elSubscribeList(
              response.data.list,
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
    }
  }
</script>

<style scoped>

</style>



// WEBPACK FOOTER //
// src/components/subscribe/subscribe.vue