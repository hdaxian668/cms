<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>執修管理</el-breadcrumb-item>
        <el-breadcrumb-item>編輯假期</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button v-if="CREATE" class="new-button" type="primary" @click="CreateNewHoliday()">新增假期</el-button>
    </section>
    <section>
      <el-row class="selects-row">
        <el-button v-if="EXPORT" @click="exportRepList('xls')" type="primary">公眾假期導出(XLS)</el-button>
        <el-button v-if="IMPORT" type="primary" @click="HolidayImport()">公眾假期導入</el-button>
      </el-row>

      <el-row class="selects-row">
          <el-select v-model="project_id" placeholder="所有項目"
                   class="selects-item"
                   @change="handleInputChange">
            <el-option :key="-1" label="所有項目" value=""></el-option>
            <el-option v-for="item in projectList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </el-option>
          </el-select>
          <el-input class="selects-item"
                  v-model="keyword"
                  @blur="handleInputChange"
                  placeholder="假期名稱">
          </el-input>
          <el-date-picker
            v-model="range"
            type="daterange"
            range-separator="至"
            start-placeholder="日期(由)"
            end-placeholder="日期(至)"
            :default-value="defaultDateValue"
            @change="handleInputChange"
            value-format="yyyy-MM-dd">
          </el-date-picker>
      </el-row>

      <el-table :data="dataHolidayList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%"
                :row-style="tableRowStyle">
        <el-table-column prop="name" label="假期名稱"></el-table-column>
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="weekday" label="Weekday"></el-table-column>
        <el-table-column prop="apply" label="項目"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)">瀏覽/編輯</el-button>
            <el-button v-if="DELETE" type="text" @click="handleDelete(scope.row)">刪除</el-button>
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
  import { itemlist, deleteItem } from '@/api/defectHoliday/defectHoliday';
  import { baseVanke } from '@/util/index';
    export default {
        name: "defectHolidayList",
      data() {
        return {
          keyword: '',
          length: 10, // 每页数量
          listLength: 0, // 全部条数
          currentPage: 0, // 当前页
          loading: false,
          range: [], //回報時間

          VIEW: false,
          CREATE: false,
          EDIT: false,
          DELETE: false,
          EXPORT: false,
          IMPORT: false,
          dataHolidayList: [],
          projectList: [],
          project_id: '',
        }
    },
    activated() {
      this.loading = true;
      let self = this;
      self.getListData();
    },
    methods: {
      CreateNewHoliday() {
        this.$router.push('/defect-holiday/new');
      },
      HolidayImport(){
        this.$router.push('/defect-holiday/import');
      },
      /* 获取列表数据 */
      getListData() {
        this.loading = true;
        const self = this;
        let resData = {
          start: (this.currentPage-1)*this.length, // 数据开始位置
          length: this.length, // 每页显示数量
          keyword: this.keyword,
          date1: this.extendFormatSubmit(this.range,0),
          date2: this.extendFormatSubmit(this.range,1),
          apply: this.project_id,
        };
        itemlist(resData).then(function(response){
          if (!response.data.VIEW) {
              self.$message.error('沒有權限！');
              return;
            }
            self.VIEW = response.data.VIEW;
            self.CREATE = response.data.CREATE;
            self.EDIT = response.data.EDIT;
            self.DELETE = response.data.DELETE;
            self.EXPORT = response.data.EXPORT;
            self.IMPORT = response.data.IMPORT;
            self.listLength = parseInt(response.data.count); // 全部条目数
            self.dataHolidayList = baseVanke.elDefectHolidayList(response.data.list);
            self.projectList = baseVanke.elFormatArray(response.data.project.data, 'id', 'name_c');
          }).catch(function(error) {
            self.$message.error(error.message);
          }).finally(function() {
            self.loading = false;
          });
      },

      tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        //if (rowIndex === 0) {
          return 'background-color: lightblue;color: #fff;font-weight: 500;'
        //}
      },

      tableRowStyle({ row, rowIndex }) {
        if(row.warningStatus == 1){
          return 'background-color: #FFC7C7';
        }else if(row.warningStatus == 2){
          return 'background-color: #FFF4C3';
        }
        
      },

      // 选择框内容变化
      handleInputChange() {
        this.currentPage = 1; // 从第一页开始
        this.getListData();
      },
      // 点击翻页、页码
      handlePageChange() {
        this.getListData();
      },
      // 查看详情
      handleDetail(row) {
        this.$router.push({
          path: '/defect-holiday/edit',
          query: {
            id: row.id
          }
        })
      },
			handleDelete(row) {				  
				this.submitLoading = true;
        this.$confirm('請注意此操作無法恢復，是否繼續?', '確認刪除操作', {
          confirmButtonText: '確認刪除',
          cancelButtonText: '取消操作',
          type: 'warning',
          dangerouslyUseHTMLString: true,
        }).then(() => {
  				let data = {
	  				id: row.id,
		  			is_deleted: "1",
			  	};
  				deleteItem(data).then((response)=>{
	  				this.submitLoading = false;
		  			this.$message({
			  			type: 'success',
  						message: '提交成功!'
	  				});
		  			this.getListData();
			  	}).catch((error)=>{
			  		this.$message.error(error.message);
	    		});
        })
			},
      extendFormatSubmit(range, key) {
        if(range != null && typeof range[key] != 'undefined') {
          return range[key];
        }else{
          return '';
        }
      },
      exportRepList(fileType) {
        const url = '/defect-holiday/export?date1=' + this.extendFormatSubmit(this.range,0) + '&date2=' + this.extendFormatSubmit(this.range,1) + '&keyword=' + this.keyword + '&apply=' + this.project_id;
        console.log(url);
        window.open(url);
      },
    }
  }
</script>

<style scoped>

</style>



// WEBPACK FOOTER //
// src/components/defectHoliday/defectHolidayList.vue