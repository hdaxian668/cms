<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>訪客管理</el-breadcrumb-item>
        <el-breadcrumb-item>訪客證列表</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <section>
      <el-row class="selects-row">
        <el-button v-if="EXPORT" @click="exportVisitorPass()" type="primary">導出訪客證</el-button>
      </el-row>
      <el-row class="selects-row">
        <el-input class="selects-item"
                  v-model="keyword"
                  @input="handleInputChange"
                  placeholder="請輸入關鍵字搜索">
        </el-input>
        <el-date-picker 
            v-model="range"
            type="datetimerange"
            range-separator="至"
            start-placeholder="開始時間"
            end-placeholder="結束時間"
            :default-value="defaultDateValue"
            @change="handleChange"
            value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
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
        <el-select v-model="deleted" placeholder="有效/停用"
                   class="selects-item" @change="handleChange" style="width:200px">
          <el-option key="" value="" label="全部(有效/停用)"></el-option>
          <el-option key="0" value="0" label="有效"></el-option>
          <el-option key="1" value="1" label="停用"></el-option>
        </el-select>
      </el-row>
      <el-table :data="visitorPassList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%">
        <el-table-column
          prop="project_name"
          label="物業">
        </el-table-column>
        <el-table-column
          prop="unit_id"
          label="單位ID">
        </el-table-column>
        <el-table-column
          prop="club_id"
          label="會員ID">
        </el-table-column>
        <el-table-column
          prop="visitor_name"
          label="訪客名稱">
        </el-table-column>
        <el-table-column
          prop="visitor_count"
          label="訪客人數">
        </el-table-column>
        <el-table-column
          prop="reason"
          label="到訪原因">
        </el-table-column>
        <el-table-column
          prop="driving_license"
          label="車牌">
        </el-table-column>
        <el-table-column
          prop="effect_datetime"
          label="有效日期及時間"
          min-width="100px">
        </el-table-column>
        <el-table-column
          prop="deleted"
          label="有效/停用">
          <template slot-scope="scope">
            <label v-if="scope.row.deleted === '0'">有效</label>
            <label v-if="scope.row.deleted === '1'">停用</label>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_datetime"
          label="建立日期">
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
  import { visitorPassData } from '@/api/visitorPass/visitorPassList';

  export default {
    name: "visitor-pass",
    data() {
      return {
        timer: null,
        _csrf: window._csrf,

        keyword: '',
        range: [],
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
        visitorPassList: [

        ],
      }
    },
    activated() {
    // 請求选择菜单
      this.getListData();
    },
    methods: {
      getListData() {
        const self = this;
          this.loading = true;
          let resData = {
            start: (this.currentPage-1)*this.length,
            length: this.length,
            keyword: this.keyword,
            start_datetime: this.extendFormatSubmit(this.range, 0),
            end_datetime: this.extendFormatSubmit(this.range, 1),
            project_id: this.project_id,
            deleted: this.deleted,
          };
          visitorPassData(resData)
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
              self.visitorPassList = baseVanke.elVisitorPassList(response.data.data);
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
      extendFormatSubmit(range, key) {
        if (range != null && typeof range[key] != 'undefined') {
          return range[key];
        } else {
          return '';
        }
      },
      exportVisitorPass() {
        const url = '/visitor-pass/export?keyword=' + this.keyword + '&start_datetime=' + this.extendFormatSubmit(this.range, 0) + '&end_datetime=' + this.extendFormatSubmit(this.range, 1) + '&project_id=' + this.project_id + '&deleted=' + this.deleted;
        console.log(url);
        window.open(url);
      },
    }
  }
</script>

<style scoped>

</style>



// WEBPACK FOOTER //
// src/components/visitorPass/visitorPassList.vue