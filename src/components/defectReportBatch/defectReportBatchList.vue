<template>
    <div class="page">
      <section class="page-header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
          <el-breadcrumb-item>執修管理</el-breadcrumb-item>
          <el-breadcrumb-item>執修單總表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button v-if="CREATE" class="new-button" type="primary" @click="CreateNewBatch()">新增執修單</el-button>
      </section>
      <section>
        <el-row class="selects-row">
          <el-button v-if="EXPORT" @click="exportRepList('xls')" type="primary">導出執修單總表(XLS)</el-button>
        </el-row>
        <el-row class="selects-row">
          <el-select v-model="project_id" placeholder="所有項目"
                   class="selects-item"
                   @change="handleChange">
            <el-option :key="-1" label="所有項目" value=""></el-option>
            <el-option v-for="item in projectList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="tower_number" placeholder="所有座數"
                   class="selects-item" id="tower_number"
                   @change="handleChange"> 
            <el-option :key="-1" label="所有座數" value=""></el-option>
            <el-option v-for="item in towerList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="floor_display_name" placeholder="所有樓層"
                   class="selects-item" id="floor_display_name"
                   @change="handleChange">
            <el-option :key="-1" label="所有樓層" value=""></el-option>
            <el-option v-for="item in floorList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="unit_number" placeholder="所有單位"
                   class="selects-item"
                   @change="handleChange">
            <el-option :key="-1" label="所有單位" value=""></el-option>
            <el-option v-for="item in unitList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </el-option>
          </el-select>
        </el-row>

        <el-row class="selects-row">
          <el-input class="selects-item"
                  v-model="batch_seq"
                  @input="handleInputChange"
                  placeholder="Batch No">
          </el-input>
          <el-select v-model="order_type" placeholder="執修單/待料單"
                   class="selects-item" id="order_type"
                   @change="handleChange">
            <el-option :key="-1" label="所有執修單/待料單" value=""></el-option>
            <el-option v-for="item in order_typeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="enter_method" placeholder="大門匙/電約單"
                   class="selects-item" id="enter_method"
                   @change="handleChange"> 
            <el-option :key="-1" label="所有大門匙/電約單" value=""></el-option>
            <el-option v-for="item in enter_methodList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="is_hotcase_filter" placeholder="Hotcase"
                   class="selects-item" id="is_hotcase_filter"
                   @change="handleChange"> 
            <el-option :key="-1" label="所有Hotcase" value=""></el-option>
            <el-option :key="0" label="否" value="0"></el-option>
            <el-option :key="1" label="是" value="1"></el-option>
          </el-select>
        </el-row>

        <el-row class="selects-row">
          <el-date-picker
            v-model="range1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="執修表遞交日及時間(由)"
            end-placeholder="執修表遞交日及時間(至)"
            :default-value="defaultDateValue"
            @change="handleChange"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
					<div style="display:inline">
          已用日數
					<div style="display:inline-block;vertical-align:top;">
          <el-input :disabled="is_allow_to_fill" class="selects-item" style="width:60px;" v-model="days_used1" @input="handleInputChange" placeholder="已用日數(由)"></el-input> 至 
          <el-input :disabled="is_allow_to_fill" class="selects-item" style="width:60px;" v-model="days_used2" @input="handleInputChange" placeholder="已用日數(至)"></el-input>
          <br/>
          <span style="font-size:10px;">先選擇項目再作已用日數篩選</span>
          </div>
          </div>
          <!-- <el-input class="selects-item"
                  v-model="days_used1"
                  @input="handleInputChange"
                  placeholder="已用日數">
          </el-input>
          <el-input class="selects-item"
                  v-model="days_used2"
                  @input="handleInputChange"
                  placeholder="已用日數">
          </el-input> -->
        </el-row>

        <el-table :data="defectBatchList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%"
                :row-style="tableRowStyle">
          <el-table-column prop="project_name_c" label="項目"></el-table-column>
          <el-table-column prop="tower_number" label="座數"></el-table-column>
          <el-table-column prop="floor_display_name" label="樓層"></el-table-column>
          <el-table-column prop="unit_number" label="單位"></el-table-column>
          <el-table-column label="單位編號">
            <template slot-scope="scope">
              <span v-if="scope.row.is_hotcase=='1'" style="color:red">{{scope.row.unit_id}}</span>
              <span v-else>{{scope.row.unit_id}}</span>
            </template>

          </el-table-column>
          <el-table-column prop="batch_id" label="執修單號碼"></el-table-column>
          <el-table-column prop="batch_seq" label="Batch No."></el-table-column>
          <el-table-column prop="order_type" label="執修單/待料單"></el-table-column>
          <el-table-column prop="submission_date" label="執修表遞交日"></el-table-column>
          <el-table-column prop="days_used" label="已用日數"></el-table-column>
          <el-table-column prop="order_checking_date" label="對單日期"></el-table-column>
          <el-table-column prop="enter_method" label="大門匙/電約單"></el-table-column>
          <el-table-column prop="signoff_date" label="業主簽單日期"></el-table-column>
          <el-table-column prop="is_signoff" label="已簽全部完成項目"></el-table-column>
          <el-table-column prop="order_receipt_date1" label="除待料外執修回單"></el-table-column>
          <el-table-column prop="create_time" label="創建日期"></el-table-column>
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
  import { defectBatchData, defectBatchDelete } from '@/api/defectReportBatch/defectReportBatchList';
	import { getlist } from '@/api/defectReportBatch/defectReportBatchNew';
  import { getUnitInformation } from '@/api/defectReportBatch/defectReportBatchNew';
  import { baseVanke } from '@/util/index';
    export default {
        name: "defectReportBatch",
      data() {
        return {
          timer: null,

          range1: [], //回報時間
          project_id: '', // 选中项目
          tower_number: '', 
          unit_number: '', 
          days_used1: '', 
          days_used2: '', 
          order_type: '', 
          enter_method: '', 
          floor_display_name: '',
          working_status: '', 
          projectList: [], // 项目列表
          statusList: [], // 状态列表
          unitList: [], // 状态列表
          towerList: [], // 状态列表
          floorList: [], // 状态列表
          order_typeList: [],
          length: 10, // 每页数量
          listLength: 0, // 全部条数
          currentPage: 0, // 当前页
          loading: false,
          is_hotcase_filter: '',
          batch_seq: '',
          is_allow_to_fill: true,

          VIEW: false,
          CREATE: false,
          EDIT: false,
          DELETE: false,
          EXPORT: false,
          defectBatchList: [],
        }
    },
    activated() {
      this.loading = true;
      // 請求选择菜单
      let self = this;
      self.initDetail();
      getlist().then(function (response) {
        self.projectList = baseVanke.elFormatArray(response.data.project.data, 'id', 'name_c');
				self.enter_methodList = baseVanke.elFormatArray(response.data.enter_method);
				self.order_typeList = baseVanke.elFormatArray(response.data.order_type);
        self.getListData();
      }).catch(function (error) {
        self.loading = false;
        self.$message.error(error.message);
        // self.$message.error('数据加載失敗，請重試！');
      });
    },
    methods: {
			initDetail() {
        this.project_id = '';
        this.unit_number = '';
        this.tower_number = '';
        this.floor_display_name = '';
        this.days_used1 = '';
        this.days_used2 = '';
        this.enter_method = '';
        this.range1 = [];
        this.is_hotcase_filter = '';
        this.batch_seq = '';
        this.order_type = '';
        this.defectBatchList = [];
        this.listLength = 0;
        this.currentPage = 0;
        this.is_allow_to_fill = true;
			},
      CreateNewBatch() {
        this.$router.push('/defect-report-batch/new');
      },
      /* 获取列表数据 */
      getListData() {
        this.loading = true;
        const self = this;
        let resData = {
          start: (this.currentPage-1)*this.length, // 数据开始位置
          length: this.length, // 每页显示数量
          project_id: this.project_id, // 项目ID
          batch_seq: this.batch_seq, // 项目ID
          tower_number: this.tower_number, // 项目ID
          unit_number: this.unit_number, // 项目ID
          floor_display_name: this.floor_display_name, // 项目ID
          days_used1: this.days_used1, // 项目ID
          days_used2: this.days_used2, // 项目ID
          order_type: this.order_type, // 项目ID
          enter_method: this.enter_method, // 项目ID
          is_hotcase: this.is_hotcase_filter,
          submit_start_date: this.extendFormatSubmit(this.range1,0),
          submit_end_date: this.extendFormatSubmit(this.range1,1),
        };        
        defectBatchData(resData).then(function(response){
            if (!response.data.VIEW) {
              self.$message.error('沒有權限！');
              return;
            }
            console.log(response);
            self.VIEW = response.data.VIEW;
            self.CREATE = response.data.CREATE;
            self.EDIT = response.data.EDIT;
            self.DELETE = response.data.DELETE;
            self.EXPORT = response.data.EXPORT;
            self.listLength = parseInt(response.data.count); // 全部条目数
            self.defectBatchList = baseVanke.elDefectBatchList(response.data.list, self.enter_methodList, self.order_typeList);
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

      extendFormatSubmit(range,key) {
        if(range != null && typeof range[key] != 'undefined') {
          return range[key];
        }else{
          return '';
        }
      },

      exportRepList(fileType) {
        const url = '/defect-report-batch/export?project_id='+ this.project_id+'&batch_seq='+this.batch_seq+'&tower_number='+this.tower_number+'&unit_number='+this.unit_number+'&floor_display_name='+this.floor_display_name+'&days_used1='+this.days_used1+'&days_used2='+this.days_used2+'&order_type='+this.order_type+'&enter_method='+this.enter_method+'&is_hotcase='+this.is_hotcase_filter+'&submit_start_date='+this.extendFormatSubmit(this.range1,0)+'&submit_end_date='+this.extendFormatSubmit(this.range1,1);
        console.log(url);

        const alertThreshold = 100;
        if (this.listLength > alertThreshold) {
          this.$confirm('請注意導出多於' +alertThreshold+ '條紀錄需時，是否繼續?', '確認導出', {
            confirmButtonText: '確認導出',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            window.open(url);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消導出'
            });
          });
        }
        else {
          window.open(url);
        }
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
      // 选择框内容变化
      handleChange() {
        this.currentPage = 1; // 从第一页开始
        const self = this;
        if (self.towerList != []) {
          if (this.project_id != ''){
            this.is_allow_to_fill = false;
          } else {
            this.is_allow_to_fill = true;
            this.days_used1 = '';
            this.days_used2 = '';
          }
          let reqdata = {
	  				project_id: this.project_id,
		  		};
          getUnitInformation(reqdata).then(function(response){
            self.towerList = baseVanke.elFormatArray(response.data.towerlist);
            self.floorList = baseVanke.elFormatArray(response.data.floorlist);
            self.unitList = baseVanke.elFormatArray(response.data.unitlist);
            self.getListData();
          });
        } else {
          self.getListData();
        }
      },
      // 点击翻页、页码
      handlePageChange() {
        this.getListData();
      },
      // 查看详情
      handleDetail(row) {
        this.$router.push({
          path: '/defect-report-batch/detail',
          query: {
            id: row.id
          }
        })
      },
      handleDelete(row) {
        this.$confirm('系統將會刪除以下項目?<br/>執修單號碼: '+row.batch_id+'<br/>共有'+row.defectitemcount+'張執修單<br/>請注意此操作無法恢復，是否繼續？', '確認刪除操作', {
          confirmButtonText: '確認刪除',
          cancelButtonText: '取消操作',
          type: 'warning',
          dangerouslyUseHTMLString: true,
        }).then(() => {
          let resData = {
            id: row.id
          }
          defectBatchDelete(resData).then(()=> {
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
// src/components/defectReportBatch/defectReportBatchList.vue