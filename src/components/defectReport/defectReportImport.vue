<template>
    <div class="page">
      <section class="page-header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
          <el-breadcrumb-item>執修管理</el-breadcrumb-item>
          <el-breadcrumb-item>執修導入</el-breadcrumb-item>
        </el-breadcrumb>
      </section>
      <el-form ref="defect"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="defect"
             :rules="rules"
             label-position="left" label-width="150px">
        <el-form-item label="項目" prop="project_id">
          <el-select v-model="defect.project_id"
                   placeholder="請選擇項目"
                   :disabled="disable" @change="updatetowerlist">
            <el-option
              v-for="item in projectList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="座數" prop="tower_number">
						<el-select v-model="defect.tower_number" id="tower" placeholder="請選擇" @change="updatefloorlist">
							<el-option v-for="item in towerList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
				</el-form-item>

				<el-form-item label="樓層" prop="floor_display_name">
						<el-select v-model="defect.floor_display_name" id="floor" placeholder="請選擇" @change="updateunitlist">
							<el-option v-for="item in floorList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
				</el-form-item>

				<el-form-item label="單位" prop="unit_number">
						<el-select v-model="defect.unit_number" id="unit_number" placeholder="請選擇" @change="updateOrderNumber">
							<el-option v-for="item in unitList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
				</el-form-item>

				<el-form-item label="單位ID" prop="unit_id" hidden="true">
						<el-input v-model="defect.unit_id" readonly="true"></el-input>
				</el-form-item>

				<el-form-item label="執修單號碼" prop="batch_id">
						<el-select v-model="defect.batch_id" id="batch_id" placeholder="請選擇" @change="handlechangetoRemove">
							<el-option v-for="item in batchidsList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
				</el-form-item>
      
				<el-form-item label="用戶編號" prop="club_id">
						<el-select v-model="defect.club_id" id="club_id" placeholder="請選擇" @change="getcustomerid">
							<el-option v-for="item in customerList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
				</el-form-item>

				<el-form-item label="用戶編號" prop="customer_id" hidden="true">
						<el-input v-model="defect.customer_id" :readonly="true"></el-input>
				</el-form-item>

        <el-form-item label="執修單導入" prop="defect_file" v-if="defect.unit_id.length">
            <el-upload v-loading="uploadLoading"
                  ref="defectUpload"
                  element-loading-text="文件上傳中"
                  name="upfile"
                  class="photo-uploader"
                  :class="isInline?'inline-block':''"
                  action="/upload/handle?action=uploadDefectReportXlsx"
                  accept=".xlsx"
                  :limit="parseInt('1')"
                  :on-success="uploadOnSuccess"
                  :on-progress="uploadOnProgress"
                  :on-change="uploadOnChange"
                  :on-error="uploadOnError"
                  :on-remove.self="handleRemove"
                  :before-upload="beforeUpload"
                  :data="{project_id:defect.project_id,
                          tower_number:defect.tower_number, 
                          floor_display_name:defect.floor_display_name, 
                          unit_number:defect.unit_number,
                          unit_id:defect.unit_id,
                          batch_id:defect.batch_id}">
              <i class="el-icon-plus uploader-icon"></i>
            </el-upload>
        </el-form-item>

        <el-form-item v-if="defect.unit_id.length">
            <el-button type="primary" :loading="submitLoading"  @click="downloadExample">執修單文件範本</el-button>
            <el-button type="primary" :loading="submitLoading"  @click="downloadMapping">執修單內容對照</el-button>
        </el-form-item>

        <el-form-item v-if="IMPORT">
            <el-button type="primary" :loading="submitLoading"  @click="onSubmit">提交</el-button>
        </el-form-item>

        <el-form-item prop="upload_message" :hidden=upload_message_hidden>
          <el-input class="vk-upload-text" type="textarea" v-model="upload_message" readonly="true"></el-input>
        </el-form-item>

        <el-form-item prop="error_message" :hidden=alert_message_hidden>
          <el-input class="vk-alert-text" type="textarea" v-model="error_message" readonly="true"></el-input>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import { save, edit } from '@/api/defectReport/defectReportDetail';
  import { baseVanke } from '@/util/index';
	import { getUnitInformation, getBatchInformation, getCustomerInfo } from '@/api/defectReportBatch/defectReportBatchNew';

  export default {
    name: "defectReportDetailImport",

    data() {
        return {
          isHidden: true,
          id: '',
          loading: false,
          submitLoading: false,
          uploadLoading : false,
          alert_message_hidden: true,
          upload_message_hidden: true,
          project_id:'',
          importlogid: '',
          create:0,
          update:0,
          rules: {
            project_id: [
              {required: true, message: '請選擇項目', trigger: 'change'}
            ],
            tower_number: [
              {required: true, message: '請選擇座數', trigger: 'change'}
            ],
            floor_display_name: [
              {required: true, message: '請選擇樓層', trigger: 'change'}
            ],
            unit_number: [
              {required: true, message: '請選擇單位', trigger: 'change'}
            ],
            club_id: [
              {required: true, message: '請選擇用戶編號', trigger: 'change'}
            ],
            batch_id: [
              {required: true, message: '請選擇執修單編號', trigger: 'change'}
            ],
            defect_file:[
              {required: true, message: '請添加執修文件', trigger: 'change'}
            ],
          },
          projectList: [],
          towerList: [],
          floorList: [],
          unitList: [],
          batchidsList: [],
          customerList: [],

          VIEW: false,
          CREATE: false,
          EDIT: false,
          DELETE: false,
          EXPORT: false,
          IMPORT: false,
          defect: {
            project_id: '',
            tower_number: '',
            floor_display_name: '',
            unit_number: '',
            unit_id: '',
            batch_id: '',
            defect_file:[],
            visible:'',
          }
        }
    },
    activated() {
      this.initDetail();
      this.getItemDetail();
    },
    deactivated() {
      this.initDetail();
    },
    methods: {
      /*
      * 初始化页面数据
      * */
      initDetail() {
        this.id = '';
        this.projectList = []; //项目列表
        this.towerList = []; //项目列表
        this.floorList = []; //项目列表
        this.unitList = []; //项目列表
        this.batchidsList = []; //项目列表
        this.defect = {
          project_id: '',
          tower_number: '',
          floor_display_name: '',
          unit_number: '',
          unit_id: '',
          batch_id: '',
          defect_file:[],
        };
        this.upload_message = '';
        this.error_message = '';
        this.alert_message_hidden = true;
        this.upload_message_hidden = true;
        this.importlogid = '';
        this.defect.defect_file = [];
        if (typeof this.$refs.defectUpload !== 'undefined'){
          this.$refs.defectUpload.clearFiles();
        }
        this.$refs.defect.resetFields();
      },
      /*
      * 获取当前页面的详细信息
      * */
      getItemDetail() {
        this.loading = true;
        let self = this;
        this.id = this.$route.query.id;
        let reqData = {
          id: this.id,
          create: this.new,
          update: this.update,
        };
        edit(reqData).then(function(response){
          if (!response.data.IMPORT) {
            self.$message.error('沒有權限！');
            self.$router.push('/defect-report/list');
            return;
          }
          self.VIEW = response.data.VIEW;
					self.CREATE = response.data.CREATE;
					self.EDIT = response.data.EDIT;
					self.DELETE = response.data.DELETE;
					self.EXPORT = response.data.EXPORT;
					self.IMPORT = response.data.IMPORT;
          self.projectList = baseVanke.elFormatArray(response.data.search.project,'id','name_c');
          if(self.id) {
            self.create = response.data.new;
            self.update = response.data.update;
          }
        }).catch(function(error) {
          self.$message.error(error.message);
        }).finally(function() {
          self.loading = false;
        });
      },

      beforeUpload(file){
         const isMatch = file.name.split('.')[1] === 'xlsx';
         if (!isMatch) {
          this.$message.error('上傳失敗！文件类型不允许');
        }
        return isMatch;
      },

      uploadOnProgress(){
        this.uploadLoading = true;
        this.error_message = '';
        this.upload_message = '';
        this.alert_message_hidden = true;
        this.upload_message_hidden = true;
      },

      uploadOnSuccess(res, fileList ) {
        this.uploadLoading = false;
        this.EDIT = true;
        this.defect.defect_file.push(res.data);
        this.$refs.defect.validateField('defect_file');
        this.error_message = '';
        this.upload_message = '';
        this.alert_message_hidden = true;
        this.upload_message_hidden = true;

        if(res.UnitNotFind == 0 && res.contentError==0){
            this.isHidden = false;
        }
        if (res.status == 0){
            this.IMPORT = true;
            this.upload_message_hidden = false;
            this.importlogid = res.importlogid;
            this.upload_message = 'Total Row Read:' + res.totalitem + "\n"
            + 'New Record: ' + res.new + "\n"
            + 'Update Record: ' + res.update + "\n"
            + 'Delete Record: ' + res.delete + "\n" 
            + 'Empty Row: ' + res.emptyrecord
        } else {
            this.IMPORT = false;
            this.alert_message_hidden = false;
            this.error_message = res.error_message;
            this.$message.error('文件內容出錯，請更正再上傳！');
        }
      },
      /*
      * 删除封面图片
      * */
      handlechangetoRemove(){
        let self = this;
        if (typeof self.$refs.defectUpload !== 'undefined'){
          self.handleRemove();
        }
      },
      handleRemove(type) {
        let self=this;
        this.defect.defect_file = [];
        // this.$refs.defect.validateField('defect_file');
        this.$refs.defectUpload.clearFiles();
        this.error_message = '';
        this.upload_message = '';
        this.alert_message_hidden = true;
        this.upload_message_hidden = true;
        this.isHidden = true;
        this.importlogid = '';
      },
      downloadExample () {   
        window.open(this.$route.path + "../../../defectReport/sample.xlsx", "_blank");    
      },

      downloadMapping() {
        window.open(this.$route.path + "../../../defectReport/mapping.xls", "_blank");
      },

      /**
       * 提交保存数据
       */
      onSubmit() {
        const self = this;
        this.$refs.defect.validate((valid)=>{
          if(valid) {
            this.submitLoading = true;
            let data = {
              project_id: this.defect.project_id,
              tower_number: this.defect.tower_number,
              floor_display_name: this.defect.floor_display_name,
              unit_number: this.defect.unit_number,
              unit_id: this.defect.unit_id,
              batch_id: this.defect.batch_id,
              club_id: this.defect.club_id,
              customer_id: this.defect.customer_id,
              importlogid: this.importlogid,
              defect_file: JSON.stringify(this.defect.defect_file),
            };
            if(this.id) {
              data.id =  this.id;
            }
            save(data).then(function(response) {
              self.$message({
                message: '提交成功',
                type: 'success'
              });
              self.$router.push('/defect-report/import');
            }).catch(function(error) {
              self.$message.error(error.message);
            }).finally(function() {
              self.submitLoading = false;
            });
          } else {
            self.$message.error('表單填寫有誤！');
            return false;
          }
        });
      },
			updatetowerlist() {
				this.loading = true;
				let reqdata = {
					project_id: this.defect.project_id
				};
				getUnitInformation(reqdata).then((response) =>{
					this.loading = false;
					this.towerList = baseVanke.elFormatArray(response.data.towerlist);
					this.floorList = [];
					this.unitList = [];
          this.batchidsList = [];
          this.customerList = [];
					this.defect.tower_number = '';
					this.defect.floor_display_name = '';
					this.defect.unit_number = '';
					this.defect.unit_id = '';
					this.defect.batch_id = '';
					this.defect.club_id = '';
					this.defect.customer_id = '';
          this.error_message = '';
          this.upload_message = '';
          this.alert_message_hidden = true;
          this.upload_message_hidden = true;
          this.handleRemove;
				}).catch((error) => {
					this.loading = false;
					this.$message.error(error.message);
				});
			},
			updatefloorlist() {
				this.loading = true;
				let reqdata = {
					project_id: this.defect.project_id,
					tower_number: this.defect.tower_number
				};
				getUnitInformation(reqdata).then((response) =>{
					this.loading = false;
					this.floorList = baseVanke.elFormatArray(response.data.floorlist);
					this.unitList = [];
          this.batchidsList = [];
          this.customerList = [];
					this.defect.floor_display_name = '';
					this.defect.unit_number = '';
					this.defect.unit_id = '';
					this.defect.batch_id = '';
					this.defect.club_id = '';
					this.defect.customer_id = '';
          this.error_message = '';
          this.upload_message = '';
          this.alert_message_hidden = true;
          this.upload_message_hidden = true;
          this.handleRemove;
				}).catch((error) => {
					this.loading = false;
					this.$message.error(error.message);
				});
			},
			updateunitlist() {
				this.loading = true;
				let reqdata = {
					project_id: this.defect.project_id,
					tower_number: this.defect.tower_number,
					floor_display_name: this.defect.floor_display_name
				};
				getUnitInformation(reqdata).then((response) =>{
					this.loading = false;
					this.unitList = baseVanke.elFormatArray(response.data.unitlist);
          this.batchidsList = [];
          this.customerList = [];
					this.defect.unit_number = '';
					this.defect.unit_id = '';      
					this.defect.batch_id = '';
					this.defect.club_id = '';
					this.defect.customer_id = '';
          this.error_message = '';
          this.upload_message = '';
          this.alert_message_hidden = true;
          this.upload_message_hidden = true;
          this.handleRemove;
				}).catch((error) => {
					this.loading = false;
					this.$message.error(error.message);
				});
			},
			updateOrderNumber(){
				this.loading = true;
				let reqdata = {
						project_id: this.defect.project_id,
						tower_number: this.defect.tower_number,
						floor_display_name: this.defect.floor_display_name,
						unit_number: this.defect.unit_number
				};
				getUnitInformation(reqdata).then((response) =>{
					this.defect.unit_id = response.data.unit_id;
					this.defect.club_id = '';
					this.defect.customer_id = '';
					this.customerList = baseVanke.elFormatArray(response.data.customerlist);
					if (this.customerList.length == 0){
						this.$message.error("找不到用戶!");
					}
					this.getBatchId();
				}).catch((error) => {
					this.loading = false;
					this.$message.error(error.message);
				});
			},
			getBatchId() {
				let reqdata = {
					project_id: this.defect.project_id,
					unit_id: this.defect.unit_id
				};
				getBatchInformation(reqdata).then((response) =>{
					this.loading = false;
					this.batchidsList = baseVanke.elFormatArrayNewBatch(response.data.batchidlist);
					this.defect.batch_id = '';
          this.error_message = '';
          this.upload_message = '';
          this.alert_message_hidden = true;
          this.upload_message_hidden = true;
          this.handleRemove;
				}).catch((error) => {
					this.loading = false;
					this.$message.error(error.message);
				});
			},
			getcustomerid(){
				this.loading = true;
				let reqdata ={
					club_id: this.defect.club_id
				}
        let self = this;
				getCustomerInfo(reqdata).then((response)=>{
					this.loading = false;
					this.defect.customer_id = response.data.id;
          this.error_message = '';
          this.upload_message = '';
          this.alert_message_hidden = true;
          this.upload_message_hidden = true;
          this.handleRemove;
				}).catch((error) => {
					this.loading = false;
					this.$message.error("Error! Customer cannot be found!");
					this.defect.customer_id = "";
			 	});
			}
    }
  }
