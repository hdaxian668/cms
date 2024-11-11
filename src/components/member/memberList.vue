<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>會員管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button v-if="CREATE" class="new-button" @click="newMember()">新增會員</el-button>
      <!-- <el-button class="new-button" @click="goToRegSetting()">會員註冊設置</el-button> -->
    </section>
    <section>
      <el-row class="selects-row">
        <el-button v-if="EXPORT" @click="exportMemList()" type="primary">導出會員資料</el-button>
        <el-button v-if="EDIT" @click="resendWelcomeEmail()" type="primary">點選會員重發歡迎電郵</el-button>
      </el-row>
      <el-row class="selects-row">
        <el-input class="selects-item"
                  v-model="keyword"
                  @input="handleInputChange"
                  placeholder="請輸入關鍵字搜索">
        </el-input>
        <el-select v-model="property" class="selects-item" placeholder="請選擇物業" @change="handleChange" style="width:15%">
          <el-option
            v-for="item in propertyList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="level" class="selects-item" placeholder="請選擇會籍" @change="handleChange" style="width:15%">
          <el-option key="-1" label="所有會籍" value=""></el-option>
          <el-option
            v-for="item in levelList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!--<el-select v-model="deleted" class="selects-item" placeholder="請選擇會員類型" @change="handleChange">
          <el-option
            v-for="item in deletedList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>-->
        <el-select v-model="sales_source" class="selects-item" placeholder="請選擇註冊來源" @change="handleChange" style="width:15%">
          <el-option
            v-for="item in salesSourceList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="status" class="selects-item" placeholder="請選擇會員類型" @change="handleChange" style="width:15%">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-row>
      <el-table :data="memberList"
                v-loading="loading"
                element-loading-text="數據中"
                style="width: 100%">
        <el-table-column
          v-if="EDIT"
          label="#"
          width="40">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked" @change="handleSelection(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="club_id" label="會員號碼"></el-table-column>
        <el-table-column prop="title" label="稱謂"></el-table-column>
        <el-table-column prop="name_c" label="姓名（中）"></el-table-column>
        <el-table-column prop="name_e" label="姓名（英）"></el-table-column>
        <el-table-column prop="level_name" label="會籍"></el-table-column>
        <el-table-column prop="phone" label="手機號"></el-table-column>
        <el-table-column prop="email" label="郵箱"></el-table-column>
        <el-table-column prop="sales_source" label="註冊來源"></el-table-column>
        <el-table-column prop="create_time" label="註冊日期" min-width="100"></el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <!--<el-button
              v-if="scope.row.deleted !== '1'"
              type="text"
              @click="handlePayment(scope.row)">更新付款進度</el-button>-->
            <el-button
              type="text"
              @click="handleEdit(scope.row)">瀏覽/編輯</el-button>
            <el-button
              v-if="DELETE && scope.row.deleted === '1'"
              type="text"
              @click="handleReset(scope.row)">恢復</el-button>
            <el-button
              v-if="DELETE && scope.row.deleted === '0'"
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
    customerData,
    bulkSendValidEmail,
    searchLists,
    deleteItem,
    resetItem,
  } from '@/api/member/memberList';
  import { baseVanke } from '@/util/index';
  export default {
    name: "memberList",
    data() {
        return {
          timer: null,
          _csrf: window._csrf,

          selection: [],
          keyword: '', // 搜索关键字
          level: '', // 会籍
          levelList: [], // 会籍列表
          deleted: '', // 會員类型
          deletedList: [],
          status: '', // 用户审核类型
          statusList: [],
          property: '', // 用户审核类型
          propertyList: [],
          sales_source: '',
          salesSourceList: [],

          length: 10, // 每页数量
          listLength: 0, // 全部条数
          currentPage: 0, // 当前页
          loading: false,

          VIEW: false,
          CREATE: false,
          EDIT: false,
          DELETE: false,
          EXPORT: false,
          memberList: [
            // {
            //   id: '', // id
            //   name_c: '', // 姓名
            //   level_name: '', // 会籍名
            //   phone: '', // 手机号
            //   email: '', // 邮箱
            //   payStatus: '', // 是否有付款进度
            // }
          ],
        }
    },
    activated() {
      this.loading = true;
      const self = this;
      searchLists().then(function(response){
        self.levelList = baseVanke.elFormatArray(response.data.level.list,'id', 'name');
        self.deletedList = baseVanke.elFormatArray(response.data.deleted);
        self.statusList = baseVanke.elFormatArray(response.data.status);
        self.propertyList = baseVanke.elFormatArray(response.data.property);
        self.salesSourceList = baseVanke.elFormatArray(response.data.sales_source);
        self.getListData();
      }).catch(function(error) {
        self.loading = false;
        self.$message.error(error.message);
        // self.$message.error('数据加載失敗，請重試！');
      });
    },
    methods: {
      // 获取数据
      getListData() {
        this.loading = true;
        const self = this;
        let reqData = {
          start: (this.currentPage-1)*this.length, // 数据开始位置
          length: this.length, // 每页显示数量
          keyword: this.keyword ,// 搜索关键字
          level_id: this.level, // 会籍ID
          deleted: this.deleted, // 用户类型
          status: this.status, // 用户类型
          property_id: this.property, 
          sales_source: this.sales_source, 
        };
        customerData(reqData)
          .then(function(response) {
            self.VIEW = response.data.VIEW;
            self.CREATE = response.data.CREATE;
            self.EDIT = response.data.EDIT;
            self.DELETE = response.data.DELETE;
            self.EXPORT = response.data.EXPORT;
            self.listLength = parseInt(response.data.count); // 全部条目数
            self.show = response.data.show; // 全部条目数
            self.memberList = baseVanke.elCustomerList(
              response.data.list,
            );
            self.memberList.forEach(function(member) {
              self.$set(member, 'checked', false);
            });
          }).catch(function(error) {
          self.$message.error(error.message);
          // self.$message.error('数据加載失敗，請重試！');
        }).finally(function() {
          self.loading = false;
        });
      },
      newMember() {
        this.$router.push('/customer/detail');
      },
      // 导出会员资料
      exportMemList() {
        const url = '/customer/export?level_id=' + this.level + '&keyword=' + this.keyword + '&property_id=' + this.property + '&status=' + this.status + '&sales_source=' + this.sales_source;
        console.log(url);
        window.open(url);
      },
      // 进入会员注册设置页面
      goToRegSetting() {
        this.$router.push('/customer/register-setting');
      },
      resendWelcomeEmail() {
        // DEBUG
        // var ids = JSON.stringify(this.selection || []);
        // alert(ids);
        // return;

        this.$confirm('是否重發歡迎電郵? *注意發送需時，請耐心等待。', '確認重發', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          const self = this;
          let reqData = {
            ids: JSON.stringify(this.selection || [])
          };
          bulkSendValidEmail(reqData)
            .then((response) => {
              // ...
            })
            .finally(() => {
              self.loading = false;
              self.$message({
                type: 'success',
                message: '發送成功!'
              });
            });
        })
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
      // 付款进度
      handlePayment(row) {
        this.$router.push({
          path: '/payment-record/list',
          query: {
            id: row.id,
            name: row.name_c,
          }
        })
      },
      handleSelection(row) {
        if (row.checked) {
          if (!this.selection.includes(row.id)) {
            row.checked = true;
            this.selection.push(row.id);
          }
        }
        else {
          var i;
          for (i = 0; i < this.selection.length; i++) {
            if (this.selection[i] == row.id) {
              row.checked = false;
              this.selection.splice(i, 1);
              return;
            }
          }
        }
      },
      // 跳转到详情页
      handleEdit(row) {
        this.$router.push({
          path: '/customer/detail',
          query: {
            id: row.id
          }
        })
      },
      // 发送删除请求，ID标识
      handleDelete(row) {
        this.$confirm('是否刪除會員?', '確認刪除', {
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
      // 恢复用户信息
      handleReset(row) {
        this.$confirm('是否恢復會員', '確認恢復', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resetItem(row.id).then(()=> {
            this.$message({
              type: 'success',
              message: '恢復成功!'
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
    }
  }
</script>

<style scoped>

</style>



// WEBPACK FOOTER //
// src/components/member/memberList.vue