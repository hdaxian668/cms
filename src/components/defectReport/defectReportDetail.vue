<template>
	<div class="page">
		<section class="page-header">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
				<el-breadcrumb-item>執修管理</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/defect-report/list' }">執修單</el-breadcrumb-item>
				<el-breadcrumb-item>執修單詳情</el-breadcrumb-item>
			</el-breadcrumb>
		</section>

		<el-form ref="defect"
						 v-loading="loading"
						 element-loading-text="數據加載中"
						 :model="defect"
						 :rules="rules"
						 label-position="left" label-width="150px">
	        <div class="defect-container">
				<div class="defect-container-item item-left">
					<el-form-item label="項目名稱">
						<el-select v-model="defect.project_id" placeholder="項目名稱" disabled="disabled">
							<el-option v-for="item in projectList"
									:key="item.value"
									:label="item.label"
									:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="座數" >
						<el-select v-model="defect.tower_number" id="tower_number" ref="tower_number" placeholder="請選擇" disabled="disabled">
							<el-option v-for="item in towerList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="樓層" >
						<el-select v-model="defect.floor_display_name" id="floor_display_name" ref="floor_display_name" placeholder="請選擇" disabled="disabled">
							<el-option v-for="item in floorList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="單位" >
						<el-select v-model="defect.unit_number" id="unit_number" ref="unit_number" placeholder="請選擇" disabled="disabled">
							<el-option v-for="item in unitList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="樓盤編號">
						<el-input v-model="defect.unit_id" disabled="disabled"></el-input>
					</el-form-item>

					<el-form-item label="執修單號碼" >
						<el-select v-model="defect.batch_id" id="batch_id" placeholder="執修單號碼" disabled="disabled">
							<el-option v-for="item in batchidList"
									:key="item.value"
									:label="item.label"
									:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="VC ID">
						<el-input v-model="defect.club_id" disabled="disabled"></el-input>
					</el-form-item>

					<el-form-item label="事項" >
						<el-input v-model="defect.item_seq" disabled="disabled"></el-input>
					</el-form-item>

					<el-form-item label="執修位置">
						<el-select v-model="defect.position_new" placeholder="執修位置" disabled="disabled">
							<el-option v-for="item in positionList"
									:key="item.value"
									:label="item.label"
									:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="執修項目">
						<el-select v-model="defect.type_new" placeholder="執修項目" disabled="disabled">
							<el-option v-for="item in typeList"
									:key="item.value"
									:label="item.label"
									:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="執修事項">
						<el-select v-model="defect.subtype_new" placeholder="執修事項" disabled="disabled">
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
									:rows="4" disabled="disabled"></el-input>
					</el-form-item>
				</div>

				<div class="defect-container-item item-right">
					<el-form-item label="平面圖">
						<img-card :imgUrl="defect.floorplan" :disabled="disabled"></img-card>
					</el-form-item>
					<el-form-item label="照片">
						<img-card v-for="item in defect.photos" :imgUrl="item" :disabled="disabled"></img-card>
					</el-form-item>

					<el-form-item label="需重做" >
						<el-input v-model="defect.redo_date" disabled="disabled"></el-input>
					</el-form-item>

					<el-form-item label="待料單">
						<el-select v-model="defect.material_order" placeholder="待料單">
							<el-option key="-1" value=""></el-option>
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
						<el-radio-group v-model="defect.working_status">
							<el-radio-button v-for="item in statusList" :label="item.value" :key="item.value">
					            ({{item.value}}) {{item.label}} 
          					</el-radio-button>
        				</el-radio-group>
					</el-form-item>
					<el-form-item label="用戶狀態顯示" >
						<el-select v-model="defect.status" placeholder="用戶狀態顯示" disabled="true">
							<el-option v-for="item in clientstatusFullList"
									:key="item.value"
									:label="item.label"
									:value="item.value">
							</el-option>
						</el-select>
						<el-radio-group v-model="statusNew">
							<el-radio-button v-for="item in clientstatusList" :label="item.value" :key="item.value">
					            ({{item.value}}) {{item.label}} 
          					</el-radio-button>
        				</el-radio-group>
					</el-form-item>

					<el-form-item label="狀態日期" >
						<el-date-picker v-model="defect.update_date" type="datetime" :default-value="defaultDateValue"
								            value-format="yyyy-MM-dd HH:mm:ss" readonly="true"></el-date-picker>
					</el-form-item>

					<el-form-item label="業主簽收日期" >
						<el-date-picker v-model="defect.signoff_date" type="datetime" :default-value="defaultDateValue"
								            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					</el-form-item>
				</div>
				<div class="defect-container-item-full">
					<el-form-item v-if="(EDIT && id)">
						<el-button type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
					</el-form-item>
				</div>
			</div>
		</el-form>
	    <div>
		執修單狀態更新日誌
		<el-table :data="loglist"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%"
                :row-style="tableRowStyle">
			<el-table-column prop="original_status" label="原數據"></el-table-column>
    		<el-table-column prop="new_status" label="新數據"></el-table-column>
        	<el-table-column prop="updated_date" label="更新時間"></el-table-column>
        	<el-table-column prop="updated_by" label="更新用戶"></el-table-column>
    	</el-table>
		</div>
	</div>
</template>

