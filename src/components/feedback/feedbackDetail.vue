<template>
  <div class="page">
    <section class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/feedback/list' }">聯繫管理</el-breadcrumb-item>
        <el-breadcrumb-item>聯繫詳情</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <el-tabs v-model="feedbackTab" @tab-click="handleTabClick">
      <el-tab-pane label="聯繫詳情" name="feedbackdetails">
        <el-form ref="feedback"
                 v-loading="loading"
                 element-loading-text="數據加載中"
                 :model="feedback"
                 :rules="rules"
                 label-position="left" label-width="150px">
          <div class="feedback-container">
        <div class="feedback-container-item item-left">
          <el-form-item label="查詢編號" prop="enquiry_id">
            <el-input placeholder="" v-model="feedback.enquiry_id" readonly="true"></el-input>
          </el-form-item>

          <!--
          <el-form-item label="查詢渠道" prop="channel_id">
            <el-select v-model="feedback.channel_id" placeholder="查詢渠道" class="selects-item" value-key="feedback.channel_id" :disabled="(!IS_CHANNEL_EDITABLE)">
              <el-option key="" value="" label="請選擇查詢渠道"></el-option>
              <el-option key="1" value="1" label="熱線電話"></el-option>
              <el-option key="2" value="2" label="電郵"></el-option>
              <el-option key="3" value="3" label="萬客會APP"></el-option>
              <el-option key="4" value="4" label="Facebook訊息"></el-option>
              <el-option key="5" value="5" label="其他"></el-option>
            </el-select>
          </el-form-item>
          -->
          <el-form-item label="查詢渠道" prop="channel_id">
            <el-select v-model="feedback.channel_id" placeholder="查詢渠道" class="selects-item" value-key="feedback.channel_id" :disabled="(!IS_CHANNEL_EDITABLE)">
              <el-option key="" value="" label="請選擇查詢渠道"></el-option>
              <el-option
                v-for="item in feedbackChannelList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-select>
          </el-form-item>

          <!--
          <el-form-item label="查詢類別" prop="category">
            <el-select v-model="feedback.category" placeholder="查詢類別" class="selects-item" value-key="feedback.category" :disabled="!((CREATE && !id) || (EDIT && id))">
              <el-option key="" value="" label="請選擇查詢類別"></el-option>
              <el-option key="1" value="1" label="會籍查詢"></el-option>
              <el-option key="2" value="2" label="銷售查詢"></el-option>
              <el-option key="3" value="3" label="物業管理查詢"></el-option>
            </el-select>
          </el-form-item>
          -->
          <el-form-item label="查詢類別" prop="category">
            <el-select v-model="feedback.category" placeholder="查詢類別" class="selects-item" value-key="feedback.category" :disabled="!((CREATE && !id) || (EDIT && id))">
              <el-option key="" value="" label="請選擇查詢類別"></el-option>
              <el-option
                v-for="item in feedbackCategoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-select>
          </el-form-item>

          <el-form-item label="查詢日期" prop="enquiry_date">
            <el-date-picker type="datetime" placeholder="日期"
                            v-model="feedback.enquiry_date"
                            default-time="12:00:00"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :picker-options="pickerOptions"
                            :readonly="!((CREATE && !id) || (EDIT && id))"></el-date-picker>
          </el-form-item>

          <el-form-item label="跟進群組" prop="assigned_group_id">
            <el-select v-model="feedback.assigned_group_id" placeholder="跟進群組" class="selects-item" value-key="feedback.assigned_group_id" :disabled="!(ASSIGN)">
              <el-option key="" value="" label="請選擇跟進群組" :disabled="(true)"></el-option>
              <el-option
                v-for="item in userGroupList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <!--
          <el-form-item label="聯絡人" prop="contact_person">
            <el-select v-model="feedback.contact_person" placeholder="聯絡人" class="selects-item" value-key="feedback.contact_person">
              <el-option key="" value="" label="聯絡人"></el-option>
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          -->

          <el-form-item label="狀態" prop="status">
            <el-select v-model="feedback.status" placeholder="狀態" class="selects-item" value-key="feedback.status" :disabled="!((CREATE && !id) || (EDIT && id))">
              <el-option key="" value="" label="請選擇狀態"></el-option>
              <el-option key="1" value="1" label="待處理" :disabled="(!UPDATE_TO_STATUS_1)"></el-option>
              <el-option key="2" value="2" label="處理中" :disabled="(!UPDATE_TO_STATUS_2)"></el-option>
              <el-option key="3" value="3" label="已完成" :disabled="(!UPDATE_TO_STATUS_3)"></el-option>
              <el-option key="4" value="4" label="關閉" :disabled="(!UPDATE_TO_STATUS_4)"></el-option>
              <el-option key="5" value="5" label="拒絕" :disabled="(!UPDATE_TO_STATUS_5)"></el-option>
              <el-option key="6" value="6" label="取消" :disabled="(!UPDATE_TO_STATUS_6)"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="創建時間" prop="create_time" v-if="(id)">
            <el-input placeholder="" v-model="feedback.create_time" readonly="true"></el-input>
          </el-form-item>

          <el-form-item label="最後更新時間" prop="alter_time" v-if="(id)">
            <el-input placeholder="" v-model="feedback.alter_time" readonly="true"></el-input>
          </el-form-item>
        </div>
        
        <div class="feedback-container-item item-right">
          <el-form-item label="物業" prop="project_id">
            <el-select v-model="feedback.project_id" placeholder="所有物業" class="selects-item" value-key="feedback.project_id" :disabled="!((CREATE && !id) || (EDIT && id))">
              <el-option key="" value="" label="其他"></el-option>
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :label="item.name_c"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <!--
          <el-form-item label="單位" prop="project_address">
            <el-input placeholder="請輸入單位" v-model="feedback.project_address" :readonly="!((CREATE && !id) || (EDIT && id))"></el-input>
          </el-form-item>
          -->
          <el-form-item label="單位" prop="project_address">
            <el-autocomplete
                v-model="feedback.project_address"
                :fetch-suggestions="unitSearch"
                placeholder="請輸入單位"
                @select="handleSelect" @change="getDefectBatch"></el-autocomplete>
          </el-form-item>

          <el-form-item label="會員號碼" prop="club_id">
            <el-input placeholder="請輸入會員號碼 (VCxxxxxx)" v-model="feedback.club_id" :readonly="!((CREATE && !id) || (EDIT && id))"></el-input>
          </el-form-item>

          <el-form-item label="查詢者姓名/公司" prop="username">
            <el-input placeholder="請輸入查詢者姓名/公司" v-model="feedback.username" :readonly="!((CREATE && !id) || (EDIT && id))"></el-input>
          </el-form-item>
          
          <el-form-item label="手提電話" prop="phone">
            <el-row :gutter="20">
              <el-col :span="10" style="padding-left: 0;">
                <el-select v-model="feedback.nationcode" placeholder="請選擇地區號"  :disabled="!((CREATE && !id) || (EDIT && id))">
                  <el-option
                    v-for="item in codeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-input placeholder="請輸入手提電話" v-model="feedback.phone" :readonly="!((CREATE && !id) || (EDIT && id))"></el-input>
              </el-col>
            </el-row>

          </el-form-item>

          <el-form-item label="郵箱地址" prop="email">
            <el-input placeholder="請輸入郵箱地址" v-model="feedback.email" :readonly="!((CREATE && !id) || (EDIT && id))"></el-input>
          </el-form-item>

          <el-form-item label="創建人" prop="create_by_name" v-if="(id)">
            <el-input placeholder="" v-model="feedback.create_user_info.name" readonly="true"></el-input>
          </el-form-item>
        </div>
          </div>
          <el-form-item label="反饋內容" prop="content" style="width: 80%;">
        <el-input type="textarea"
                  :rows="5"
                  placeholder="請輸入反饋內容"
                  v-model="feedback.content" 
                  :readonly="(id)"
                  style="margin-bottom: 22px; border-bottom: 1px solid #ebeef5; padding-bottom: 25px;"></el-input>

        <feedback-content-item v-for="(item,index) in feedback.contentList"
                      ref="feedbackContent"
                      :item="item"
                      :index="index"
                      @sortUp="feedbackContentItemSortUp"
                      @sortDown="feedbackContentItemSortDown"
                      @itemDelete="feedbackContentItemDelete"></feedback-content-item>
        <i class="el-icon-plus uploader-icon add-extend"
           @click="addFeedbackContentItem" v-if="(CREATE && !id)"></i>
        <br />
        <label v-if="(CREATE && !id)">*若提交多於一項反饋內容，儲存後每項反饋內容將被拆分為一條獨立記錄</label>
          </el-form-item>
          <div style="width: 90%; border-top: 1px solid #ebeef5; padding-top: 25px;" v-if="(VIEW_REMARK && id)">
            <div style="margin-bottom: 5px;">
              <label style="width: 15%; display: inline-block;">負責人</label>
              <label style="width: 15%; display: inline-block;">跟進群組</label>
              <label style="width: 15%; display: inline-block;">狀態</label>
              <label style="width: 20%; display: inline-block;">跟進日期</label>
              <label style="width: 33%; display: inline-block;">跟進備註</label>
            </div>
            <remark-item v-for="(item,index) in feedback.extend"
                      ref="remark"
                      :item="item"
                      :index="index"
                      @sortUp="extendSortUp"
                      @sortDown="extendSortDown"
                      @itemDelete="extendItemDelete"></remark-item>
            <i class="el-icon-plus uploader-icon add-extend" @click="addRemarkItem" v-if="(CREATE_REMARK)"></i>
          </div>
          <el-form-item v-if="(CREATE && !id) || (EDIT && id) || (CREATE_REMARK) || (ASSIGN)">
        <el-button type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="執修單" name="defectreport">
        <el-row class="selects-row">
          <el-select v-model="tower_number" placeholder="座數" class="selects-item-cs" @change="handleDefectReportChange">
            <el-option :key="-1" label="所有座數" value=""> </el-option>
            <el-option v-for="item in towerList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <el-select v-model="floor_display_name" placeholder="樓層" class="selects-item-cs" @change="handleDefectReportChange">
            <el-option :key="-1" label="所有樓層" value=""> </el-option>
            <el-option v-for="item in floorList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <el-select v-model="unit_number" placeholder="單位" class="selects-item-cs" @change="handleDefectReportChange">
            <el-option :key="-1" label="所有單位" value=""> </el-option>
            <el-option v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <el-button type="text" class="adv-search-btn" v-if="(!isEnableAdvSearch)" v-on:click="toggleAdvSearch(true)">顯示更多 &gt;</el-button>
          <el-button type="text" class="adv-search-btn" v-if="(isEnableAdvSearch)" v-on:click="toggleAdvSearch(false)">&lt; 顯示較少</el-button>
        </el-row>
        <el-row class="selects-row" v-if="(isEnableAdvSearch)">
          執修單總表<br/>
          <el-input class="selects-item-cs"
                  v-model="batch_id"
                  @change="handleDefectReportChange"
                  placeholder="Batch ID">
          </el-input>
          <el-select v-model="order_type" placeholder="執修單/待料單"
                   class="selects-item-cs" id="order_type"
                   @change="handleDefectReportChange">
            <el-option :key="-1" label="所有執修單/待料單" value=""></el-option>
            <el-option v-for="item in order_typeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker v-model="submission_date" type="date" value-format="yyyy-MM-dd" placeholder="執修表遞交日" class="selects-item-cs" @change="handleDefectReportChange"></el-date-picker>
          <el-select v-model="enter_method" placeholder="大門匙/電約單"
                   class="selects-item-cs" id="enter_method"
                   @change="handleDefectReportChange"> 
            <el-option :key="-1" label="所有大門匙/電約單" value=""></el-option>
            <el-option v-for="item in enter_methodList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="is_signoff" placeholder="已簽全部完成項目"
                   class="selects-item-cs" id="is_signoff"
                   @change="handleDefectReportChange"> 
            <el-option :key="-1" label="已簽全部完成項目" value=""></el-option>
            <el-option v-for="item in yesnoList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="letter_type" placeholder="發信種類"
                   class="selects-item-cs" id="letter_type"
                   @change="handleDefectReportChange"> 
            <el-option :key="-1" label="所有發信種類" value=""></el-option>
            <el-option v-for="item in lettertypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </el-option>
          </el-select>
        </el-row>
        <el-row class="selects-row" v-if="(isEnableAdvSearch)">
          執修單<br/>
          <el-select v-model="position_new" placeholder="執修位置" class="selects-item-cs" @change="handleDefectReportChange">
            <el-option :key="-1" label="所有執修位置" value=""> </el-option>
            <el-option v-for="item in positionList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <el-select v-model="type_new" placeholder="執修項目" class="selects-item-cs" @change="handleDefectReportChange">
            <el-option :key="-1" label="所有執修項目" value=""> </el-option>
            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <el-select v-model="subtype_new" placeholder="執修事項" class="selects-item-cs" @change="handleDefectReportChange">
            <el-option :key="-1" label="所有執修事項" value=""> </el-option>
            <el-option v-for="item in subTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        <el-select v-model="material_order" placeholder="待料單"
                   class="selects-item-cs"
                   @change="handleDefectReportChange">
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
        <el-select v-model="working_status" placeholder="執修狀態" class="selects-item-cs" @change="handleDefectReportChange">
          <el-option label='所有狀態' :key="-1" value=""></el-option>
          <el-option v-for="item in statusList" :label="item.label" :key="item.value" :value="item.value">
          </el-option>
        </el-select>
      </el-row>

        <el-collapse v-model="defectreporttab" @change="handleaccordionChange">
          <el-collapse-item v-for="item in defectBatchList" :key="item.id" :label="item.feedback_display_name" :name="item.id">
            <template slot="title"><div style="font-size:12px;font-weight:light;" v-html="item.feedback_display_name"></div></template>
            <el-scrollbar style="height: 300px">
              <el-table :data="item.defectitem" :ref="item.defectitem.batch_id" v-loading="loading" element-loading-text="數據加載中" style="width: 100%;" :row-style="tableRowStyle">
              <el-table-column prop="item_seq" label='事項'></el-table-column>
              <el-table-column prop="position_name_c" label="執修位置"></el-table-column>
              <el-table-column prop="type_name_c" label="執修項目"> </el-table-column>
              <el-table-column prop="subtype_name_c" label="執修事項"> </el-table-column>
              <el-table-column prop="working_status" label="執修狀態"> </el-table-column>
              <el-table-column prop="update_date" label="狀態日期"> </el-table-column>
              <el-table-column prop="finish_date" label="實際完工日"> </el-table-column>
              <el-table-column prop="signoff_date" label="業主簽收日期"> </el-table-column>
              <el-table-column prop="redo_date" label="需重做"> </el-table-column>
              <el-table-column prop="material_items" label="待料項目"> </el-table-column>
              <el-table-column prop="material_order" label="待料單"> </el-table-column>
              <el-table-column prop="material_arrival_date" label="到料期"> </el-table-column>
              <el-table-column prop="remarks" label="備註"> </el-table-column>
              <el-table-column prop="alter_time" label="最後更新日期"> </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleItemDetail(scope.row)">瀏覽/編輯</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- <section class="page-footer">
              <span class="list-num">共{{item.defectitemcount}}條記錄</span>
              <el-pagination
              background
              small
              layout="prev, pager, next"
              :total="parseInt(item.defectitemcount)"
              :hide-on-single-page="true"
              :page-size="10"
              :current-page.sync ="currentDefectPage"
              :data="item.defectitem"
              class="page-num">
              </el-pagination>
            </section> -->
            </el-scrollbar>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="相關聯繁" name="relatedequiry">
        <el-table :data="relatedequiry" v-loading="loading" element-loading-text="數據加載中" style="width: 100%">
          <el-table-column prop="enquiry_id" label="查詢編號"></el-table-column>
          <el-table-column prop="channel" label="查詢渠道"></el-table-column>
          <el-table-column prop="username" label="查詢者姓名/公司"> </el-table-column>
          <el-table-column prop="phone" label="手提電話"> </el-table-column>
          <el-table-column prop="email" label="郵箱地址"> </el-table-column>
          <el-table-column prop="content" label="內容" min-width="200px">
            <template slot-scope="scope">
              <span v-html="scope.row.content"></span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="狀態"> </el-table-column>
          <el-table-column prop="create_time" label="創建時間" min-width="150px"></el-table-column>
          <el-table-column label="操作" min-width="110px">
            <template slot-scope="scope">
            <el-button type="text" @click="handleRelatedEdit(scope.row)">瀏覽/編輯</el-button>
            </template>
          </el-table-column>
        </el-table>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
  // import UEditor from '../common/UEditor';
  import RemarkItem from './remarkItem';
  import FeedbackContentItem from './feedbackContentItem';
  import SingleImgUpload from "../common/SingleImgUpload/SingleImgUpload";
  import { edit, save, getDefaultArray } from '@/api/feedback/feedbackDetail';
  import { baseVanke, baseUtil, } from '@/util/index';
  import { feedback } from '@/api/system/feedback';
  import moment from 'moment';
  import { defectBatchDataWithItem } from '@/api/defectReportBatch/defectReportBatchList';
  import { getListBatch } from '@/api/defectReportBatch/defectReportBatchNew';
	import { selectLists, getlist, defectData } from '@/api/defectReport/defectReportList';
	import { getUnitInformation } from '@/api/defectReportBatch/defectReportBatchNew';

  export default {
    name: "feedbackDetail",
    components: {
      // UEditor,
      RemarkItem,
      FeedbackContentItem,
      SingleImgUpload,
    },
    data() {
      const checkEmailFormat = (rule, value, callback) => {
        const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!value) {
          callback()
        } else {
          if (emailReg.test(value)) {
            callback()
          } else {
            callback(new Error('郵箱格式不正確'))
          }
        }
      };

      return {
        id: '',
        loading: false,
        submitLoading: false,
        feedbackTab: 'feedbackdetails',
        defectreporttab: ['1'],
        rules: {
          username: [
            {required: true, message: '請輸入查詢者姓名/公司', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '請輸入反饋內容', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '請選擇狀態', trigger: 'blur'}
          ],
          enquiry_date: [
            {required: true, message: '請選擇查詢日期', trigger: 'blur'}
          ],
          channel_id: [
            {required: true, message: '請輸入查詢渠道', trigger: 'blur'}
          ],
          email: [
            { validator: checkEmailFormat, trigger: 'blur'},
          ],
        },

        VIEW: false,
        VIEW_SELF: false,
        CREATE: false,
        EDIT: false,
        EDIT_SELF: false,
        DELETE: false,
        EXPORT: false,
        VIEW_REMARK: false,
        CREATE_REMARK: false,
        ASSIGN: false,

        UPDATE_TO_STATUS_1: false,
        UPDATE_TO_STATUS_2: false,
        UPDATE_TO_STATUS_3: false,
        UPDATE_TO_STATUS_4: false,
        UPDATE_TO_STATUS_5: false,
        UPDATE_TO_STATUS_6: false,

        IS_SELF_CREATE: false,
        IS_CHANNEL_EDITABLE: false,
        
        feedback: {
          id: '',
          enquiry_id: '(系統自動填寫)',
          channel_id: '',
          club_id: '',
          project_id: '',
          project_address: '',
          username: '',
          nationcode: '852',
          phone: '',
          email: '',
          category: '',
          content: '',
          contact_person: '',
          assigned_group_id: '',
          status: '',
          enquiry_date: moment().format("YYYY-MM-DD HH:mm:ss"),
          extend: [],
          contentList: [],
          create_user_info: {},
        },
        projectList: [],
        userList: [],
        userGroupList: [],
        projectUnitList: [],
        codeList: [],
        feedbackChannelList: [],
        feedbackCategoryList: [],
        length: 10, // 每頁數量
        listLength: 0, // 全部條數
        currentPage: 0, // 當前頁
        currentDefectPage: 0,
        relatedequiry: [],
        defectBatchList:[],
        tower_number: '',
        floor_display_name: '',
        unit_number: '',
        position_new: '',
        type_new: '',
        subtype_new: '',
        is_signoff: '',
        enter_method: '',
        letter_type: '',
        material_order: '',
        working_status: '',
        submission_date: '',

        defaultArray: '',

        pickerOptions: { disabledDate: this.disabledDate },
        isEnableAdvSearch: false,
      }
    },
    mounted() {
      this.defaultArray = JSON.parse(sessionStorage.getItem("defaultArray"));
      if(!!this.defaultArray) {
        this.setDefault();
      }
    },
    activated() {
      this.initDetail();
      if(!this.defaultArray) {
        getDefaultArray().then((response) => {
          this.defaultArray = response.data;
          sessionStorage.setItem("defaultArray", JSON.stringify(response.data));
          this.setDefault();
        });
      }
      let self = this;
      getlist().then((response) =>{
	    			self.positionList = baseVanke.elFormatArray(response.data.position.data, 'id', 'name_c');
		    		self.typeList = baseVanke.elFormatArray(response.data.type.data, 'id', 'name_c');
			    	self.subTypeList = baseVanke.elFormatArray(response.data.subtype.data, 'id', 'name_c');
            self.statusList = baseVanke.elFormatArray(response.data.status);
            self.materialList = baseVanke.elFormatArray(response.data.material);
            getListBatch().then((response) =>{
              this.order_typeList = baseVanke.elFormatArray(response.data.order_type);
      				this.enter_methodList = baseVanke.elFormatArray(response.data.enter_method);
      				this.lettertypeList = baseVanke.elFormatArray(response.data.letter_type);
      				this.yesnoList = baseVanke.elFormatArray(response.data.yesno);
  			    }).catch((error) => {
		  		    this.loading = false;
	  			    this.$message.error(error.message);
  			    });
  		}).catch((error) => {
				    this.loading = false;
				    this.$message.error(error.message);
			});
      self.getItemDetail();
      // selectLists().then(function (response) {
			// 	self.statusList = baseVanke.elFormatArray(response.data.status);
      //   self.getItemDetail();
      // });
    },
    deactivated() {
      this.initDetail();
    },
    methods: {
      /*
       * 初始化頁面數據
       * */
      handleTabClick(tab, event) {
      },
      handleaccordionChange(val) {
      },
      initDetail() {
        this.id = '';
        this.feedback = {
          id: '',
          enquiry_id: '(系統自動填寫)',
          channel_id: '',
          club_id: '',
          project_id: '',
          project_address: '',
          username: '',
          nationcode: '852',
          phone: '',
          email: '',
          category: '',
          content: '',
          contact_person: '',
          assigned_group_id: '',
          status: '',
          enquiry_date: moment().format("YYYY-MM-DD HH:mm:ss"),
          extend: [],
          contentList: [],
          create_user_info: {},
        };
        this.tower_number = '';
        this.floor_display_name = '';
        this.unit_number = '';
        this.position_new = '';
        this.type_new = '';
        this.subtype_new = '';
        this.positionList = [];
        this.typeList = [];
        this.subTypeList = [];
        this.statusList = [];
        this.order_typeList = [];
        this.enter_methodList = [];
        this.enter_method = '';
        this.order_type = '';
        this.working_status = '';
        this.is_signoff = '';
        this.material_order = '';
        this.submission_date = '';

        this.length= 10; // 每頁數量
        this.listLength= 0; // 全部條數
        this.currentPage= 0; // 當前頁
        this.relatedequiry=[];
        this.defectBatchList=[];
        this.$refs.feedback.clearValidate(); // 清空規則
      },
      /*
      * 獲取當前頁面的詳細信息
      * */
      getItemDetail() {
        this.loading = true;
        const self = this;
        this.id = this.$route.query.id;
        let reqData = {
          id: this.id
        };
        edit(reqData).then(function(response){
          self.IS_SELF_CREATE = (response.data.current_user_id == response.data.feedbackInfo.create_by);
          self.IS_IN_ASSIGNED_GROUP = (response.data.current_user_group_id == response.data.feedbackInfo.assigned_group_id);

          let hasPermission = (
            response.data.VIEW ||
            (response.data.VIEW_SELF && (self.IS_SELF_CREATE || self.IS_IN_ASSIGNED_GROUP)) ||
            (response.data.CREATE && !self.id)
          );

          if (!hasPermission) {
            self.$message.error('沒有權限！');
            self.$router.push('/feedback/list');
            return;
          }

          self.VIEW = response.data.VIEW;
          self.VIEW_SELF = response.data.VIEW_SELF;
          self.CREATE = response.data.CREATE;
          self.EDIT = ((response.data.EDIT) || (response.data.EDIT_SELF && (self.IS_SELF_CREATE || self.IS_IN_ASSIGNED_GROUP)));
          self.EDIT_SELF = response.data.EDIT_SELF;
          self.DELETE = response.data.DELETE;
          self.EXPORT = response.data.EXPORT;
          self.VIEW_REMARK = response.data.VIEW_REMARK;
          self.CREATE_REMARK = response.data.CREATE_REMARK;
          self.ASSIGN = response.data.ASSIGN;
        
          self.UPDATE_TO_STATUS_1 = response.data.UPDATE_TO_STATUS_1;
          self.UPDATE_TO_STATUS_2 = response.data.UPDATE_TO_STATUS_2;
          self.UPDATE_TO_STATUS_3 = response.data.UPDATE_TO_STATUS_3;
          self.UPDATE_TO_STATUS_4 = response.data.UPDATE_TO_STATUS_4;
          self.UPDATE_TO_STATUS_5 = response.data.UPDATE_TO_STATUS_5;
          self.UPDATE_TO_STATUS_6 = response.data.UPDATE_TO_STATUS_6;

          if(self.id) {
            self.feedback =  Object.assign({}, self.feedback,response.data.feedbackInfo);
            // self.setUeditorContent();
          }

          self.projectList = baseVanke.elPropertyList(response.data.projectList);
          self.userList = baseVanke.elUserList(response.data.userList);
          self.userGroupList = baseVanke.elUserGroupList(response.data.userGroupList);
          self.projectUnitList = response.data.projectUnitList;
          self.feedbackChannelList = response.data.feedbackChannelList;
          self.feedbackCategoryList = response.data.feedbackCategoryList;

          self.IS_CHANNEL_EDITABLE = (
            (self.CREATE && !self.id) || 
            (self.EDIT && self.id && (self.feedback.channel_id == '' || !self.feedback.channel_id))
          );

          if (self.id) {
            self.addRemarkItem();
          }
          self.getRelatedEquiry()
        }).catch(function(error) {
          self.$message.error(error.message);
        }).finally(function() {
          self.loading = false;
        });
      },
      handleItemDetail(row){
        const self = this;
        self.$router.push({
          path: '/defect-report/detail',
          query: {
            id: row.id
          }
        })
      },
      handleRelatedEdit(row) {
        const self = this;
        self.$router.replace({
          path: '/feedback/detail',
          query: {
            id: row.id
          }
        })
        self.id = row.id;
        self.getItemDetail();
        self.feedbackTab = 'feedbackdetails';
      },
      handlePageChange() {
        this.getRelatedEquiry();
      },
      getRelatedEquiry(){
        const self = this;
        if (self.feedback.project_address != ''){
          let resData = {
            start: (self.currentPage-1)*self.length,
            length: self.length,
            project_address: self.feedback.project_address,
            project_id: self.feedback.project_id
          };
          feedback(resData).then(function(response){
            self.relatedequiry = baseVanke.elFeedbackList(response.data.data);
            self.listLength = parseInt(response.data.count);
            self.getDefectBatch();
          });
        } else {
            self.getDefectBatch();
        }
      },
      handleDefectReportChange(){
        let self = this;
        self.loading = true;
        let resData = {
            unit_id: '',
            project_id: self.feedback.project_id,
            length: 99999,
            tower_number: self.tower_number,
            floor_display_name: self.floor_display_name,
            unit_number: self.unit_number,

            batch_id_partial: self.batch_id,
            order_type: self.order_type,
            submission_date: self.submission_date,
            enter_method: self.enter_method,
            is_signoff: self.is_signoff,
            letter_type: self.letter_type,

            position_new: self.position_new,
            type_new: self.type_new,
            subtype_new: self.subtype_new,
            material_order: self.material_order,
            status: self.working_status,
        };
        console.log(resData);
        defectBatchDataWithItem(resData).then(function(response){
          console.log(response);
            self.defectBatchList = baseVanke.elDefectBatchListWithItem(response.data.list, self.enter_methodList, self.order_typeList, self.lettertypeList);
            self.defectBatchList.forEach(function(item){
              item.defectitem.forEach(function(defectitems){
                defectitems.working_status = baseVanke.getLabel(defectitems.working_status, self.statusList);
                defectitems.letter_type = baseVanke.getLabel(defectitems.letter_type, self.lettertypeList);
                if (defectitems.remarks != null) {
                  if (defectitems.remarks.length > 10){
                    defectitems.remarks = defectitems.remarks.substring(0, 10)+"...";
                  }
                }
              });
            });
            self.loading = false;
        }).catch((error) => {
				    this.loading = false;
				    this.$message.error(error.message);
			  });
        // if (self.feedback.project_address != ''){
        // }
      },
      getDefectBatch(){
        const self = this;
        if (self.feedback.project_address != ''){
          const unitinfo = self.feedback.project_address.split("-"); 
          self.tower_number = unitinfo[0];
          if (unitinfo[1] !== undefined) {
            self.floor_display_name = parseInt(unitinfo[1]);
            self.unit_number = unitinfo[1].substring(unitinfo[1].length - 1);
          }

          let resData = {
            project_id: self.feedback.project_id,
            tower_number: self.tower_number,
            floor_display_name: self.floor_display_name,
            unit_number: self.unit_number,
            length: 99999,
            batch_id: self.batch_id,
            position_new: self.position_new,
            type_new: self.type_new,
            subtype_new: self.subtype_new,
            order_type: self.order_type,
            enter_method: self.enter_method,
            letter_type: self.letter_type,

            material_order: self.material_order,
            working_status: self.working_status,
          };
          defectBatchDataWithItem(resData).then(function(response){
            self.defectBatchList = baseVanke.elDefectBatchListWithItem(response.data.list, self.enter_methodList, self.order_typeList, self.lettertypeList);
            self.defectBatchList.forEach(function(item){
              item.defectitem.forEach(function(defectitems){
                defectitems.working_status = baseVanke.getLabel(defectitems.working_status, self.statusList);
                defectitems.letter_type = baseVanke.getLabel(defectitems.letter_type, self.lettertypeList);
                if (defectitems.remarks != null) {
                  if (defectitems.remarks.length > 10){
                    defectitems.remarks = defectitems.remarks.substring(0, 10)+"...";
                  }
                }
              });
            });
            self.getListItem();
          }).catch((error) => {
				    this.loading = false;
				    this.$message.error(error.message);
			    });
        } else {
          self.getListItem();
        }
      },
      getListItem(){
        const self = this;
				let reqdata = {
					project_id: this.feedback.project_id,
				};
        console.log(reqdata);
				getUnitInformation(reqdata).then((response) =>{
					self.towerList = baseVanke.elFormatArray(response.data.towerlist);
					self.floorList = baseVanke.elFormatArray(response.data.floorlist);
					self.unitList = baseVanke.elFormatArray(response.data.unitlist);
				}).catch((error) => {
				  this.loading = false;
				  this.$message.error(error.message);
			  });
      },

      /**
       * 跟進備註列表操作
       */
      extendSubmitFormat(extend) {
        if(extend instanceof Array) {
          extend.forEach((item,index) => {
            item.sort = index + 1;
          });
        }
      },
      /**
       * 添加跟進備註
       */
      addRemarkItem() {
        let item ={
          feedback_id: this.id,
          content: '',
          remark_date: moment().format("YYYY-MM-DD HH:mm:ss"),
          create_user_info: {
            'name': '(系統自動填寫)'
          },
          assigned_group_name: '(系統自動填寫)',
          sort: ''
        };
        this.feedback.extend.push(item);
      },
      // 排序上移
      extendSortUp(index) {
        let extend = this.feedback.extend;
        if(index> 0) { // 不是第一個的可以上移
          extend = baseUtil.arrayChangeItem(extend,index,index-1);
        }
      },
      // 排序下移
      extendSortDown(index) {
        let extend = this.feedback.extend;
        if(index < extend.length-1) { // 不是最後一個的可以下移
          extend = baseUtil.arrayChangeItem(extend,index,index+1);
        }
      },
      // 刪除條目
      extendItemDelete(index) {
        const self = this;
        this.$confirm('請注意此操作無法恢復，是否繼續?', '確認刪除操作', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          self.feedback.extend.splice(index,1);
          self.$message({
            type: 'success',
            message: '刪除成功!'
          });
        }).catch(function() {
          self.$message({
            type: 'info',
            message: '已取消刪除'
          });
        });
      },


      /**
       * 添加備註 (for create only)
       */
      addFeedbackContentItem() {
        let item ={
          content: '',
          category: ''
        };
        this.feedback.contentList.push(item);
      },
      // 排序上移
      feedbackContentItemSortUp(index) {
        let contentList = this.feedback.contentList;
        if(index> 0) { // 不是第一個的可以上移
          contentList = baseUtil.arrayChangeItem(contentList,index,index-1);
        }
      },
      // 排序下移
      feedbackContentItemSortDown(index) {
        let contentList = this.feedback.contentList;
        if(index < extend.length-1) { // 不是最後一個的可以下移
          contentList = baseUtil.arrayChangeItem(contentList,index,index+1);
        }
      },
      // 刪除條目
      feedbackContentItemDelete(index) {
        const self = this;
        this.$confirm('請注意此操作無法恢復，是否繼續?', '確認刪除操作', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          self.feedback.contentList.splice(index,1);
          self.$message({
            type: 'success',
            message: '刪除成功!'
          });
        }).catch(function() {
          self.$message({
            type: 'info',
            message: '已取消刪除'
          });
        });
      },

      // 提交
      onSubmit() {
        // this.getUeditorContent(); //獲取富文本編輯器內容
        const self = this;
        // 驗證擴展組件的規則
        let remarkValid = true;

        if (this.VIEW_REMARK && this.id) {
          this.feedback.extend.forEach(function(item,index){
            remarkValid = remarkValid && self.$refs.remark[index].validateForm();
          });
        }

        this.$refs.feedback.validate((valid)=>{
          if(valid && remarkValid) {
            this.submitLoading = true;
            this.extendSubmitFormat(this.feedback.extend); // 給extend添加sort字段值
            let data = {
              feedback:{
                channel_id: this.feedback.channel_id,
                club_id: this.feedback.club_id,
                project_id: this.feedback.project_id,
                project_address: this.feedback.project_address,
                username: this.feedback.username,
                nationcode: this.feedback.nationcode,
                phone: this.feedback.phone,
                email: this.feedback.email,
                category: this.feedback.category,
                content: this.feedback.content,
                contact_person: this.feedback.contact_person,
                assigned_group_id: this.feedback.assigned_group_id,
                status: this.feedback.status,
                enquiry_date: this.feedback.enquiry_date
              },
              feedbackExtend: (this.VIEW_REMARK ? this.feedback.extend || [] : []),
              feedbackContent: this.feedback.contentList || []
            };
            if(this.id) { // 編輯狀態，
              data.feedback.id =  this.id;
            }
            save(data).then(function() {
              self.$message({
                type: 'success',
                message: '提交成功!'
              });
              self.$router.push('/feedback/list');
            }).catch(function(error){
              self.$message.error(error.message)
            }).finally(function() {
              self.submitLoading = false;
            });
          } else {
            self.$message.error('表單填寫有誤！');
            return false;
          }
        });
      },

      unitSearch (queryString, cb) {
        var units = this.projectUnitList;
        var results = this.feedback.project_id != "" ? units.filter(this.createUnitFilter(queryString)) : [];
        cb(results);
      },

      createUnitFilter(queryString) {
        return (units) => {
          return (units.value.toLowerCase().includes(queryString.toLowerCase()) && units.property_id == this.feedback.project_id)
          return (units.value.toLowerCase().search(queryString.toLowerCase()) === 0 && units.property_id == this.feedback.project_id);
          // return (units.value.toLowerCase().search(queryString.toLowerCase()) === 0 && units.property_id == this.feedback.project_id);
        };
      },

      // 初始化页面默认数据
      setDefault() {
        this.codeList = baseVanke.elFormatCodeArray(this.defaultArray.phone_code,'nationcode','name_e','nationcode');
      },

      disabledDate(date) {
        return date.getTime() > Date.now();
      },
      toggleAdvSearch(status) {
        this.isEnableAdvSearch = status;
      },
    }
  }
</script>

<style scoped>

  .add-extend {
    width: 50px;
    height:50px;
    line-height: 50px;
  }

  .feedback-container {
    width: 100%;
  }

  .feedback-container-item {
    width: 48%;
    display: inline-block;
    vertical-align: top;
  }
</style>



// WEBPACK FOOTER //
// src/components/feedback/feedbackDetail.vue