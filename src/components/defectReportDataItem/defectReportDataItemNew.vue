<template>
    <div class="page">
		<section class="page-header">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
				<el-breadcrumb-item>執修管理</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/defect-report-data-item/list' }">編輯執修選項</el-breadcrumb-item>
				<el-breadcrumb-item>新增執修選項</el-breadcrumb-item>
			</el-breadcrumb>
		</section>

		<el-form ref="dataitem"
						 v-loading="loading"
						 element-loading-text="數據加載中"
						 :model="dataitem"
						 :rules=rules
						 label-position="left" label-width="150px">
					<el-form-item label="中文顯示" prop="name_c" >
						<el-input v-model="dataitem.name_c"></el-input>
					</el-form-item>
					<el-form-item label="中文顯示(簡體)" prop="name_sc" >
						<el-input v-model="dataitem.name_sc"></el-input>
					</el-form-item>
					<el-form-item label="英文顯示"  prop="name_e" >
						<el-input v-model="dataitem.name_e"></el-input>
					</el-form-item>

					<el-form-item label="種類" prop="category" >
					    <el-radio-group v-model="dataitem.category">
							<el-radio-button v-for="item in categoryList" :label="item.value" :key="item.value">{{item.label}}</el-radio-button>
						</el-radio-group>
					</el-form-item>

					<el-form-item label="Enabled" prop="is_display">
					    <el-radio-group v-model="dataitem.is_display">
							<el-radio-button :label="item.value" :key="item.value" v-for="item in yesnoList">{{item.label}}</el-radio-button>
						</el-radio-group>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
					</el-form-item>
		</el-form>
</template>

<script>
	import { save } from '@/api/defectReportDataItem/defectReportDataItemList';
	import { baseVanke } from '@/util/index';
	export default {
		name: "defectReportDataItemNew",
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
		dataitem: {
			name_c: "",
			name_sc: "",
			name_e: "",
			category: "",
			is_display: "",

		},
        rules: {
            name_c: [
              {required: true, message: '請輸入中文顯示'}
            ],
            name_sc:[
              {required: true, message: '請輸入中文顯示(簡體)'}
            ],
            name_e:[
              {required: true, message: '請輸入英文顯示'}
            ],
            category:[
              {required: true, message: '請選擇類別'}
            ],
            is_display:[
              {required: true, message: '請選擇'}
            ],
          },
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
          yesnoList: [
            {
              label: "是",
              value: 1
            },{
              label: "否",
              value: 0
            },
          ],
			}
		},
		activated() {
			this.initDetail();
		},
		deactivated() {
			this.initDetail();
		},
		methods: {
			initDetail() {
				this.id = '';
				this.dataitem = {
					name_c: "",
					name_sc: "",
					name_e: "",
					category: "",
					is_display: "",
				}
			},
			onSubmit() {
				this.submitLoading = true;
				this.$refs.dataitem.validate((valid)=>{
        			if(valid) {
	        			let data = {
							name_c: this.dataitem.name_c,
							name_sc: this.dataitem.name_sc,
							name_e: this.dataitem.name_e,
							category: this.dataitem.category,
							is_display: this.dataitem.is_display,
		      			};
						save(data).then((response)=>{
							this.$message({
								type: 'success',
					            message: '提交成功!'
							});
							this.$router.push('/defect-report-data-item/list');
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
			}
		}
	}
</script>

<style scoped>

</style>



// WEBPACK FOOTER //
// src/components/defectReportDataItem/defectReportDataItemNew.vue