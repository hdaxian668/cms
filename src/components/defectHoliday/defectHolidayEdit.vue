<template>
    <div class="page">
		<section class="page-header">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
				<el-breadcrumb-item>執修管理</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/defect-holiday/list' }">假期編輯</el-breadcrumb-item>
				<el-breadcrumb-item>瀏覽/編輯</el-breadcrumb-item>
			</el-breadcrumb>
		</section>

		<el-form ref="holidayitem"
						 v-loading="loading"
						 element-loading-text="數據加載中"
						 :model="holidayitem"
						 :rules=rules
						 label-position="left" label-width="150px">
					<el-form-item label="假期名稱" prop="name" >
						<el-input v-model="holidayitem.name"></el-input>
					</el-form-item>
					<el-form-item label="日期" prop="date" >
						<el-date-picker v-model="holidayitem.date" type="date" :default-value="defaultDateValue"
								            value-format="yyyy-MM-dd"></el-date-picker>
					</el-form-item>

					<el-form-item label="適用於" prop="apply">
			          <el-select v-model="holidayitem.apply" placeholder="所有項目"
            		       class="selects-item">
			            <el-option :key="-1" label="所有項目" value="ALL"></el-option>
            			<el-option v-for="item in projectList"
            			            :key="item.value"
                        			:label="item.label"
			                        :value="item.value">
            			</el-option>
			          </el-select>
					</el-form-item>
					<el-form-item>
						<el-button v-if="EDIT" type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
						<el-button v-if="DELETE" type="primary" :loading="submitLoading" @click="onDelete">刪除</el-button>
					</el-form-item>
		</el-form>
</template>

<script>
	import { detail, saveItem, deleteItem } from '@/api/defectHoliday/defectHoliday';
	import { getlist } from '@/api/defectReport/defectReportList';
	import { baseVanke } from '@/util/index';
	export default {
		name: "defectHolidayEdit",
		components: {

		},
		data() {
			return {
				id: '',
				loading: false,
				submitLoading: false,
				disabled: true,

				VIEW: false,
                CREATE: false,
                EDIT: false,
                DELETE: false,
                EXPORT: false,
    	    	holidayitem: {
	    	    	name: "",
		        	date: "",
					apply: "",
		        },
				projectList: [],
				// allproject: [],
				isIndeterminate: false,
				// checkAllProject: false,
                rules: {
                    name: [{required: true, message: '請輸入假期名稱'}],
                    date: [{required: true, message: '請輸入日期'}],
                    apply: [{required: true, message: '請選擇項目'}],
                },
			}
		},
		activated() {
			this.initDetail();
			let self = this;
			// self.checkAllProject = false;
			// self.allproject = [];
			self.getItemDetail();
			getlist().then((response) =>{
				self.projectList = baseVanke.elFormatArray(response.data.project.data, 'id', 'name_c');
				console.log(response);
			}).catch((error) => {
				this.loading = false;
				this.$message.error(error.message);
			});
		},
		deactivated() {
			this.getItemDetail();
		},
		methods: {
			initDetail() {
				this.id = '';
				this.holidayitem = {
	    	    	name: "",
		        	date: "",
					apply: "",
				};
				this.projectList = [];
				this.allproject = [];
			},
			getItemDetail() {
				this.id = this.$route.query.id;
				let self = this;
				if (this.id) {
					this.loading = true;
					let reqData = {
						id: this.id
					};
					detail(reqData).then((response)=>{
						if (!response.data.VIEW) {
							self.$message.error('沒有權限！');
							self.$router.push('/defect-holiday/list');
							return;
						}
						this.VIEW = response.data.VIEW;
						this.CREATE = response.data.CREATE;
						this.EDIT = response.data.EDIT;
						this.DELETE = response.data.DELETE;
						this.EXPORT = response.data.EXPORT;
						this.holidayitem = Object.assign({}, this.holidayitem, response.data.data.detail);
						console.log(response);
						// if (this.holidayitem.apply_all == 1){
						// 	self.checkAllProject = true;
						// 	self.holidayitem.apply = self.allproject;
						// 	self.isIndeterminate = false;
						// }
						this.loading = false;
					}).catch((error) =>{
						this.loading = false;
						this.$message.error(error.message);
					});
				}
			},
			handleCheckAllChange(val){
				let self = this;
				self.holidayitem.apply = val ? self.allproject : [];
				self.isIndeterminate = false;
			},
			handleCheckedChange(value){
				const checkedCount = value.length
				let self = this;
				self.checkAllProject = checkedCount === self.allproject.length
				self.isIndeterminate = checkedCount > 0 && checkedCount < self.allproject.length
			},
			onSubmit() {
				this.submitLoading = true;
				this.$refs.holidayitem.validate((valid)=>{
        			if(valid) {
	        			let data = {
                            id: this.id,
							name: this.holidayitem.name,
							date: this.holidayitem.date,
							apply: this.holidayitem.apply,
                            is_deleted: "0",
		      			};
						console.log(data)
						saveItem(data).then((response)=>{
							this.$message({
								type: 'success',
					            message: '提交成功!'
							});
							this.$router.push('/defect-holiday/list');
						}).catch((error)=>{
        					this.$message.error(error.message);
		    			}).finally(()=> {
    	    				this.submitLoading = false;
	    				});
					} else {
						this.$message.error('表單填寫有誤！');
						return false;
					}
				})
			},
			onDelete() {				  
				this.submitLoading = true;
				let data = {
					id: this.id,
					is_deleted: "1",
				};
				deleteItem(data).then((response)=>{
					this.submitLoading = false;
					this.$message({
						type: 'success',
						message: '提交成功!'
					});
					this.$router.push('/defect-holiday/list');
				}).catch((error)=>{
					this.$message.error(error.message);
	    		});
			},
		}
	}
</script>

<style scoped>

</style>



// WEBPACK FOOTER //
// src/components/defectHoliday/defectHolidayEdit.vue