</script>



<style scoped>
  .photo-uploader-icon {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
  }
  .photo-uploader-icon:hover {
      border-color: #409EFF;
  }

  .photo {
      width: 100px;
      height: 100px;
      display: block;
  }

 /* vietnamese */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 100;
      font-display: swap;
      src: local('Barlow Thin'), local('Barlow-Thin'), url(https://fonts.gstatic.com/s/barlow/v4/7cHrv4kjgoGqM7E3b_s0wH8RnA.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
    }
    /* latin-ext */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 100;
      font-display: swap;
      src: local('Barlow Thin'), local('Barlow-Thin'), url(https://fonts.gstatic.com/s/barlow/v4/7cHrv4kjgoGqM7E3b_s1wH8RnA.woff2) format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 100;
      font-display: swap;
      src: local('Barlow Thin'), local('Barlow-Thin'), url(https://fonts.gstatic.com/s/barlow/v4/7cHrv4kjgoGqM7E3b_s7wH8.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    /* vietnamese */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 300;
      font-display: swap;
      src: local('Barlow Light'), local('Barlow-Light'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3p-ks6FospT4.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
    }
    /* latin-ext */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 300;
      font-display: swap;
      src: local('Barlow Light'), local('Barlow-Light'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3p-ks6VospT4.woff2) format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 300;
      font-display: swap;
      src: local('Barlow Light'), local('Barlow-Light'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3p-ks51os.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    /* vietnamese */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('Barlow Regular'), local('Barlow-Regular'), url(https://fonts.gstatic.com/s/barlow/v4/7cHpv4kjgoGqM7E_A8s52Hs.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
    }
    /* latin-ext */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('Barlow Regular'), local('Barlow-Regular'), url(https://fonts.gstatic.com/s/barlow/v4/7cHpv4kjgoGqM7E_Ass52Hs.woff2) format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('Barlow Regular'), local('Barlow-Regular'), url(https://fonts.gstatic.com/s/barlow/v4/7cHpv4kjgoGqM7E_DMs5.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    /* vietnamese */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: local('Barlow Medium'), local('Barlow-Medium'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3_-gs6FospT4.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
    }
    /* latin-ext */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: local('Barlow Medium'), local('Barlow-Medium'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3_-gs6VospT4.woff2) format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: local('Barlow Medium'), local('Barlow-Medium'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3_-gs51os.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    /* vietnamese */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: local('Barlow Bold'), local('Barlow-Bold'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3t-4s6FospT4.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
    }
    /* latin-ext */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: local('Barlow Bold'), local('Barlow-Bold'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3t-4s6VospT4.woff2) format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
      font-family: 'Barlow';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: local('Barlow Bold'), local('Barlow-Bold'), url(https://fonts.gstatic.com/s/barlow/v4/7cHqv4kjgoGqM7E3t-4s51os.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }


    #preview-holder--3 #preview-discount {
        width: 1140px;
        height: 768px;
        margin: auto;
        background: #f9f9f9;
        z-index: 2000;
        padding: 30px;
        overflow: auto;
        position: fixed;
        top: calc(50% - 420px);
        left: calc(50% - 600px);
        font-size: 13px;    
        letter-spacing: 0.01em;
        color: #333;
    }

    #preview-holder--3 #preview-discount *{
      background-color: transparent !important;
    }

    #preview-holder--3 {
        position: fixed;
        content: "";
        display: inline-block;
        width: 100%;
        height: 100%;
        z-index: 1000;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
    }

    #preview-holder--3 #preview-discount .path {
        font-size: 14px;
        font-weight: bold;
    }

    #preview-holder--3 #preview-discount__title {
        text-align: left;
        margin: 30px auto;
        font-size: 38px;
        color: #b61600;
        font-weight: 300;
    }

    #preview-holder--3 #preview-discount .content-left,
    #preview-holder--3 #preview-discount .content-right {
        display: inline-block;
        width: 47%;
        vertical-align: top;
    }

    #preview-holder--3 #preview-discount .content-right {
        margin-left: 2%;
    }


    #preview-holder--3 #preview-discount .content-row-title {
        font-size: 16px;
        font-weight: bold;
        color: #ca0000;
        line-height: 24px;
    }

    #preview-holder--3 #preview-discount .content-row {
        margin: 0 0 25px;
        line-height: initial;
        font-size: 16px;
        font-weight: normal;
    }

    #preview-holder--3 #preview-discount .content-row-content {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        line-height: 27px;
    }

    #preview-holder--3 #preview-discount .custom-br {
        display: block;
        height: 1px;
        background-color: #ccc;
        margin: 40px auto 20px;
    }

    #preview-holder--3 #preview-discount #preview-discount__term {
        font-weight: bold;
        line-height: 1.5em;
        font-size: 16px;
    }

    #preview-holder--3 #preview-discount #preview-discount__term p {
        margin: 0 0 10px;
    }
    #preview-holder--3 img#banner-image {
        width: 100%;
    }

    #preview-holder--4 {
        position: fixed;
        content: "";
        display: none;
        width: 100%;
        height: 100%;
        z-index: 1000;
        top: 0;
        left: 0;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.5);
    }
    #preview-holder--4 .preview-discount-m {
        display: inline-block;
        width: 375px;
        height: 667px;
        background-color: #FFF;
        vertical-align: middle;
        margin: 0 28px;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    div#preview-holder--4:after {
        content: "";
        display: inline-block;
        height: 100%;
        vertical-align: middle;
        width: 1px;
    }
    #preview-holder--4 .banner-item span:nth-child(1) {
        background-color: #ca0000 !important;
    }
    #preview-holder--4 .preview-banner {
        overflow: hidden;
        width: 100%;
        height: 200px;
        position: relative;
    }
    #preview-holder--4 #m-discount-banner-img {
        width: 100%;
        height: auto;
    }
    #preview-holder--4 .banner-item {
        position: absolute;
        height: 18px;
        background-color: #FFF !important;
        width: 100%;
        left: 0;
        bottom: 0;
        text-align: center;
        padding-top: 4px;
        font-size: 0;
    }
    #preview-holder--4 .banner-item span {
        display: inline-block;
        width: 8px;
        height: 8px;
        background-color: #ccc !important;
        border-radius: 20px;
        margin: 5px 5px;
    }

    #preview-holder--4 #m-discount-title {
        padding: 10px 15px 8px;
        text-align: left;
        color: #CA0000;
        font-weight: bold;
        font-size: 17px;
    }

    #preview-holder--4 .content-row {
        padding: 4px 15px;
        text-align: left;
    }

    #preview-holder--4 .content-row .row-title {
        color: #CA0000;
        font-size: 14px;
        font-weight: bold;
        padding: 4px 0 4px;
    }
    #preview-holder--4 .content-row .row-content {
        font-size: 14px;
        line-height: 20px;
    }
    #preview-holder--4 #m-discount-desc {
        text-align: left;
        padding: 14px;
    }

    #preview-discount-m4 .term-header {
        text-align: center;
        background-color: #ca0000;
        color: #FFF;
        font-size: 18px;
        padding: 18px 0 12px;
        font-weight: bold;
    }
    #preview-discount-m4  #m-discount-term {
        text-align: left;
        padding: 14px;
    }

</style>



// WEBPACK FOOTER //
// src/components/defectReport/defectReportImport.vue