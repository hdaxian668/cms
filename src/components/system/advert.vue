<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>廣告管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button v-if="CREATE" class="new-button" @click="newAd()">新增廣告</el-button>
    </section>
    <section>
      <el-row class="selects-row">
        <el-select v-model="site" placeholder="廣告位置"
                   class="selects-item" @change="handleChange">
          <el-option
            v-for="item in siteList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="visible" placeholder="所有狀態"
                   class="selects-item" @change="handleChange">
          <el-option
            v-for="item in visibleList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!--<el-input class="selects-item"-->
                  <!--v-model="keyword"-->
                  <!--@input="handleInputChange"-->
                  <!--placeholder="請輸入關鍵字搜索">-->
        <!--</el-input>-->
      </el-row>
      <el-table :data="adList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%">
        <el-table-column
          prop="site"
          label="廣告位置"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="title_c"
          label="中文標題">
        </el-table-column>
        <el-table-column
          prop="jump_type"
          label="跳轉到">
        </el-table-column>
        <el-table-column
          prop="url"
          label="網址"
          min-width="270px">
        </el-table-column>
        <el-table-column
          v-if="EDIT"
          label="状态">
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
          min-width="110px">
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
          min-width="110px">
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
    advertData,
    deleteItem,
    sort,
    visible
  } from '@/api/system/advert';
  import { baseVanke } from '@/util/index';
  export default {
      name: "advert",
      data() {
          return {
            timer: null,
            // begin: new Date(),
            _csrf: window._csrf,

            site: '',
            siteList: [],
            visible: '',
            visibleList:[],
            keyword: '', // 搜索关键字
            jumpList: [], // 跳转列表

            length: 10, // 每页数量
            listLength: 0, // 全部条数
            currentPage: 0, // 当前页
            loading: false,

            VIEW: false,
            CREATE: false,
            EDIT: false,
            DELETE: false,
            EXPORT: false,
            adList: [
              // {
              //   id: '1', // id
              //   site: '首页', // 广告位置
              //   title_c: '2017年位列财富榜', // 标题
              //   jump_type: 'URL', // 跳转URL类别
              //   jump_page: '',
              //   url: 'www.http.cn', // 地址
              //   // point: '23', // 点击量
              //   visible: '取消展示', // 可见
              //   sort: '0' // 排序
              // }
            ],
          }
      },
    activated() {
      this.loading = true;
      const self = this;
      selectLists().then(function(response) {
        self.siteList = baseVanke.elFormatArray(response.data.site);
        self.visibleList = baseVanke.elFormatArray(response.data.visible);
        self.jumpList = baseVanke.elFormatArray(response.data.jump_type);
        self.getListData();
      }).catch(function(error) {
        self.loading = false;
        self.$message.error(error.message);
        // self.$message.error('頁面加載失敗，請重試！');
      });

    },
      methods: {
        newAd() {
          this.$router.push('/advert/detail');
        },
        /* 获取列表数据 */
        getListData() {
          const self = this;
          this.loading = true;
          let resData = {
            start: (this.currentPage-1)*this.length,
            length: this.length,
            site: this.site,
            visible: this.visible,
            keyword: this.keyword
          };
          advertData(resData)
            .then(function(response){
              if (!response.data.VIEW) {
                self.$message.error('沒有權限！');
                self.$router.push('/advert/list');
                return;
              }
              self.VIEW = response.data.VIEW;
              self.CREATE = response.data.CREATE;
              self.EDIT = response.data.EDIT;
              self.DELETE = response.data.DELETE;
              self.EXPORT = response.data.EXPORT;
              self.listLength = parseInt(response.data.count); // 全部条目数
              self.adList = baseVanke.elAdvertList(
                response.data.data,
                self.siteList,
                self.jumpList
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
            // self.$message.error('上移失敗，請重試！');
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
            // self.$message.error('下移失敗，請重試！');
          });
        },
        // 跳转到项目详情
        handleEdit(row) {
          this.$router.push({
            path: '/advert/detail',
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

<style scoped>
  .selects-item {
    width:30%;
  }
</style>



// WEBPACK FOOTER //
// src/components/system/advert.vue