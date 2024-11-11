import JSEncrypt from '@/vendor/jsencrypt-master';
/*
* 项目中通用的一些处理逻辑
* */
const search = function() {};
/**
 * 输入后端数据，返回一个el-select默认样式的数组
 * @param oldArray - 后端返回数据
 * @returns {Array} - el-select数组
 */
const elFormatArray = function (oldArray, val, lab) {
  if(oldArray instanceof Array) {
    let elArray = []; // 返回一个el可以使用的数组
    oldArray.forEach(function(item) {
      let elItem = {};
      elItem.value = item[val] || item.value;
      elItem.label = item[lab] || item.text;
      elArray.push(elItem);
    }) ;
    return elArray;
  } else {
    console.log('elFormatArray: 输入值不是数组！！');
  }
};
const elFormatArrayNewBatch = function (oldArray, val, lab) {
  let elArray = [];
  let elItem = {};
  elItem.value = "新批量";
  elItem.label = "新批量";
  elArray.push(elItem);
  if(oldArray instanceof Array) {
    oldArray.forEach(function(item) {
      let elItem = {};
      elItem.value = item[val] || item.value;
      elItem.label = item[lab] || item.text;
      elArray.push(elItem);
    }) ;
  }
return elArray;
};
/**
 * 输入后端数据，生成电话区号数组
 * @param oldArray - 后端返回数据
 * @returns {Array} - el-select数组
 */
const elFormatCodeArray = function (oldArray,val, lab1, lab2) {
  if(oldArray instanceof Array) {
    let elArray = []; // 返回一个el可以使用的数组
    oldArray.forEach(function(item) {
      let elItem = {};
      elItem.value = item[val];
      elItem.label = item[lab1] + '(+' + item[lab2] +')';
      elArray.push(elItem);
    }) ;
    return elArray;
  } else {
    console.log('elFormatCodeArray: 输入值不是数组！！');
  }
};

/**
 * 将selectList中value为''去掉
 * @param oldList
 * @returns {Array}
 */
const valueList = function (oldList) {
  let valueList = [];
  oldList.forEach(function(item) {
    if(item.value) {
      valueList.push(item);
    }
  });
  return valueList;
};
/**
 * 输入状态代码返回状态值
 * @param value - 状态代码
 * @param elList - 状态列表,array
 * @returns {string} - 状态值
 */
const getLabel = function(value, elList) {
  if(elList instanceof Array) {
    for(let item of elList) {
      if (value == null){
        return 'NA';
      }
      if(item.value === value) {
        return item.label;
      }
    }
  }
  return false;
};


/**
 * 生成项目管理页el-table可用的数组
 * @param oldArray - 后端返回数据
 * @returns {Array} - 项目管理页el-table可用数组
 */
const elProjectList = function(oldArray,typeList,categoryList,statusList,visibleList) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        name: item.name_c,
        type: getLabel(item.type,typeList),
        category: getLabel(item.category,categoryList),
        status: getLabel(item.status,statusList),
        visible: item.visible === '0'?true:false,
        visibleLabel: getLabel(item.visible,visibleList),
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};
/**
 * 格式化项目进度
 * @param oldArray
 * @returns {Array}
 */
const elProgressList = function(oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        progress_time: item.progress_time,
        desc_c: item.desc_c,
        title_c: item.title_c,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};


const elSalesList = function(oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        unit_id: item.unit_id,
        pasp_number: item.pasp_number,
        tower_number: item.tower_number,
        floor_display_name: item.floor_display_name,
        unit_number: item.unit_number,
        club_id: item.club_id,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};


const elFloorplanList = function(oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        floorplan_id: item.floorplan_id,
        property_id: item.property_id,
        image: item.image,
        mapping: item.mapping,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

/**
 * 格式化折扣列表
 * @param oldArray
 * @param visibleList
 * @returns {Array}
 */
const elDiscountedList = function(oldArray,visibleList) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        name: item.title_c,
        date: item.create_time,
        visible: getLabel(item.visible,visibleList)
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

/**
 * 格式化活动列表
 * @param oldArray
 * @param categoryList
 * @param visibleList
 * @returns {Array}
 */
const elActivityList = function(oldArray,categoryList,visibleList) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        title_c: item.title_c,
        activity_begin_date: item.activity_begin_date,
        attend_end_date: item.attend_end_date,
        userlimit: item.userlimit,
        category: getLabel(item.category,categoryList),
        visible: item.visible === '0'?true:false
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};
/**
 *格式化联络信息
 * @param oldArray
 * @returns {Array}
 */
