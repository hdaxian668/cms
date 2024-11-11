<template>
    <div class="page">
		<section class="page-header">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
				<el-breadcrumb-item>執修管理</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/defect-report-batch/list' }">執修單總表</el-breadcrumb-item>
				<el-breadcrumb-item>新增執修單</el-breadcrumb-item>
			</el-breadcrumb>
		</section>

		<el-form ref="defectbatch"
						 v-loading="loading"
						 element-loading-text="數據加載中"
						 :model="defectbatch"
						 :rules="rules"
						 label-position="left" label-width="150px">
	        <div class="defectbatch-container">
				<div class="defectbatch-container-item item-left">
					<el-form-item label="項目" prop="project_id">
						<el-select v-model="defectbatch.project_id" placeholder="請選擇" @change="updatetowerlist">
							<el-option v-for="item in projectList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="座數" prop="tower_number" >
						<el-select v-model="defectbatch.tower_number" id="tower_number" placeholder="請選擇" @change="updatefloorlist">
							<el-option v-for="item in towerList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="樓層" prop="floor_display_name" >
						<el-select v-model="defectbatch.floor_display_name" id="floor_display_name" placeholder="請選擇" @change="updateunitlist">
							<el-option v-for="item in floorList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="單位" prop="unit_number" >
						<el-select v-model="defectbatch.unit_number" id="unit_number" placeholder="請選擇" @change="updateOrderNumber">
							<el-option v-for="item in unitList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="樓盤編號" hidden="true" >
						<el-input v-model="defectbatch.unit_id" :readonly="true"></el-input>
					</el-form-item>

					<el-form-item label="Hot Case" readonly="true">
						<el-select v-model="defectbatch.is_hotcase" id="is_hotcase" readonly="true" disabled="true">
							<el-option key="-1" label="" value=""></el-option>
							<el-option v-for="item in yesnoList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="用戶編號" prop="club_id" >
						<el-select v-model="defectbatch.club_id" id="club_id" placeholder="請選擇" @change="getcustomerid">
							<el-option v-for="item in customerList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="用戶ID" hidden="true">
						<el-input v-model="defectbatch.customer_id" :readonly="true" ref="customer_id"></el-input>
					</el-form-item>

					<el-form-item label="Batch No." hidden="true">
						<el-input v-model="defectbatch.batch_seq" :readonly="true"></el-input>
					</el-form-item>

					<el-form-item label="執修單號碼"  hidden="true">
						<el-input v-model="defectbatch.batch_id" :readonly="true"></el-input>
					</el-form-item>

					<el-form-item label="執修表遞交日" prop="submission_date">
						<el-date-picker v-model="defectbatch.submission_date" type="datetime" :default-value="defaultDateValue"
								            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					</el-form-item>

					<el-form-item label="大門匙/電約單" prop="enter_method">
					    <el-radio-group v-model="defectbatch.enter_method">
							<el-radio-button v-for="item in enter_methodList" :label="item.value" :key="item.value">{{item.label}}</el-radio-button>
						</el-radio-group>
					</el-form-item>
				</div>

				<div class="defectbatch-container-item item-right">					
					<el-form-item label="檢查日期">
						<el-date-picker v-model="defectbatch.checking_date" type="datetime" :default-value="defaultDateValue"
								            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					</el-form-item>

					<el-form-item label="檢查人">
						<el-input v-model="defectbatch.checker"></el-input>
					</el-form-item>
					<el-form-item label="負責OSR">
						<el-input v-model="defectbatch.osr_in_charge"></el-input>
					</el-form-item>
					<el-form-item label="對單方式">
					    <el-radio-group v-model="defectbatch.checking_method">
							<el-radio-button v-for="item in checkingmethodList" :label="item.value" :key="item.value">{{item.label}}</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="對單日期">
						<el-date-picker v-model="defectbatch.order_checking_date" type="datetime" :default-value="defaultDateValue"
								            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					</el-form-item>
					<el-form-item label="業主簽單日期">
						<el-date-picker v-model="defectbatch.signoff_date" type="datetime" :default-value="defaultDateValue"
								            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					</el-form-item>
					<el-form-item label="發信種類">
					    <el-radio-group v-model="defectbatch.letter_type">
							<el-radio-button :label="item.value" :key="item.value" v-for="item in lettertypeList">{{item.label}}</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="發信日期">
						<el-date-picker v-model="defectbatch.letter_issue_date" type="datetime" :default-value="defaultDateValue"
								            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					</el-form-item>
				</div>

				<div class="defectbatch-container-item-full">
					<el-form-item>
						<el-button v-if="CREATE" type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
					</el-form-item>
				</div>
			</div>
		</el-form>
