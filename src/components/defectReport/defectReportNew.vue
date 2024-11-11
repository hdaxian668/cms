<template>
	<div class="page">
		<section class="page-header">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/defect-report/list' }">執修管理</el-breadcrumb-item>
				<el-breadcrumb-item>新增執修</el-breadcrumb-item>
			</el-breadcrumb>
		</section>

		<el-form ref="defect"
					v-loading="loading"
					element-loading-text="數據加載中"
					:model="defect"
					:rules="rules"
					label-position="left"
					label-width="150px">
	        <div class="defect-container">
				<div class="defect-container-item item-left">
					<el-form-item label="項目名稱" prop="project_id">
						<el-select v-model="defect.project_id" placeholder="項目名稱" @change="updatetowerlist">
							<el-option v-for="item in projectList"
									:key="item.value"
									:label="item.label"
									:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="座數" prop="tower_number">
						<el-select v-model="defect.tower_number" id="tower_number" ref="tower_number" placeholder="請選擇" @change="updatefloorlist">
							<el-option v-for="item in towerList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="樓層" prop="floor_display_name">
						<el-select v-model="defect.floor_display_name" id="floor_display_name" ref="floor_display_name" placeholder="請選擇" @change="updateunitlist">
							<el-option v-for="item in floorList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="單位" prop="unit_number">
						<el-select v-model="defect.unit_number" id="unit_number" ref="unit_number" placeholder="請選擇" @change="updateOrderNumber">
							<el-option v-for="item in unitList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="樓盤編號">
						<el-input v-model="defect.unit_id" :readonly="true"></el-input>
					</el-form-item>

					<el-form-item label="執修單號碼" prop="batch_id">
						<el-select v-model="defect.batch_id" id="batch_id" placeholder="執修單號碼" @change="getItemSeq">
							<el-option v-for="item in batchidList"
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

					<el-form-item label="用戶編號" hidden="true">
						<el-input v-model="defect.customer_id" :readonly="true"></el-input>
					</el-form-item>

					<el-form-item label="事項" >
						<el-input v-model="defect.item_seq" :readonly="true"></el-input>
					</el-form-item>

					<el-form-item label="執修位置" prop="position">
						<el-select v-model="defect.position" placeholder="執修位置">
							<el-option v-for="item in positionList"
									:key="item.value"
									:label="item.label"
									:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="執修項目" prop="type">
						<el-select v-model="defect.type" placeholder="執修項目">
							<el-option v-for="item in typeList"
									:key="item.value"
									:label="item.label"
									:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="執修事項" prop="subtype">
						<el-select v-model="defect.subtype" placeholder="執修事項">
							<el-option v-for="item in subTypeList"
									:key="item.value"
									:label="item.label"
									:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>	
					<el-form-item label="執修描述">
						<el-input v-model="defect.description"
									type="textarea" 
									:rows="4"></el-input>
					</el-form-item>
				</div>
				<div class="defect-container-item item-right">
					<el-form-item label="待料單">
						<el-select v-model="defect.material_order" placeholder="待料單">
							<el-option v-for="item in materialList"
									:key="item.value"
									:label="item.label"
									:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="待料項目">
						<el-input v-model="defect.material_items"
									type="textarea"
									:rows="4"></el-input>
					</el-form-item>

					<el-form-item label="到料期" >
						<el-date-picker v-model="defect.material_arrival_date" type="datetime" :default-value="defaultDateValue"
								            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					</el-form-item>
					<el-form-item label="實際完工日" >
						<el-date-picker v-model="defect.finish_date" type="datetime" :default-value="defaultDateValue"
								            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					</el-form-item>
					<el-form-item label="備註">
						<el-input v-model="defect.remark"
									type="textarea" 
									:rows="4"></el-input>
					</el-form-item>

					<el-form-item label="執修狀態" prop="working_status" >
						<el-select v-model="defect.working_status" placeholder="請選擇執修狀態">
							<el-option v-for="item in statusList"
									:key="item.value"
									:label="item.label"
									:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="用戶狀態顯示" >
						<el-select v-model="defect.status" placeholder="用戶狀態顯示">
							<el-option v-for="item in clientstatusList"
									:key="item.value"
									:label="item.label"
									:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="業主簽收日期" >
						<el-date-picker v-model="defect.signoff_date" type="datetime" :default-value="defaultDateValue"
								            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					</el-form-item>
				</div>
				<div class="defect-container-item-full">
					<el-form-item>
						<el-button v-if="CREATE" type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
					</el-form-item>
				</div>
			</div>




		</el-form>
	</div>