const elContactList = function(oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        activity_id: item.activity_id,
        title_c: item.title_c,
        create_time: item.create_time,
        email: item.email,
        content: item.content,
        status: item.status,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

/**
 * 格式化用户管理列表
 * @param oldArray
 * @returns {Array}
 */
const elCustomerList = function(oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id, // id
        title: item.title, // 姓名
        name_c: item.name_c, // 姓名
        name_e: item.name_e, // 姓名
        level_name: item.level_name, // 会籍名
        club_id: item.club_id,// 会员号码
        create_time: item.create_time,// 注册日期
        phone: item.phone, // 手机号
        email: item.email, // 邮箱
        payStatus: item.payStatus, // 是否有付款进度
        sales_source: item.sales_source,
        deleted: item.deleted,// 是否已刪除
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};
/***
 * 格式化付款进度列表
 * @param oldArray
 * @returns {Array}
 */
const elPaymentList = function(oldArray,projectList,statusList) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        project_id:  item.project_id,
        project_name: getLabel(item.project_id,projectList),
        customer_id: item.customer_id,
        periods_c: item.periods_c,
        periods_e: item.periods_e,
        amount: item.amount,
        status: item.status=== '0'?true:false, // 1为未付款0为已付款
        statusLabel: getLabel(item.status,statusList),
        pay_date: item.pay_date,
        name_c: item.name_c,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

/**
 * 格式化会籍信息列表
 * @param oldArray
 * @returns {Array}
 */
const elLevelList = function(oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        name: item.name,
        benefit: item.num,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};
/**
 * 格式化后台管理员列表
 * @param oldArray
 * @returns {Array}
 */
 const elUserList = function(oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        name: item.name,
        username: item.username,
        project_id: item.project_id,
        user_group_id: item.user_group_id,
        project_name: item.project_name,
        user_group_name: item.user_group_name,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

const elUserGroupList = function(oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        name: item.name,
        access_items: item.access_items,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

/**
 * 后台管理员页权限列表
 * @param oldArray
 * @returns {Array}
 */
const elUserTagFormat = function (oldArray) {
  if(oldArray instanceof Array) {
    let elArray = []; // 返回一个el可以使用的数组
    oldArray.forEach(function(item) {
      let elItem = {};
      elItem.value = item.tagid;
      elItem.label = item.tagname;
      elArray.push(elItem);
    }) ;
    return elArray;
  } else {
    console.log('elFromatArray: 输入值不是数组！！');
  }
};

const elProjectFormat = function (oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {};
      elItem.value = item.id;
      elItem.label = item.name_c;
      elArray.push(elItem);
    }) ;
    return elArray;
  } else {
    console.log('elFromatArray: 输入值不是数组！！');
  }
};

const elUserGroupFormat = function (oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {};
      elItem.value = item.id;
      elItem.label = item.name;
      elArray.push(elItem);
    }) ;
    return elArray;
  } else {
    console.log('elFromatArray: 输入值不是数组！！');
  }
};

/**
 * 后台管理员页权限列表
 * @param oldArray
 * @returns {Array}
 */
const elSubscribeList = function (oldArray) {
  if(oldArray instanceof Array) {
    let elArray = []; // 返回一个el可以使用的数组
    oldArray.forEach(function(item) {
      let elItem = {};
      elItem.email = item.email;
      elArray.push(elItem);
    }) ;
    return elArray;
  } else {
    console.log('elSubscribeList: 输入值不是数组！！');
  }
};

/**
 * 格式化广告列表
 * @param oldArray
 * @returns {Array}
 */
