<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>執修管理</el-breadcrumb-item>
        <el-breadcrumb-item>編輯執修選項</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button v-if="CREATE" class="new-button" type="primary" @click="CreateNewDataItem()">新增缺陷選項</el-button>
    </section>
    <section>
      <el-row class="selects-row">
        <el-select v-model="category" placeholder="類別"
                   class="selects-item"
                   @change="handleChange">
          <el-option :key="-1" label="所有顯示類別" value=""></el-option>
          <el-option v-for="item in categoryList"
							:key="item.value"
							:label="item.label"
							:value="item.value"></el-option>
        </el-select>
        <el-input class="selects-item"
                  v-model="keyword"
                  @input="handleInputChange"
                  placeholder="請輸入">
        </el-input>
      </el-row>


      <el-table :data="dataItemList"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%"
                :row-style="tableRowStyle">
        <el-table-column prop="name_c" label="中文顯示"></el-table-column>
        <el-table-column prop="name_sc" label="中文顯示(簡體)"></el-table-column>
        <el-table-column prop="name_e" label="英文顯示"></el-table-column>
        <el-table-column prop="category" label="顯示類別"></el-table-column>
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
  import { itemlist, deleteItem } from '@/api/defectReportDataItem/defectReportDataItemList';
  import { baseVanke } from '@/util/index';
    export default {
        name: "defectReportDataItem",
      data() {
        return {
          category: '', 
          keyword: '',
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
          categoryList: [
            {
              id: 1,
              label: '執修位置',
              value: 1
            }, {
              id: 2,
              label: '執修項目',
              value: 2
            }, {
              id: 3,
              label: '執修事項',
              value: 3
            }
          ],
        }
    },
    activated() {
      this.loading = true;
      let self = this;
      self.getListData();
    },
    methods: {
      CreateNewDataItem() {
        this.$router.push('/defect-report-data-item/new');
      },
      /* 获取列表数据 */
      getListData() {
        this.loading = true;
        const self = this;
        let resData = {
          start: (this.currentPage-1)*this.length, // 数据开始位置
          length: this.length, // 每页显示数量
          category: this.category, // 搜索关键字
          keyword: this.keyword, // 搜索关键字
        };
        itemlist(resData).then(function(response){
          console.log(response);
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
            self.dataItemList = baseVanke.elDefectDataItemList(response.data.list, self.categoryList);
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
          path: '/defect-report-data-item/edit',
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
	  				item_id: row.id,
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
    }
  }
</script>

<style scoped>

</style>



// WEBPACK FOOTER //
// src/components/defectReportDataItem/defectReportDataItemList.vue