</template>

<script>
	import { save, getlist, getUnitInformation, getCustomerInfo } from '@/api/defectReportBatch/defectReportBatchNew';
	import { baseVanke } from '@/util/index';
	export default {
		name: "defectReportBatchNew",
		components: {

		},
		data() {
			return {
				id: '',
				loading: false,
				submitLoading: false,
				disabled: true,
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
						{required: true, message: '請輸入用戶編號', trigger: 'change'}
            		],
            		submission_date: [
						{required: true, message: '請輸入執修表遞交日', trigger: 'change'}
            		],
            		enter_method: [
						{required: true, message: '請輸入大門匙/電約單', trigger: 'change'}
            		],
				},

				VIEW: false,
          		CREATE: false,
          		EDIT: false,
          		DELETE: false,
          		EXPORT: false,
				defectbatch: {
					project_id: "",
				    tower_number: "",
					floor_display_name: "",
					unit_number: "",
					unit_id: "",
					batch_seq: "",
					batch_id: "",
					submission_date: "",
					enter_method: "",
					submission_channel: "",
					checking_date: "",
					checker: "",
					osr_in_charge: "",
					checking_method: "",
					order_checking_date: "",
					signoff_date: "",
					letter_type: "",
					letter_issue_date:"",
					customer_id: "",

					is_hotcase:"",

				},
				towerList: [],
				unitList: [],
				floorList: [],
				projectList: [],
				customerList: [],
				enter_methodList: [],
				checkingmethodList: [],
				lettertypeList: [],
				submissionChannelList: [],
				yesnoList: [],
			}
		},
		activated() {
			getlist().then((response) =>{
				const self = this;
				console.log(response);
				self.VIEW = response.data.VIEW;
				self.CREATE = response.data.CREATE;
				self.EDIT = response.data.EDIT;
				self.DELETE = response.data.DELETE;
				self.EXPORT = response.data.EXPORT;
				self.IMPORT = response.data.IMPORT;
				this.projectList = baseVanke.elFormatArray(response.data.project.data, 'id', 'name_c');
				this.enter_methodList = baseVanke.elFormatArray(response.data.enter_method);
				this.checkingmethodList = baseVanke.elFormatArray(response.data.checking_method);
				this.lettertypeList = baseVanke.elFormatArray(response.data.letter_type);
				this.submissionChannelList = baseVanke.elFormatArray(response.data.submission_channel);
				this.yesnoList = baseVanke.elFormatArray(response.data.yesno);
				this.initDetail();
			}).catch((error) => {
				this.loading = false;
				this.$message.error(error.message);
			});
		},
		deactivated() {
			this.initDetail();
			this.resetForm("defectbatch");
		},
		methods: {
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			initDetail() {
				this.id = '';
				this.defectbatch = {
					project_id: "",
				    tower_number: "",
					floor_display_name: "",
					unit_number: "",
					unit_id: "",
					batch_seq: "",
					batch_id: "",
					submission_date: "",
					enter_method: "",
					submission_channel: "1",
					checking_date: "",
					checker: "",
					osr_in_charge: "",
					checking_method: "",
					order_checking_date: "",
					signoff_date: "",
					letter_type: "",
					letter_issue_date:"",
					customer_id: "",

					is_hotcase:"",
				}
			},
			onSubmit() {
				const self = this;
				this.$refs.defectbatch.validate((valid)=>{
        			if(valid) {
		            	this.submitLoading = true;
		            	let data = {
							project_id: this.defectbatch.project_id,
							tower_number: this.defectbatch.tower_number,
							floor_display_name: this.defectbatch.floor_display_name,
							unit_number: this.defectbatch.unit_number,
							unit_id: this.defectbatch.unit_id,
							customer_id: this.defectbatch.customer_id,
							batch_id: this.defectbatch.batch_id,
							batch_seq: this.defectbatch.batch_seq,
							submission_date: this.defectbatch.submission_date,
							enter_method: this.defectbatch.enter_method,
							submission_channel: this.defectbatch.submission_channel,
							checking_date: this.defectbatch.checking_date,
							checker: this.defectbatch.checker,
							osr_in_charge: this.defectbatch.osr_in_charge,
							checking_method: this.defectbatch.checking_method,
							order_checking_date: this.defectbatch.order_checking_date,
							signoff_date: this.defectbatch.signoff_date,
							letter_type: this.defectbatch.letter_type,
							letter_issue_date: this.defectbatch.letter_issue_date,
	        	    	};
						save(data).then((response)=>{
	                		this.$message({
								type: 'success',
	                			message: '提交成功!'
	                		});
							this.$router.push('/defect-report-batch/list');
	            		}).catch((error)=>{
	                		this.$message.error(error.message);
	            		}).finally(()=> {
	            			this.submitLoading = false;
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
					project_id: this.defectbatch.project_id
				};
				getUnitInformation(reqdata).then((response) =>{
					this.loading = false;
					this.towerList = baseVanke.elFormatArray(response.data.towerlist);
					this.floorList = [];
					this.unitList = [];
					this.customerList = [];
					this.defectbatch.tower_number = '';
					this.defectbatch.floor_display_name = '';
					this.defectbatch.unit_number = '';
					this.defectbatch.unit_id = '';
					this.defectbatch.club_id = '';
					this.defectbatch.customer_id = '';
				}).catch((error) => {
					this.loading = false;
					this.$message.error(error.message);
				});
			},
			updatefloorlist() {
				this.loading = true;
				let reqdata = {
					project_id: this.defectbatch.project_id,
					tower_number: this.defectbatch.tower_number
				};
				getUnitInformation(reqdata).then((response) =>{
					this.loading = false;
					this.floorList = baseVanke.elFormatArray(response.data.floorlist);
					this.unitList = [];
					this.customerList = [];
					this.defectbatch.floor_display_name = '';
					this.defectbatch.unit_number = '';
					this.defectbatch.unit_id = '';
					this.defectbatch.club_id = '';
					this.defectbatch.customer_id = '';
				}).catch((error) => {
					this.loading = false;
					this.$message.error(error.message);
				});
			},
			updateunitlist() {
				this.loading = true;
				let reqdata = {
					project_id: this.defectbatch.project_id,
					tower_number: this.defectbatch.tower_number,
					floor_display_name: this.defectbatch.floor_display_name
				};
				getUnitInformation(reqdata).then((response) =>{
					this.loading = false;
					this.unitList = baseVanke.elFormatArray(response.data.unitlist);
					this.customerList = [];
					this.defectbatch.unit_number = '';
					this.defectbatch.unit_id = '';
					this.defectbatch.club_id = '';
					this.defectbatch.customer_id = '';
				}).catch((error) => {
					this.loading = false;
					this.$message.error(error.message);
				});
			},
			updateOrderNumber(){
				this.loading = true;
				let reqdata = {
						project_id: this.defectbatch.project_id,
						tower_number: this.defectbatch.tower_number,
						floor_display_name: this.defectbatch.floor_display_name,
						unit_number: this.defectbatch.unit_number
				};
				getUnitInformation(reqdata).then((response) =>{
					this.loading = false;
					this.defectbatch.batch_id = response.data.next_batch_number.toString();
					while (this.defectbatch.batch_id.length < 4) {
						this.defectbatch.batch_id = "0" + this.defectbatch.batch_id;
					};
					this.defectbatch.unit_id = response.data.unit_id;
					this.defectbatch.batch_id = response.data.unit_id + "-" + this.defectbatch.batch_id;
					this.defectbatch.batch_seq = response.data.next_batch_number;
					this.defectbatch.is_hotcase = response.data.is_hotcase;
					this.defectbatch.club_id = '';
					this.defectbatch.customer_id = '';
					this.customerList = baseVanke.elFormatArray(response.data.customerlist);
					if (this.customerList.length == 0){
						this.$message.error("No Customer Found!");
					}
				}).catch((error) => {
					this.loading = false;
					this.$message.error(error.message);
				});
			},
			getcustomerid(){
				let reqdata ={
					club_id: this.defectbatch.club_id
				}
				getCustomerInfo(reqdata).then((response)=>{
					this.loading = false;
					this.defectbatch.customer_id = response.data.id;
				}).catch((error) => {
					this.loading = false;
					this.$message.error("Error! Customer cannot be found!");
					this.defectbatch.customer_id = "";
			 	});
			}
		}
	}
</script>

<style scoped>
  .defectbatch-container {
    width: 100%;
  }

  .defectbatch-container-item {
    width: 48%;
    display: inline-block;
    vertical-align: top;
  }
  .defectbatch-container-item-full {
    width: 98%;
    display: inline-block;
    vertical-align: top;
	text-align: center;
  }
</style>



// WEBPACK FOOTER //
// src/components/defectReportBatch/defectReportBatchNew.vue