const elAdvertList = function(oldArray,siteList, jumpList) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        site: getLabel(item.site,siteList),
        title_c: item.title_c,
        jump_type: getLabel(item.jump_type,jumpList),
        url: item.url || getLabel(item.jump_type,jumpList)+'詳情頁',
        visible: item.visible === '0'?true:false,
        sort: item.sort,
      };
      if(item.jump_type === '2') {
        elItem.url = ''; // 无跳转时显示空
      }
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

/**
 * 联系我们信息格式化
 * @param oldArray
 * @returns {Array}
 */
const elFeedbackList = function(oldArray) {
  var categoryLabels = [ '-', '會籍查詢', '銷售查詢', '物業管理查詢' ];
  var statusLabels = [ '-', '待處理', '處理中', '已完成', '關閉', '拒絕', '取消' ];
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        club_id: item.club_id,
        content: item.content,
        email: item.email,
        phone: (item.nationcode != null ? '+' + item.nationcode + ' ' : '') + item.phone,
        category: categoryLabels[item.category],
        project_id: item.project_id,
        project_name: item.project_name,
        project_address: item.project_address,
        create_time: item.create_time,
        username: item.username,
        channel: item.channel_name,
        enquiry_id: item.enquiry_id,
        status: statusLabels[item.status],
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

const elFeedbackCategoryList = function(oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        name: item.name,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

const elFeedbackChannelList = function(oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        name: item.name,
        prefix: item.prefix,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

const elPropertyList = function(oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        name_c: item.name_c
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};
/**
 * 消息管理信息格式化
 * @param oldArray
 * @returns {Array}
 */
const elMessageList = function(oldArray,typeList,sendTypeList,statusList) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        title_c: item.title_c, // 标题
        msg_type: getLabel(item.msg_type,typeList), // 消息类型
        send_date: item.send_date, // 发送日期
        send_type: getLabel(item.send_type,sendTypeList), // 发送目标
        status: item.status,
        statusLabel: getLabel(item.status,statusList),
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};
/**
 * 规范vkCheckboxGroup输入选项信息的格式
 * @param oldArray
 * @returns {Array}
 */
const vkFormatCheckList = function(oldArray,name,desc) {
  if(oldArray instanceof Array) {
    let elArray = []; // 返回一个el可以使用的数组
    oldArray.forEach(function(item) {
      let elItem = {};
      elItem.id = item.id;
      elItem.name = item[name];
      elItem.desc = item[desc];
      elItem.status = false;
      elArray.push(elItem);
    }) ;
    return elArray;
  } else {
    console.log('vkFormatCheckList: 输入值不是数组！！');
  }
};

/**
 * 格式化缺陷
 * @param oldArray
 * @returns {Array}
 */
 const elDefectList = function(oldArray, positionList, typeList, subtypeList, statusList) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      if (item.remark != null) {
        if (item.remark.length > 10){
          item.remark = item.remark.substring(0, 10)+"...";
        }
      }
      let elItem = {
        id: item.id,
        batch_id: item.batch_id,
        item_seq: item.item_seq, // 缺陷描述
        position_new: getLabel(item.position_new, positionList),
        position_name: item.position_name_c,
        type_new: getLabel(item.type_new, typeList),
        type_name: item.type_name_c,
        subtype_new: getLabel(item.subtype_new, subtypeList),
        subtype_name: item.subtype_name_c,
        redo_date: item.redo_date,
        material_order: item.material_order,
        material_items: item.material_items,
        material_arrival_date: item.material_arrival_date,
        is_hotcase: item.is_hotcase,
        finish_date: item.finish_date,
        remark: item.remark,
        working_status: getLabel(item.working_status, statusList),
        update_date: item.update_date,
        signoff_date: item.signoff_date,
        create_time: item.create_time,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

const elDefectLogList = function(oldArray, statusList) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        defect_id: item.defect_id, // 缺陷描述
        field: item.field,
        new_status: getLabel(item.new_status, statusList),
        original_status: getLabel(item.original_status, statusList),
        updated_date: item.updated_date,
        updated_by: item.updated_by,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};
const elDefectHolidayList = function(oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        date: item.date, // 缺陷描述
        name: item.name,
        weekday: item.weekday,
        apply: item.apply,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};
const elDefectDataItemList = function(oldArray, statusList) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        name_c: item.name_c, // 缺陷描述
        name_sc: item.name_sc,
        name_e: item.name_e,
        category: getLabel(parseInt(item.category), statusList),
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

const elDefectBatchList = function(oldArray, enter_methodList, order_typeList) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        project_name_c: item.project_name_c,
        tower_number: item.tower_number,
        floor_display_name: item.floor_display_name,
        unit_number: item.unit_number,
        unit_id: item.unit_id,
        batch_seq: item.batch_seq,
        order_checking_date: item.order_checking_date,
        signoff_date: item.signoff_date,
        submission_date: item.submission_date,
        enter_method: getLabel(item.enter_method, enter_methodList),
        days_used: item.days_used,
        channel: item.submission_channel,
        order_type: getLabel(item.order_type, order_typeList),
        is_signoff: item.is_signoff,
        is_hotcase: item.is_hotcase,
        order_receipt_date1: item.order_receipt_date1,
        batch_id: item.batch_id,
        create_time: item.create_time,
        defectitemcount: item.defectitemscount,
        feedback_display_name: "批量缺陷"+" "+item.batch_seq+" "+item.batch_id,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};
const elDefectBatchListWithItem = function(oldArray, enter_methodList, order_typeList, letter_typeList) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      if (item.order_checking_date == null){
        item.order_checking_date = "NA";
      }
      if (item.signoff_date == null){
        item.signoff_date = "NA";
      }
      if (item.is_signoff == null){
        item.is_signoff = "N";
      }
      let elItem = {
        id: item.id,
        project_name_c: item.project_name_c,
        tower_number: item.tower_number,
        floor_display_name: item.floor_display_name,
        unit_number: item.unit_number,
        unit_id: item.unit_id,
        batch_seq: item.batch_seq,
        order_checking_date: item.order_checking_date,
        signoff_date: item.signoff_date,
        submission_date: item.submission_date,
        enter_method: getLabel(item.enter_method, enter_methodList),
        days_used: item.days_used,
        channel: item.submission_channel,
        order_type: getLabel(item.order_type, order_typeList),
        is_signoff: item.is_signoff,
        is_hotcase: item.is_hotcase,
        order_receipt_date1: item.order_receipt_date1,
        batch_id: item.batch_id,
        create_time: item.create_time,
        defectitem: item.defectitems,
        defectitemcount: item.defectitemscount,
        feedback_display_name:  "<span style=\"color:#ff0000;\">"+getLabel(item.enter_method, enter_methodList) + "</span> | <span style=\"color:#ff0000;\">" + getLabel(item.order_type, order_typeList)+ "</span> | <span style=\"font-weight:900\">執修單總表編號:</span> <span style=\"color:#ff0000\">"+item.batch_id+"</span> | <span style=\"font-weight:900;font-size:12px\">執修單遞交日期:</span> <span style=\"color:#ff0000\">"+item.submission_date+"</span> | <span style=\"font-weight:900;font-size:12px\">已用日數:</span> <span style=\"color:#ff0000\">" + item.days_used+"</span> | <span style=\"font-weight:900;font-size:12px\">對單日期:</span> <span style=\"color:#ff0000\">"+item.order_checking_date + "</span> | <span style=\"font-weight:900;font-size:12px\">業主簽單日期:</span> <span style=\"color:#ff0000\">" + item.signoff_date + "</span> | <span style=\"font-weight:900;font-size:12px\">已簽全部完成項目:</span> <span style=\"color:#ff0000\">" + item.is_signoff + "</span> | <span style=\"font-weight:900\">發信種類:</span> <span style=\"color:#ff0000\">" + getLabel(item.letter_type, letter_typeList) + "</span>",
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

const elDefectBatchLogList = function(oldArray, statusList) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        defect_id: item.defect_id, // 缺陷描述
        field: item.field,
        new_status: item.new_status,
        original_status: item.original_status, statusList,
        updated_date: item.updated_date,
        updated_by: item.updated_by,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

/**
 * 格式化 AppVersion
 * @param oldArray
 * @returns {Array}
 */
const elAppVersionList = function(oldArray,statusList) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        os: item.os,
        build_version: item.build_version,
        force_update: (item.force_update == 1) ? 'Yes' : 'No',
        release_note: item.release_note,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

const elGuardList = function(oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        project_id: item.project_id,
        project_name: item.project_name,
        username: item.username,
        salute: item.salute,
        name: item.name,
        deleted: item.deleted,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

const elVisitorPassList = function(oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        club_id: item.club_id,
        project_id: item.project_id,
        project_name: item.project_name,
        unit_id: item.unit_id,
        visitor_pass_id: item.visitor_pass_id,
        visitor_salute: item.visitor_salute,
        visitor_name: item.visitor_name,
        visitor_count: item.visitor_count,
        driving_license: item.driving_license,
        reason: item.reason,
        start_datetime: item.start_datetime,
        end_datetime: item.end_datetime,
        effect_datetime: item.effect_datetime,
        number_of_access: item.number_of_access,
        qrcode_secret: item.qrcode_secret,
        deleted: item.deleted,
        create_datetime: item.create_datetime,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

const elVisitorLogList = function(oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        club_id: item.club_id,
        project_id: item.project_id,
        project_name: item.project_name,
        unit_id: item.unit_id,
        visitor_pass_id: item.visitor_pass_id,
        visitor_salute: item.visitor_salute,
        visitor_name: item.visitor_name,
        visitor_count: item.visitor_count,
        driving_license: item.driving_license,
        reason: item.reason,
        start_datetime: item.start_datetime,
        end_datetime: item.end_datetime,
        effect_datetime: item.effect_datetime,
        number_of_access: item.number_of_access,
        qrcode_secret: item.qrcode_secret,
        alert: item.alert,
        guard_id: item.guard_id,
        guard_username: item.guard_username,
        guard_name: item.guard_name,
        guard_action: item.guard_action,
        guard_reason: item.guard_reason,
        guard_reason_name: item.guard_reason_name,
        create_datetime: item.create_datetime,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

const elGuardReasonList = function(oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        title: item.title,
        value: item.value
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

const elAuditLogList = function(oldArray) {
  if(oldArray instanceof Array) {
    let elArray = [];
    oldArray.forEach(function(item) {
      let elItem = {
        id: item.id,
        module: item.module,
        module_display: item.module_display,
        item_id: item.item_id,
        keyword: item.keyword,
        action: item.action,
        action_display: item.action_display,
        content: item.content,
        detail: item.detail,
        operator: item.operator,
        create_time: item.create_time,
      };
      elArray.push(elItem);
    }) ;
    return elArray;
  }
};

const elEncryptRSA = function (publicKey, plaintext) {

  const encrypt = (publicKey, data) => {
      var encrypt = new JSEncrypt(); // Create a new instance of the JSEncrypt library.
      encrypt.setPublicKey(publicKey); // Set the public key for the encryption library.
      var encrypted = encrypt.encrypt(data); // Use the encrypt method of the library to encrypt the data.

      return encrypted; // Return the encrypted data.
  };
  return encrypt(publicKey, plaintext);
};

export default {
  elFormatArray,
  elFormatCodeArray,
  valueList,
  elProjectList,
  elProgressList,
  elSalesList,
  getLabel,
  elDiscountedList,
  elActivityList,
  elContactList,
  elCustomerList,
  elPaymentList,
  elLevelList,
  elUserList,
  elUserGroupList,
  elUserTagFormat,
  elProjectFormat,
  elUserGroupFormat,
  elSubscribeList,
  elAdvertList,
  elFeedbackList,
  elFeedbackChannelList,
  elFeedbackCategoryList,
  elPropertyList,
  elMessageList,
  vkFormatCheckList,
  elDefectList,
  elDefectHolidayList,
  elDefectLogList,
  elDefectBatchList,
  elDefectBatchListWithItem,
  elDefectBatchLogList,
  elDefectDataItemList,
  elFloorplanList,
  elAppVersionList,
  elGuardList,
  elVisitorPassList,
  elVisitorLogList,
  elGuardReasonList,
  elAuditLogList,
  elFormatArrayNewBatch,
  elEncryptRSA,
}



// WEBPACK FOOTER //
// ./src/util/baseVanke.js