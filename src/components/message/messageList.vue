<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>消息管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button v-if="CREATE" class="new-button" @click="newMessage()">發送新消息</el-button>
    </section>
    <section>
      <el-row class="selects-row">
        <el-input class="selects-item"
                  v-model="keyword"
                  @input="handleInputChange"
                  placeholder="請輸入關鍵字搜索">
        </el-input>
        <el-date-picker type="date" placeholder="發送日期篩選"
                        v-model="send_date"
                        class="selects-item"
                        value-format="yyyy-MM-dd"
                        @change="handleChange">
        </el-date-picker>
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
      </el-row>
      <el-table :data="messageList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%">
        <el-table-column
          prop="title_c"
          label="標題">
        </el-table-column>
        <el-table-column
          prop="msg_type"
          label="消息類型">
        </el-table-column>
        <el-table-column
          prop="send_date"
          label="發送日期"
          width="170px">
        </el-table-column>
        <el-table-column
          prop="send_type"
          label="發送目標">
        </el-table-column>
        <el-table-column
          prop="statusLabel"
          label="狀態">
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
              :disabled="scope.row.status === '1'"
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
    messageData,
    deleteItem,
  } from '@/api/message/messageList';
  import { baseVanke } from '@/util/index';

  export default {
    name: "messageList",
    data() {
      return {
        timer: null,
        _csrf: window._csrf,

        type: '', // 消息种类
        typeList: [],
        send_date: '', // 发送日期
        keyword: '', // 搜索关键字
        sendTypeList: [], // 发送目标
        statusList: [
          {
            value: '0',
            label: '未發送',
          },
          {
            value: '1',
            label: '已發送'
          }
        ],

        length: 10, // 每页数量
        listLength: 0, // 全部条数
        currentPage: 0, // 当前页
        loading: false,

        VIEW: false,
        CREATE: false,
        EDIT: false,
        DELETE: false,
        EXPORT: false,
        messageList: [],
      }
    },
    activated() {
      this.loading = true;
      // 請求选择菜单
      const self = this;
      selectLists().then(function(response) {
        self.typeList = baseVanke.elFormatArray(response.data.type);
        self.getListData();
      }).catch(function(error) {
        self.loading = false;
        self.$message.error(error.message);
      });
    },
    methods: {
      newMessage() {
        this.$router.push('/message/detail');
      },
      /* 获取列表数据 */
      getListData() {
        this.loading = true;
        const self = this;
        let resData = {
          start: (this.currentPage-1)*this.length, // 数据开始位置
          length: this.length, // 每页显示数量
          type:this.type, // 分类
          date: this.send_date, // 发送时间
          keyword: this.keyword // 搜索关键字
        };
        messageData(resData)
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
            self.listLength = parseInt(response.data.data.count); // 全部条目数
            self.sendTypeList = baseVanke.elFormatArray(response.data.send_type);
            self.messageList = baseVanke.elMessageList(
              response.data.data.list,
              self.typeList,
              self.sendTypeList,
              self.statusList,
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
          path: '/message/detail',
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
// src/components/message/messageList.vue