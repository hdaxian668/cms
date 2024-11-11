<template>
	<div class="page">
		<section class="page-header">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
				<el-breadcrumb-item>執修管理</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/defect-report-batch/list' }">執修單總表</el-breadcrumb-item>
				<el-breadcrumb-item>執修單總表詳情</el-breadcrumb-item>
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
					<el-form-item label="項目" ><el-input v-model="defectbatch.name_c" disabled="disabled"></el-input></el-form-item>
					<el-form-item label="座數" ><el-input v-model="defectbatch.tower_number" disabled="disabled"></el-input></el-form-item>
					<el-form-item label="樓層" ><el-input v-model="defectbatch.floor_display_name" disabled="disabled"></el-input></el-form-item>
					<el-form-item label="單位" ><el-input v-model="defectbatch.unit_number" disabled="disabled"></el-input></el-form-item>
					<el-form-item label="Hot Case" >
						<el-input v-model="defectbatch.is_hotcase" disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="執修單號碼" ><el-input v-model="defectbatch.batch_id" disabled="disabled"></el-input></el-form-item>
					<el-form-item label="Batch No." ><el-input v-model="defectbatch.batch_seq" disabled="disabled"></el-input></el-form-item>

					<el-form-item label="執修單/待料單" >
						<el-select v-model="defectbatch.order_type" id="order_type"  disabled="disabled" placeholder="請選擇">
							<el-option v-for="item in order_typeList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="No of defect items per batch" ><el-input v-model="defectbatch.total_item" disabled="disabled"></el-input></el-form-item>
					<el-form-item label="執修表遞交日" prop="submission_date">
						<el-date-picker v-model="defectbatch.submission_date" type="datetime" :default-value="defaultDateValue"
								            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					</el-form-item>
					<el-form-item label="Project 收表日" >
						<el-date-picker v-model="defectbatch.accept_date" type="datetime" :default-value="defaultDateValue"
								            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					</el-form-item>

					<el-form-item label="大門匙/電約單" prop="enter_method">
						<el-select v-model="defectbatch.enter_method" id="enter_method" placeholder="請選擇">
							<el-option v-for="item in enter_methodList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

				</div>
				<div class="defectbatch-container-item item-right">
					<el-form-item label="Form/App">
						<el-select v-model="defectbatch.submission_channel" id="submission_channel" placeholder="請選擇" disabled="disabled">
							<el-option v-for="item in submissionChannelList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="已用日數"><el-input v-model="defectbatch.days_used" disabled="disabled"></el-form-item>

					<el-form-item label="除待料外執修回單">
						<el-input v-model="defectbatch.order_receipt_date1" disabled="disabled"></el-input>
					</el-form-item>

					<el-form-item label="回單日期">
						<el-input v-model="defectbatch.order_receipt_date2" disabled="disabled"></el-input>
					</el-form-item>
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
						<el-select v-model="defectbatch.checking_method" id="checking_method" placeholder="請選擇">
							<el-option v-for="item in checkingmethodList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="對單日期">
						<el-date-picker v-model="defectbatch.order_checking_date" type="datetime" :default-value="defaultDateValue"
								            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					</el-form-item>
					<el-form-item label="業主簽單日期">
						<el-date-picker v-model="defectbatch.signoff_date" type="datetime" :default-value="defaultDateValue"
								            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					</el-form-item>
					<el-form-item label="已簽全部完成項目">
						<el-input v-model="defectbatch.is_signoff" disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="發信種類">
						<el-select v-model="defectbatch.letter_type" id="letter_type" placeholder="請選擇">
							<el-option v-for="item in lettertypeList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="發信日期">
						<el-date-picker v-model="defectbatch.letter_issue_date" type="datetime" :default-value="defaultDateValue"
								            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					</el-form-item>
				</div>
				<div class="defectbatch-container-item-full">
					<el-form-item v-if="(EDIT && id)">
						<el-button type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
					</el-form-item>
				</div>
		</el-form>
	    <div>
		執修單總表更新日誌
		<el-table :data="loglist"
                v-loading="loading"
                element-loading-text="數據加載中"
                style="width: 100%"
                :row-style="tableRowStyle">
			<el-table-column prop="field" label="更新項目"></el-table-column>
			<el-table-column prop="original_status" label="原數據"></el-table-column>
    		<el-table-column prop="new_status" label="新數據"></el-table-column>
        	<el-table-column prop="updated_date" label="更新時間"></el-table-column>
        	<el-table-column prop="updated_by" label="更新用戶"></el-table-column>
    	</el-table>
		</div>
	</div>