<script>
	import { selectLists } from '@/api/defectReport/defectReportList';
	import { detail,changeStatus, saveDetail } from '@/api/defectReport/defectReportDetail';
	import { baseVanke } from '@/util/index';
	import ImgCard from "../common/ImgCard";
	export default {
		name: "defectReportDetail",
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
					working_status: [
            			{required: true, message: '請選擇執修狀態', trigger: 'change'}
            		],
				},

				projectList: [], // 项目列表
				statusList: [], // 状态列表
				positionList: [], // 缺陷位置
				typeList: [], // 缺陷位置
				subTypeList: [], // 缺陷位置
				clientstatusFullList: [],
				clientstatusList: [],
				clientstatusList_accept: [],
				clientstatusList_completed: [],
				clientstatusList_clientaccept: [],

				VIEW: false,
          		CREATE: false,
          		EDIT: false,
          		DELETE: false,
          		EXPORT: false,
				defect: {
					id: "",
					project_id: "",
					customer_id: "",
					position: "",
					status: "",
					photos: [],
					floorplan: "",
					description: "",
					star: "",
					submit_date: "",
					accept_date: "",
					complete_date: "",
					deleted: "0",
					phone: "",
					username: "",
					remark:"",
					alter_date:"",
					alter_by:"",
				},
				loglist: [],
				btnList: [],
				statusNew: '',
				statusNew_check: false
			}
		},
		activated() {
			this.loading = true;
			this.initDetail();
			// 請求选择菜单
			const self = this;
			selectLists().then((response) =>{
				this.projectList = baseVanke.elFormatArray(response.data.project.data, 'id', 'name_c');
				this.positionList = baseVanke.elFormatArray(response.data.position.data, 'id', 'name_c');
				this.typeList = baseVanke.elFormatArray(response.data.type.data, 'id', 'name_c');
				this.subTypeList = baseVanke.elFormatArray(response.data.subtype.data, 'id', 'name_c');
				this.statusList = baseVanke.elFormatArray(response.data.status);
				this.clientstatusList_accept = [{'value': '1', 'label': '已受理'}, {'value': '5', 'label': '不受理'}];
				this.clientstatusList_completed = [{'value': '2', 'label': '執修完成待簽單'}];
				this.clientstatusList_clientaccept = [{'value': '3', 'label': '執修完成已簽單'}, {'value': '4', 'label': '不接受'}];
				this.clientstatusFullList = baseVanke.elFormatArray(response.data.clientstatus);
				this.clientstatusList = baseVanke.elFormatArray(response.data.clientstatus);
				this.materialList = baseVanke.elFormatArray(response.data.material);
				this.getItemDetail();
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
				this.statusNew = '',
				this.clientstatusList = []
				this.statusNew_check = false

			},
			/*
		 * 获取当前页面的详细信息
		 * */
			getItemDetail() {
				this.id = this.$route.query.id;
				if (this.id) {
					this.loading = true;
					let reqData = {
						id: this.id
					};
			        const self = this;
					detail(reqData).then((response)=>{
						if (!response.data.VIEW) {
							self.$message.error('沒有權限！');
							self.$router.push('/defect-report/list');
							return;
						}
						this.VIEW = response.data.VIEW;
						this.CREATE = response.data.CREATE;
						this.EDIT = response.data.EDIT;
						this.DELETE = response.data.DELETE;
						this.EXPORT = response.data.EXPORT;
						this.defect = Object.assign({}, this.defect, response.data.data);
						this.defect.star = parseInt(this.defect.star);
						this.defect.photos = JSON.parse(this.defect.photos);
						this.btnList = response.data.btn;  
						this.loglist = baseVanke.elDefectLogList( response.data.log, this.statusList);
						if ((this.defect.status == '0')){
							this.clientstatusList = this.clientstatusList_accept;
							this.statusNew_check = true;
						}
						if ((this.defect.status == '5')){
							this.clientstatusList = [];
							this.statusNew_check = false;
						}
						if (this.defect.status == '1'){
							this.clientstatusList = this.clientstatusList_completed;
							this.statusNew_check = true;
						}
						if ((this.defect.status == '2')){
							this.clientstatusList = [];
							this.statusNew_check = false;
						}
						if ((this.defect.status == '3') || (this.defect.status == '4')){
							this.clientstatusList = [];
							this.statusNew_check = false;
						}
						this.loading = false;
					}).catch((error) =>{
						this.loading = false;
						this.$message.error(error.message);
					});
				}
			},
			/**
			 * 操作
			 * @param value
			 */
			onStatusChange(value) {
				let data = {
					id: this.id,
					status: value,
				};
				changeStatus(data).then( ()=> {
					this.$message({
						message: '提交成功',
						type: 'success'
					});
					this.$router.push('/defect-report/list');
				}).catch( (error)=> {
					thia.$message.error(error.message);
				})
			},

			onSubmit() {
				this.$refs.defect.validate((valid)=>{
					if(valid) {					
						this.submitLoading = true;
						if (this.statusNew_check == true) {
							if (this.statusNew != ''){
								this.defect.status = this.statusNew;
							}
						}
		            	let data = {
			              	id: this.id,
							material_order: this.defect.material_order,
							material_items: this.defect.material_items,
							material_arrival_date: this.defect.material_arrival_date,
							finish_date: this.defect.finish_date,
							signoff_date: this.defect.signoff_date,
		    	            working_status: this.defect.working_status,// 收件箱
		        	        status: this.defect.status,
							remark: this.defect.remark,
							description: this.defect.description,
			            };
						saveDetail(data).then((response)=>{
							this.$message({
								type: 'success',
								message: '提交成功!'
							});
							this.getItemDetail();
						}).catch((error)=>{
	            		    this.$message.error(error.message);
		            	}).finally(()=> {
		                	this.submitLoading = false;
	    	        	});
					} else {
						this.submitLoading = false;
						self.$message.error('表單填寫有誤！');
			            return false;
					}
				})

	        },



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
// src/components/defectReport/defectReportDetail.vue