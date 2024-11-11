<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
				<el-breadcrumb-item>執修管理</el-breadcrumb-item>
				<el-breadcrumb-item>執修單</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button v-if="CREATE" class="new-button" type="primary" @click="CreateNewDefect()">新增執修</el-button>
    </section>
    <section>
      <el-row class="selects-row">
        <el-button v-if="EXPORT" @click="exportRepList('xls')" type="primary">導出執修報告(XLS)</el-button>
        <el-button v-if="EXPORT" @click="exportRepList('pdf')" type="primary">導出執修報告(PDF)</el-button>
      </el-row>

      <el-row class="selects-row">
        <el-input class="selects-item"
                  v-model="batch_id"
                  @input="handleInputChange"
                  placeholder="執修單號碼">
        </el-input>
        <el-select v-model="position_new" placeholder="執修位置"
                   class="selects-item"
                   @change="handleChange">
          <el-option
            :key="-1"
            label="所有執修位置"
            value="">
          </el-option>
          <el-option
            v-for="item in positionList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <el-select v-model="type_new" placeholder="執修項目"
                   class="selects-item"
                   @change="handleChange">
          <el-option
            :key="-1"
            label="所有執修項目"
            value="">
          </el-option>
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <el-select v-model="subtype_new" placeholder="執修事項"
                   class="selects-item"
                   @change="handleChange">
          <el-option
            :key="-1"
            label="所有執修事項"
            value="">
          </el-option>
          <el-option
            v-for="item in subtypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

      </el-row>

      <el-row class="selects-row">
        <el-date-picker class="selects-item"
                  v-model="redo_date"
                  type="date"
                  @input="handleInputChange"
                  placeholder="需重做">
        </el-date-picker>
        <el-select v-model="material_order" placeholder="待料單"
                   class="selects-item"
                   @change="handleChange">
          <el-option
            :key="-1"
            label="所有待料單"
            value="">
          </el-option>
          <el-option
            v-for="item in materialList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-row>

      <el-row class="selects-row">
        <el-radio-group v-model="status" @change="handleChange">
          <el-radio-button label='' key="-1">所有</el-radio-button>
          <el-radio-button v-for="item in statusList"
                           :label="item.value" :key="item.value">
            {{item.label}}
          </el-radio-button>
        </el-radio-group>
      </el-row>
      <el-table :data="defectList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%"
                :row-style="tableRowStyle">
        <el-table-column prop="batch_id" label="執修單號碼"></el-table-column>
        <el-table-column prop="item_seq" label='事項'></el-table-column>
        <el-table-column prop="position_name" label="執修位置"></el-table-column>
        <el-table-column prop="type_name" label="執修項目"></el-table-column>
        <el-table-column prop="subtype_name" label="執修事項"> </el-table-column>
        <el-table-column prop="redo_date" label="需重做"></el-table-column>
        <el-table-column prop="material_order" label="待料單"></el-table-column>
        <el-table-column prop="material_items" label="待料項目"></el-table-column>
        <el-table-column prop="material_arrival_date" label="到料期"></el-table-column>
        <el-table-column prop="finish_date" label="實際完工日"></el-table-column>
        <el-table-column prop="remarks" label="備註"></el-table-column>
        <el-table-column prop="working_status" label="執修狀態"></el-table-column>
        <el-table-column prop="update_date" label="狀態日期"></el-table-column>
        <el-table-column prop="signoff_date" label="業主簽收日期"></el-table-column>
        <el-table-column prop="create_time" label="創建日期"></el-table-column>
        <el-table-column 
          label="操作">
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
  import { selectLists, defectData, defectDelete } from '@/api/defectReport/defectReportList';
  import { baseVanke } from '@/util/index';
  export default {
    name: "defectReport",
    data() {
        return {
          timer: null,

          range: [], //回報時間
          project_id: '', // 选中项目
          projectList: [], // 项目列表
          positionList: [],
          typeList: [],
          subtypeList: [],
          keyword: '', // 关键字
          status: '', // 选中状态
          statusList: [], // 状态列表
          position_new: '',
          type_new:'',
          subtype_new:'',
          redo_date:'',
          material_order:'',
          batch_id:'',

          length: 10, // 每页数量
          listLength: 0, // 全部条数
          currentPage: 0, // 当前页
          loading: false,

          VIEW: false,
          CREATE: false,
          EDIT: false,
          DELETE: false,
          EXPORT: false,
          defect: [],
        }
    },
    activated() {
      this.loading = true;
      // 請求选择菜单
      let self = this;
      self.initDetail();
      selectLists().then(function (response) {
        self.projectList = baseVanke.elFormatArray(response.data.project.data, 'id', 'name_c');
				self.positionList = baseVanke.elFormatArray(response.data.position.data, 'id', 'name_c');
				self.typeList = baseVanke.elFormatArray(response.data.type.data, 'id', 'name_c');
				self.subtypeList = baseVanke.elFormatArray(response.data.subtype.data, 'id', 'name_c');
				self.materialList = baseVanke.elFormatArray(response.data.material);
				self.statusList = baseVanke.elFormatArray(response.data.status);
        self.getListData();
      }).catch(function (error) {
        self.loading = false;
        self.$message.error(error.message);
        // self.$message.error('数据加載失敗，請重試！');
      });
    },
    methods: {
			initDetail() {
				this.batch_id = '';
        this.position_new = '';
        this.type_new = '';
        this.subtype_new = '';
        this.material_order = '';
        this.redo_date = '';
        this.status = '';
			},
      CreateNewDefect() {
        this.$router.push('/defect-report/new');
      },
      /* 获取列表数据 */
      getListData() {
        this.loading = true;
        const self = this;
        let resData = {
          start: (this.currentPage-1)*this.length, // 数据开始位置
          length: this.length, // 每页显示数量
          keyword: this.keyword, // 搜索关键字
          batch_id: this.batch_id, // 项目ID
          position_new: this.position_new,
          type_new: this.type_new,
          subtype_new: this.subtype_new,
          redo_date: this.redo_date, // 状态
          material_order: this.material_order, // 状态
          status: this.status, // 状态
          start_date: this.extendFormatSubmit(this.range,0),
          end_date: this.extendFormatSubmit(this.range,1),
        };
        defectData(resData).then(function(response){
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
            self.defectList = baseVanke.elDefectList( response.data.list, self.positionList, self.typeList, self.subtypeList, self.statusList);
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
        /*const day30 = new Date(new Date().getTime() - 30*24*60*60*1000);
        const day60 = new Date(new Date().getTime() - 60*24*60*60*1000);
        const submitDate = new Date(row.submit_date);
        const acceptDate ='';
        const completeDate ='';
        if(row.accept_date){
          const acceptDate = new Date(row.accept_date);
        }
        if(row.complete_date){
          const completeDate = new Date(row.complete_date);
        }



        if((!row.complete_date && row.accept_date && acceptDate < day60) || (!row.accept_date && submitDate < day60)){
          return 'background-color: #FF0000';
        }else if((!row.complete_date && row.accept_date && acceptDate < day30) || (!row.accept_date && submitDate < day30)){ 
          return 'background-color: #FFFF00';
        }*/

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
        const url = '/defect-report/export?batch_id=' + this.batch_id + '&position_new=' + this.position_new + '&type_new=' + this.type_new + '&subtype_new=' + this.subtype_new + '&redo_date=' + this.redo_date + '&material_order=' + this.material_order + '&status=' + this.status + '&type=' + fileType;
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
        this.getListData();
      },
      // 点击翻页、页码
      handlePageChange() {
        this.getListData();
      },
      // 查看详情
      handleDetail(row) {
        this.$router.push({
          path: '/defect-report/detail',
          query: {
            id: row.id
          }
        })
      },
      handleDelete(row) {
        this.$confirm('請注意此操作無法恢復，是否繼續?', '確認刪除操作', {
          confirmButtonText: '確認刪除',
          cancelButtonText: '取消操作',
          type: 'warning'
        }).then(() => {
          let resData = {
            id: row.id
          }
          defectDelete(resData).then(()=> {
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
// src/components/defectReport/defectReportList.vue