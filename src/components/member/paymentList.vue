<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/customer/list' }">會員管理</el-breadcrumb-item>
        <el-breadcrumb-item>付款進度</el-breadcrumb-item>
        <el-breadcrumb-item>{{memberName}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="new-button" @click="newPayment">新增進度</el-button>
    </section>
    <section>
      <el-row class="selects-row">
        <el-select v-model="projectId" placeholder="項目篩選"
                   @change="handleChange">
          <el-option
            v-for="item in projectList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-row>
      <el-table :data="paymentList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%">
        <el-table-column
          prop="project_name"
          label="項目">
        </el-table-column>
        <el-table-column
          prop="periods_c"
          label="期數"
          width="100">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="付款金額（HKD）">
        </el-table-column>
        <el-table-column
          prop="pay_date"
          label="需付款時間"
          min-width="170px">
        </el-table-column>
        <el-table-column
          prop="statusLabel"
          label="付款狀態">
        </el-table-column>
        <el-table-column
          label="操作"
          width="160">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleStatus(scope.row)">更改付款狀態</el-button>
            <!--<el-button-->
              <!--type="text"-->
              <!--@click="handleEdit(scope.row)">瀏覽/編輯</el-button>-->
            <el-button
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
    paymentData,
    status,
    deleteItem
  } from '@/api/member/paymentList';
  import { baseVanke,baseUtil } from '@/util/index';
  export default {
    name: "paymentList",
    data() {
        return {
          timer: null,
          _csrf: window._csrf,

          keyword: '', // 搜索关键字

          length: 10, // 每页数量
          listLength: 0, // 全部条数
          currentPage: 0, // 当前页
          loading: false,

          projectId: '', // 当前选中项目id
          projectList: [], // 用户相关项目列表
          memberId: '', // 当前用户ID
          memberName: '', // 当前用户name

          statusList: [
            {
              value: '0',
              label: '已付款',
            },
            {
              value: '1',
              label: '未付款'
            }
          ],

          paymentList:[
            // {
            //   id: "asdasdasdasdasdsd123",
            //   project_id: "1",
            //   project_name: '2',
            //   customer_id: "39e654e4-6a1a-879f-b9e9-ff615182de0d",
            //   periods_c: "5",
            //   periods_e: "Five",
            //   amount: "HKD 555,00",
            //   status: "0",
            //   create_time: "2018-05-08 16:26:49",
            //   pay_date: "2018-05-09 11:24:53",
            //   is_del: "0",
            //   name_c: "柏傲湾"
            // },
          ],
        }
    },
    activated() {
      this.loading = true;
      const self = this;
      this.memberId = this.$route.query.id;
      this.memberName = this.$route.query.name;
      searchList(this.memberId).then(function(response){
       // 获取项目列表，格式化项目列表
        self.projectList = baseVanke.elFormatArray(
          response.data.project_list,'id','name_c'
        );
        self.getListData();
      }).catch(function(error) {
        self.loading = false;
        self.$message.error(error.message);
      });

    },
    methods: {
      /* 新建项目，跳转到项目详情页 */
      newPayment() {
        this.$router.push({
          path: '/payment-record/detail',
          query: {
            memberId: this.memberId,
            name: this.memberName,
          }
        })
      },
      /* 获取项目列表 */
      getListData() {
        this.loading = true;
        const self = this;
        // this.loading = true;
        const data = {
          start: (this.currentPage-1)*this.length,
          length: this.length,
          customer_id: this.memberId,
          project_id: this.projectId,
        };
        paymentData(data)
          .then(function(response){
            if (!response.data.VIEW) {
              self.$message.error('沒有權限！');
              return;
            }
            self.listLength = parseInt(response.data.count); // 全部条目数
            self.paymentList = baseVanke.elPaymentList(
              response.data.list,
              self.projectList,
              self.statusList
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
      handleStatus(row) {
        const self = this;
        const rowStatus = row.status ? '1':'0'; //（0为已付款，1为未付款）
        status(row.id,rowStatus,this._csrf).then(function(){
          self.$message({
            type: 'success',
            message: '狀態修改成功！'
          });
          self.getListData();
        }).catch( function(error) {
          self.$message.error(error.message);
        })
      },
      // 跳转到项目详情页
      handleEdit(row) {
        this.$router.push({
          path: '/progress/detail',
          query: {
            id: row.id, // 进度ID
            projectId: this.projectId, //
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

<style scoped>

</style>



// WEBPACK FOOTER //
// src/components/member/paymentList.vue