</template>

<script>
	import { getlist } from '@/api/defectReportBatch/defectReportBatchNew';
	import { detail, saveDetail } from '@/api/defectReportBatch/defectReportBatchDetail';
	import { baseVanke } from '@/util/index';
	export default {
		name: "defectReportBatchDetail",
		components: {

		},
		data() {
			return {
				id: '',
				loading: false,
				submitLoading: false,
				disabled: true,
				rules: {
            		submission_date: [
						{required: true, message: '請輸入執修表遞交日', trigger: 'change'}
            		],
            		enter_method: [
						{required: true, message: '請輸入大門匙/電約單', trigger: 'change'}
            		],
				},

				projectList: [], // 项目列表

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
					batch_id: "",
					batch_seq: "",
					submission_date: "",
					enter_method: "",
					days_used: "",
					checker: "",
					checking_method: "",
					signoff_date: "",
					letter_type: "",
					order_receipt_date1: "",
					order_receipt_date2: "",
					total_item: "",

					project_date: "",
					submission_channel: "",
					checking_date: "",
					osr_in_charge: "",
					order_checking_date: "",
					is_signoff:"",
					letter_issue_date:"",
					is_hotcase:"",
				},
				btnList: [],
			}
		},
		activated() {
			this.loading = true;
			// 請求选择菜单
			this.initDetail();
			getlist().then((response) =>{
				this.initDetail();
				this.projectList = baseVanke.elFormatArray(response.data.project.data, 'id', 'name_c');
				this.enter_methodList = baseVanke.elFormatArray(response.data.enter_method);
				this.checkingmethodList = baseVanke.elFormatArray(response.data.checking_method);
				this.lettertypeList = baseVanke.elFormatArray(response.data.letter_type);
				this.submissionChannelList = baseVanke.elFormatArray(response.data.submission_channel);
				this.order_typeList = baseVanke.elFormatArray(response.data.order_type);
				this.yesnoList = baseVanke.elFormatArray(response.data.yesno);
				this.getItemDetail();
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
					batch_id: "",
					batch_seq: "",
					submission_date: "",
					enter_method: "",
					order_type: "",
					days_used: "",
					checker: "",
					checking_method: "",
					signoff_date: "",
					letter_type: "",
					order_receipt_date1: "",
					order_receipt_date2: "",
					total_item: "",

					project_date: "",
					submission_channel: "",
					checking_date: "",
					osr_in_charge: "",
					order_checking_date: "",
					is_signoff:"",
					letter_issue_date:"",
					is_hotcase:"",
				}
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
					detail(reqData).then((response)=>{
						const self = this;
						if (!response.data.VIEW) {
							self.$message.error('沒有權限！');
							self.$router.push('/defect-report-batch/list');
							return;
						}
						this.VIEW = response.data.VIEW;
						this.CREATE = response.data.CREATE;
						this.EDIT = response.data.EDIT;
						this.DELETE = response.data.DELETE;
						this.EXPORT = response.data.EXPORT;
						this.defectbatch = Object.assign({}, this.defectbatch, response.data.data.detail);
						if (this.defectbatch.is_hotcase == 1){
							this.defectbatch.is_hotcase = "是";
						} else {
							this.defectbatch.is_hotcase = "否";
						}
						this.loglist = baseVanke.elDefectBatchLogList( response.data.log, this.statusList);
						this.btnList = response.data.btn;
						this.loading = false;
					}).catch((error) =>{
						this.loading = false;
						this.$message.error(error.message);
					});
				}
			},

			onSubmit() {
				this.submitLoading = true;
				this.$refs.defectbatch.validate((valid)=>{
        			if(valid) {
						let data = {
							id: this.id,
							submission_date: this.defectbatch.submission_date,
							accept_date: this.defectbatch.accept_date,
							enter_method: this.defectbatch.enter_method,
							checking_date: this.defectbatch.checking_date,
							checker: this.defectbatch.checker,
							checking_method: this.defectbatch.checking_method,
							order_checking_date: this.defectbatch.order_checking_date,
							osr_in_charge: this.defectbatch.osr_in_charge,
							signoff_date: this.defectbatch.signoff_date,
	                		letter_type: this.defectbatch.letter_type,// 收件箱
							letter_issue_date: this.defectbatch.letter_issue_date,
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
						this.$message.error('表單填寫有誤！');
						this.submitLoading = false;
						return false;
					}

				})

	        },

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
    width: 100%;
	text-align: center;
  }
</style>



// WEBPACK FOOTER //
// src/components/defectReportBatch/defectReportBatchDetail.vue