</template>

<script>
	import { saveNew } from '@/api/defectReport/defectReportDetail';
	import { getUnitInformation, getBatchInformation, getCustomerInfo, getBatchClubId } from '@/api/defectReportBatch/defectReportBatchNew';
	import { getlist, getNextItemSeq } from '@/api/defectReport/defectReportList';
	import { baseVanke } from '@/util/index';
	import ImgCard from "../common/ImgCard";
	export default {
		name: "defectReportNew",
		components:{
			ImgCard,
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
					batch_id: [
            			{required: true, message: '請選擇批量編號', trigger: 'change'}
            		],
            		club_id: [
						{required: true, message: '請輸入用戶編號', trigger: 'blur'}
            		],
					position: [
            			{required: true, message: '請選擇執修項目', trigger: 'change'}
            		],
					type: [
            			{required: true, message: '請選擇執修項目', trigger: 'change'}
            		],
					subtype: [
            			{required: true, message: '請選擇執修事項', trigger: 'change'}
            		],
					working_status: [
            			{required: true, message: '請選擇執修狀態', trigger: 'change'}
            		],
				},

				statusList: [],
				projectList: [],
				towerList: [],
				floorList: [],
				unitList: [],
				positionList: [],
				typeList: [],
				subTypeList: [],
				materialList: [],

				VIEW: false,
          		CREATE: false,
          		EDIT: false,
          		DELETE: false,
          		EXPORT: false,
				defect: {
					project_id: '',
					tower_number: '',
					floor_display_name: '',
					unit_number: '',
					unit_id: '',
					batch_id: '',
					item_seq: '',
					club_id: '',
					customer_id: '',
					position: '',
					type: '',
					subtype: '',
					description: '',
					material_order: '',
					material_items: '',
					material_arrival_date: '',
					finish_date: '',
					remark: '',
					status: '',
					signoff_date: '',
				},
				btnList: [],
			}
		},
		resetForm () {
			return {
				defect: {
					project_id: '',
					tower_number: '',
					floor_display_name: '',
					unit_number: '',
					unit_id: '',
					batch_id: '',
					item_seq: '',
					club_id: '',
					customer_id: '',
					position: '',
					type: '',
					subtype: '',
					description: '',
					material_order: '',
					material_items: '',
					material_arrival_date: '',
					finish_date: '',
					remark: '',
					status: '',
					working_status: '',
					signoff_date: '',
				},
			}
		},
		activated() {
			this.initDetail();
			this.loading = true;
			const self = this;
			getlist().then((response) =>{
				if (!response.data.CREATE) {
					self.$message.error('沒有權限！');
					self.$router.push('/defect-report/list');
					return;
				}
				self.VIEW = response.data.VIEW;
				self.CREATE = response.data.CREATE;
				self.EDIT = response.data.EDIT;
				self.DELETE = response.data.DELETE;
				self.EXPORT = response.data.EXPORT;
				this.loading = false;
				this.statusList = baseVanke.elFormatArray(response.data.status);
				this.projectList = baseVanke.elFormatArray(response.data.project.data, 'id', 'name_c');
				this.positionList = baseVanke.elFormatArray(response.data.position.data, 'id', 'name_c');
				this.typeList = baseVanke.elFormatArray(response.data.type.data, 'id', 'name_c');
				this.subTypeList = baseVanke.elFormatArray(response.data.subtype.data, 'id', 'name_c');
				this.materialList = baseVanke.elFormatArray(response.data.material);
				this.clientstatusList = baseVanke.elFormatArray(response.data.clientstatus);
			}).catch((error) => {
				this.loading = false;
				this.$message.error(error.message);
			});
		},
		deactivated() {
			this.resetForm('defect');
		},
		methods: {
			// 重置页面数据
			resetForm(formName) {
				this.projectList = []; // 项目列表
				this.statusList = [];// 状态列表
				this.$refs[formName].resetFields();
			},
			initDetail() {
				this.id = '';
				this.defect = {
					project_id: '',
					tower_number: '',
					floor_display_name: '',
					unit_number: '',
					unit_id: '',
					batch_id: '',
					item_seq: '',
					club_id: '',
					customer_id: '',
					position: '',
					type: '',
					subtype: '',
					description: '',
					material_order: '',
					material_items: '',
					material_arrival_date: '',
					finish_date: '',
					remark: '',
					status: '',
					working_status: '',
					signoff_date: '',
				}
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
					this.defect.tower_number = '';
					this.defect.floor_display_name = '';
					this.defect.unit_number = '';
					this.defect.unit_id = '';
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
					this.defect.floor_display_name = '';
					this.defect.unit_number = '';
					this.defect.unit_id = '';
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
					this.defect.unit_number = ''
					this.defect.unit_id = ''      
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
					this.customerList = baseVanke.elFormatArray(response.data.customerlist);
					if (this.customerList.length == 0){
						this.$message.error("No Customer Found!");
					}
					this.getBatchId();
				}).catch((error) => {
					this.loading = false;
					this.$message.error(error.message);
				});
			},
			getcustomerid(){
				let reqdata ={
					club_id: this.defect.club_id
				}
				getCustomerInfo(reqdata).then((response)=>{
					this.loading = false;
					this.defect.customer_id = response.data.id;
				}).catch((error) => {
					this.loading = false;
					this.$message.error("Error! Customer cannot be found!");
					this.defect.customer_id = "";
			 	});
			},

			getBatchId() {
				let reqdata = {
					project_id: this.defect.project_id,
					unit_id: this.defect.unit_id
				};
				getBatchInformation(reqdata).then((response) =>{
					this.loading = false;
					this.batchidList = baseVanke.elFormatArray(response.data.batchidlist);
					this.defect.batch_id = '';
				}).catch((error) => {
					this.loading = false;
					this.$message.error(error.message);
				});
			},
			getItemSeq(){
				let reqdata = {
					batch_id: this.defect.batch_id
				};
				getNextItemSeq(reqdata).then((response) =>{
					this.loading = false;
					this.defect.item_seq = response.data.item_seq;
				}).catch((error) => {
					this.loading = false;
					this.$message.error(error.message);
				});
			},
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
							customer_id: this.defect.customer_id,
							batch_id: this.defect.batch_id,
							item_seq: this.defect.item_seq,
							position_new: this.defect.position,
							type_new: this.defect.type,
							subtype_new: this.defect.subtype,
							description: this.defect.description,
							material_order: this.defect.material_order,
							material_items: this.defect.material_items,
							material_arrival_date: this.defect.material_arrival_date,
							finish_date: this.defect.finish_date,
							remark: this.defect.remark,
							working_status: this.defect.working_status,
							status: this.defect.status,
							signoff_date: this.defect.signoff_date
	              		};
			            saveNew(data).then((response)=>{
	                		this.$message({
	                  			type: 'success',
	                  			message: '提交成功!'
	                		});
							self.$router.push('/defect-report/list');
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
			}
		}
	}
</script>

<style scoped>
  .defect-container {
    width: 100%;
  }

  .defect-container-item {
    width: 48%;
    display: inline-block;
    vertical-align: top;
  }

  .defect-container-item-full {
    width: 98%;
    display: inline-block;
    vertical-align: top;
	text-align: center;
  }
</style>



// WEBPACK FOOTER //
// src/components/defectReport/defectReportNew.vue