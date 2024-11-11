/**
 * 遍历方法
 * @param {Object} obj - 遍历的对象
 * @param {function} cb - 回调函数 接受 (value,key)
 */
const each = (obj, cb) => {
  let keys;
  if (obj instanceof Array) {
    return obj.forEach(cb);
  } else if (typeof obj === 'object') {
    keys = Object.keys(obj);
    return keys.forEach((k) => {
      cb(obj[k], k);
    });
  }
  return null;
};

/**
 * 数组中两项交换位置
 * @param arr - 数组，交换位置直接在这个数组中操作
 * @param index1 - 第一个位置
 * @param index2 - 第二个位置
 * @returns {*} - 返回输入的数组
 */
const arrayChangeItem = function(arr, index1, index2) {
  let item1 = arr[index1],
    item2 = arr[index2];
  arr.splice(index1,1,item2);
  arr.splice(index2,1,item1);
  return arr;
};
/**
 * 移除数组中某个值对应的项
 * @param arr
 * @param val
 */
const arrayValRemove = function (arr,val) {
  arr.forEach(function(item, index) {
    if(item === val) {
      arr.splice(index,1); // 如果相同则删除
    }
  })
};
/*
* 数组深拷贝,不拷贝原型属性
* */
const deepClone = function (source) {
  if (!source && typeof source !== 'object') {
    return source;
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = source[keys].constructor === Array ? [] : {};
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  });
  return targetObj
};

/**
 * 去抖函数
 * @param method
 * @param delay
 * @returns {Function}
 */

const debounce = function (method,delay) {
  // let self = this;
  var timer = null;
  return function(method) {
    let context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() {
      method.apply(context,args);
    },delay);
  }
};

/**
 * 节流函数
 * @param method - 回调函数
 * @param duration - 时间间隔
 * @returns {Function} - 返回函数
 */
const throttle = function (method,duration) {
  let begin = new Date();
  return function() {
    let context = this, args = arguments, current = new Date();
    if(current-begin>=duration) {
      method.apply(context,args);
      begin = current;
    }
  }
};


export default {
  deepClone,
  each,
  debounce,
  throttle,
  arrayChangeItem,
  arrayValRemove,

}



// WEBPACK FOOTER //
// ./src/util/baseUtil.js