<template>
  <div class="page">
    <section class="page-header">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user-group/list' }">權限管理</el-breadcrumb-item>
      <el-breadcrumb-item>權限信息</el-breadcrumb-item>
    </el-breadcrumb>
  </section>
    <el-form ref="userGroup"
             v-loading="loading"
             element-loading-text="數據加載中"
             :model="userGroup"
             :rules="rules"
             label-position="left" label-width="80px">
      <el-form-item label="名稱" prop="name">
        <el-input v-model="userGroup.name"
                  placeholder="請輸入名稱"></el-input>
      </el-form-item>
      <el-form-item label="許可項目" min-width="90%" style="width: 90% !important;">
        <el-button type="primary" @click="onSelectAll" >全部選取</el-button>
        <el-button type="primary" @click="onUnselectAll" >全部取消</el-button>
        <br />
        <label class="item-title">項目管理:</label>
        <label class="item-checkbox"><input type='checkbox' value="[PROPERTY-VIEW]">瀏覽</label>
        <label class="item-checkbox"><input type='checkbox' value="[PROPERTY-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[PROPERTY-EDIT]">修改</label>
        <label class="item-checkbox"><input type='checkbox' value="[PROPERTY-DELETE]">刪除</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[PROPERTY-EXPORT]" disabled>導出</label>
        <label class="item-checkbox"><input type='checkbox' value="[PROPERTY-FLOORPLAN]">平面圖</label>
        <label class="item-checkbox"><input type='checkbox' value="[PROPERTY-SALES]">銷售紀錄</label>
        <label class="item-checkbox"><input type='checkbox' value="[PROPERTY-APPUSER]">買家列表</label>
        <label class="item-checkbox"><input type='checkbox' value="[PROPERTY-PROGRESS]">施工進度</label>
        <label class="item-checkbox"><input type='checkbox' value="[PROPERTY-UNITIMPORT]">單位導入</label>
        <label class="item-checkbox"><input type='checkbox' value="[PROPERTY-UNITEXPORT]">單位導出</label>
        <br />
        <label class="item-title">訪客管理:</label>
        <label class="item-checkbox"><input type='checkbox' value="[VISITOR-VIEW]">瀏覽</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[VISITOR-CREATE]" disabled>新增</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[VISITOR-EDIT]" disabled>修改</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[VISITOR-DELETE]" disabled>刪除</label>
        <label class="item-checkbox"><input type='checkbox' value="[VISITOR-EXPORT]">導出</label>
        <br />
        <label class="item-title">保安員管理:</label>
        <label class="item-checkbox"><input type='checkbox' value="[GUARD-VIEW]">瀏覽</label>
        <label class="item-checkbox"><input type='checkbox' value="[GUARD-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[GUARD-EDIT]">修改</label>
        <label class="item-checkbox"><input type='checkbox' value="[GUARD-DELETE]">刪除</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[GUARD-EXPORT]" disabled>導出</label>
        <br />
        <label class="item-title">執修管理:</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-MANAGE-VIEW]">瀏覽</label>
        <br/>
        <label class="item-title" style="text-align: right;">執修單:</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-VIEW]">瀏覽</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-EDIT]">修改</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-DELETE]">刪除</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-EXPORT]">導出</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-IMPORT]">導入</label>
        <br/>
        <label class="item-title" style="text-align: right;">執修總表:</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-BATCH-VIEW]">瀏覽</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-BATCH-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-BATCH-EDIT]">修改</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-BATCH-DELETE]">刪除</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-BATCH-EXPORT]">導出</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-BATCH-IMPORT]">導入</label>
        <br />
        <label class="item-title" style="text-align: right;">執修選項:</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-DATA-VIEW]">瀏覽</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-DATA-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-DATA-EDIT]">修改</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-DATA-DELETE]">刪除</label>
        <br />
        <label class="item-title" style="text-align: right;">假期:</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-HOLIDAY-VIEW]">瀏覽</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-HOLIDAY-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-HOLIDAY-EDIT]">修改</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-HOLIDAY-DELETE]">刪除</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-HOLIDAY-EXPORT]">導出</label>
        <label class="item-checkbox"><input type='checkbox' value="[DEFECT-HOLIDAY-IMPORT]">導入</label>
        <br />
        <label class="item-title">活動管理:</label>
        <label class="item-checkbox"><input type='checkbox' value="[ACTIVITY-VIEW]">瀏覽</label>
        <label class="item-checkbox"><input type='checkbox' value="[ACTIVITY-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[ACTIVITY-EDIT]">修改</label>
        <label class="item-checkbox"><input type='checkbox' value="[ACTIVITY-DELETE]">刪除</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[ACTIVITY-EXPORT]" disabled>導出</label>
        <br />
        <label class="item-title">折扣管理:</label>
        <label class="item-checkbox"><input type='checkbox' value="[DISCOUNT-VIEW]">瀏覽</label>
        <label class="item-checkbox"><input type='checkbox' value="[DISCOUNT-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[DISCOUNT-EDIT]">修改</label>
        <label class="item-checkbox"><input type='checkbox' value="[DISCOUNT-DELETE]">刪除</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[DISCOUNT-EXPORT]" disabled>導出</label>
        <br />
        <label class="item-title">會員系統:</label>
        <label class="item-checkbox"><input type='checkbox' value="[MEMBER-VIEW]">瀏覽</label>
        <label class="item-checkbox"><input type='checkbox' value="[MEMBER-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[MEMBER-EDIT]">修改</label>
        <label class="item-checkbox"><input type='checkbox' value="[MEMBER-DELETE]">刪除</label>
        <label class="item-checkbox"><input type='checkbox' value="[MEMBER-EXPORT]">導出</label>
        <br />
        <label class="item-title">會籍管理:</label>
        <label class="item-checkbox"><input type='checkbox' value="[LEVEL-VIEW]">瀏覽</label>
        <label class="item-checkbox"><input type='checkbox' value="[LEVEL-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[LEVEL-EDIT]">修改</label>
        <label class="item-checkbox"><input type='checkbox' value="[LEVEL-DELETE]">刪除</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[LEVEL-EXPORT]" disabled>導出</label>
        <br />
        <label class="item-title">聯繫管理:</label>
        <!--<label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-VIEW]">瀏覽</label>-->
        <!--<label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-EDIT]">修改</label>-->
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-VIEW-SELF]">瀏覽自己</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-EDIT-SELF]">修改自己</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-DELETE]">刪除</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-EXPORT]">導出</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-IMPORT]">導入</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-CREATE-REMARK]">新增備註</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-ASSIGN]">指派</label>
        <br />
        <label class="item-title">&nbsp;</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-VIEW-ALL]">瀏覽全部</label>
        <label class="item-checkbox">&nbsp;</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-EDIT-ALL]">修改全部</label>
        <label class="item-checkbox">&nbsp;</label>
        <label class="item-checkbox">&nbsp;</label>
        <label class="item-checkbox">&nbsp;</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-VIEW-REMARK]">瀏覽備註</label>
        <br />
        <label class="item-title" style="text-align: right;">更新狀態為:</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-UPDATETO-STATUS-1]">待處理</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-UPDATETO-STATUS-2]">處理中</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-UPDATETO-STATUS-3]">已完成</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-UPDATETO-STATUS-4]">關閉</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-UPDATETO-STATUS-5]">拒絕</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-UPDATETO-STATUS-6]">取消</label>
        <br />
        <label class="item-title">聯繫渠道管理:</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-CHANNEL-VIEW]">瀏覽</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-CHANNEL-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-CHANNEL-EDIT]">修改</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-CHANNEL-DELETE]">刪除</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[FEEDBACK-CHANNEL-EXPORT]" disabled>導出</label>
        <br />
        <label class="item-title">聯繫類別管理:</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-CATEGORY-VIEW]">瀏覽</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-CATEGORY-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-CATEGORY-EDIT]">修改</label>
        <label class="item-checkbox"><input type='checkbox' value="[FEEDBACK-CATEGORY-DELETE]">刪除</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[FEEDBACK-CATEGORY-EXPORT]" disabled>導出</label>
        <br />
        <label class="item-title">消息管理:</label>
        <label class="item-checkbox"><input type='checkbox' value="[NOTIFICATION-VIEW]">瀏覽</label>
        <label class="item-checkbox"><input type='checkbox' value="[NOTIFICATION-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[NOTIFICATION-EDIT]">修改</label>
        <label class="item-checkbox"><input type='checkbox' value="[NOTIFICATION-DELETE]">刪除</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[NOTIFICATION-EXPORT]" disabled>導出</label>
        <br />
        <label class="item-title">廣告管理:</label>
        <label class="item-checkbox"><input type='checkbox' value="[AD-VIEW]">瀏覽</label>
        <label class="item-checkbox"><input type='checkbox' value="[AD-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[AD-EDIT]">修改</label>
        <label class="item-checkbox"><input type='checkbox' value="[AD-DELETE]">刪除</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[AD-EXPORT]" disabled>導出</label>
        <br />
        <label class="item-title">App版本管理:</label>
        <label class="item-checkbox"><input type='checkbox' value="[APPVERSION-VIEW]">瀏覽</label>
        <label class="item-checkbox"><input type='checkbox' value="[APPVERSION-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[APPVERSION-EDIT]">修改</label>
        <label class="item-checkbox"><input type='checkbox' value="[APPVERSION-DELETE]">刪除</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[APPVERSION-EXPORT]" disabled>導出</label>
        <br />
        <label class="item-title">訂閱列表:</label>
        <label class="item-checkbox"><input type='checkbox' value="[SUBSCRIBER-VIEW]">瀏覽</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[SUBSCRIBER-CREATE]" disabled>新增</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[SUBSCRIBER-EDIT]" disabled>修改</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[SUBSCRIBER-DELETE]" disabled>刪除</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[SUBSCRIBER-EXPORT]" disabled>導出</label>
        <br />
        <label class="item-title">後臺管理員:</label>
        <label class="item-checkbox"><input type='checkbox' value="[USER-VIEW]">瀏覽</label>
        <label class="item-checkbox"><input type='checkbox' value="[USER-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[USER-EDIT]">修改</label>
        <label class="item-checkbox"><input type='checkbox' value="[USER-DELETE]">刪除</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[USER-EXPORT]" disabled>導出</label>
        <br />
        <label class="item-title">權限管理:</label>
        <label class="item-checkbox"><input type='checkbox' value="[USERGROUP-VIEW]">瀏覽</label>
        <label class="item-checkbox"><input type='checkbox' value="[USERGROUP-CREATE]">新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[USERGROUP-EDIT]">修改</label>
        <label class="item-checkbox"><input type='checkbox' value="[USERGROUP-DELETE]">刪除</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[USERGROUP-EXPORT]" disabled>導出</label>
        <br />
        <label class="item-title">系統其他項目:</label>
        <label class="item-checkbox"><input type='checkbox' value="[SYSTEM-VIEW]">瀏覽</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[SYSTEM-CREATE]" disabled>新增</label>
        <label class="item-checkbox"><input type='checkbox' value="[SYSTEM-EDIT]">修改</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[SYSTEM-DELETE]" disabled>刪除</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[SYSTEM-EXPORT]" disabled>導出</label>
        <br />
        <label class="item-title">審計日誌:</label>
        <label class="item-checkbox"><input type='checkbox' value="[AUDITLOG-VIEW]">瀏覽</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[AUDITLOG-CREATE]" disabled>新增</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[AUDITLOG-EDIT]" disabled>修改</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[AUDITLOG-DELETE]" disabled>刪除</label>
        <label class="item-checkbox disabled"><input type='checkbox' value="[AUDITLOG-EXPORT]" disabled>導出</label>
        <br />
      </el-form-item>
      <el-form-item v-if="(CREATE && !id) || (EDIT && id)">
        <el-button type="primary" :loading="submitLoading" @click="onSubmit" >提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    edit,
    save, 
    newForm
  } from '@/api/system/userGroupDetail';

  export default {
      name: "userGroupDetail",
      data() {
        return {
          id: '',
          loading : false,
          submitLoading: false,

          rules: {
            name: [
              { required: true, message: '請輸入名稱', trigger: 'blur' }
            ],
          },

          VIEW: false,
          CREATE: false,
          EDIT: false,
          DELETE: false,
          EXPORT: false,
          userGroup: {
            id: '',
            name: '',
          },
        }
      },
      activated() {
        $("input[type='checkbox']").prop('checked', false);
        this.getItemDetail();
      },
      deactivated() {
        this.initDetail();
      },
      methods: {
        initDetail() {
          this.id = '';
          this.userGroup = {
              id: '',
              name: '',
          };
          this.$refs.userGroup.clearValidate();
        },
        getItemDetail() {
          const self = this;
          this.id = this.$route.query.id;
          this.userGroup = {
              id: '',
              name: '',
          };
          if (this.id) {
            this.loading = true;
            let reqData = {
              id: this.id
            };
            edit(reqData).then(function(response){
              if (!response.data.VIEW) {
                self.$message.error('沒有權限！');
                self.$router.push('/user-group/list');
                return;
              }
              self.VIEW = response.data.VIEW;
              self.CREATE = response.data.CREATE;
              self.EDIT = response.data.EDIT;
              self.DELETE = response.data.DELETE;
              self.EXPORT = response.data.EXPORT;
              self.userGroup = Object.assign({}, self.userGroup, response.data.userGroup);
              var accessItems = self.userGroup.access_items;
              accessItems = accessItems.split(',');
              accessItems.forEach(function(e) {
                var item = e;
                item = item.replaceAll('\[', '\\[');
                item = item.replaceAll('\]', '\\]');
                if (item != '') {
                  $("input[type='checkbox'][value='"+item+"']").prop('checked', true);
                  if (!self.EDIT) {
                    $("input[type='checkbox']").prop('disabled', true);
                    $(".item-checkbox").addClass('disabled');
                  }
                }
              });
            }).catch(function(error) {
              self.$message.error(error.message);
            }).finally(function() {
              self.loading = false;
            });
          } else {
            newForm().then(function(response){
              console.log(response);
              if (!response.data.VIEW) {
                self.$message.error('沒有權限！');
                self.$router.push('/user-group/list');
                return;
              }
              self.VIEW = response.data.VIEW;
              self.CREATE = response.data.CREATE;
              self.EDIT = response.data.EDIT;
              self.DELETE = response.data.DELETE;
              self.EXPORT = response.data.EXPORT;
            }).catch(function(error) {
              self.$message.error(error.message);
            }).finally(function() {
              self.loading = false;
            });
          }
        },
        onSelectAll() {
          $("input[type='checkbox']:not(:disabled)").prop('checked', true);
        },
        onUnselectAll() {
          $("input[type='checkbox']").prop('checked', false);
        },
        onSubmit() {
          var accessItems = new Array();
          $("input[type='checkbox']:checked").each(function() {
            accessItems.push($(this).val());
          });
          const self = this;
          this.$refs.userGroup.validate((valid)=>{
            if(valid) {
              this.submitLoading = true;
              let data = {
                name: this.userGroup.name,
                access_items: accessItems.join(','),
              };
              if (this.id) {
                data.id = this.id;
              }
              save(data).then(function() {
                self.$message({
                  type: 'success',
                  message: '提交成功!'
                });
                self.$router.push('/user-group/list');
              }).catch(function(error) {
                self.$message.error(error.message);
              }).finally(function() {
                self.submitLoading = false;
              });
            } else {
              this.$message.error('表單填寫有誤！');
              return false;
            }
          });
        },
      }
    }
</script>

<style scoped>
  .item-title {
    display: inline-block;
    width: 150px;
  }
  .item-checkbox {
    display: inline-block;
    width: 80px;
    color: #333333;
  }
  .item-checkbox input {
    margin-right: 5px;
  }
  .disabled {
    color: #cccccc;
  }

  .el-input {
    width: 70%;
  }
  .el-select {
    width: 70%;
  }
</style>



// WEBPACK FOOTER //
// src/components/system/userGroupDetail.vue