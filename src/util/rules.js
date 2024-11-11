
export default {
  /**
   * 必填项
   * @param {String} label
   */
  required(label, options = {}) {
    return {
      required: true,
      message: `${label}不能為空`,
      trigger: 'blur',
      ...options
    }
  },
  /**
   * 同意协议
   * @param label
   * @returns {{validator: validator, trigger: string}}
   */
  agreement(label) {
    return {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error(label))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  },
  /**
   * 密码规则：长度不小于8位，必须包括大小写字母和数字
   */
  password() {
    return {
      validator: (rule, value, callback) => {
        if (value.length < 8) {
          callback(new Error('密码长度不少于8位'))
        } else if (!/\d/.test(value) || !/[a-z]/.test(value) || !/[A-Z]/.test(value)) {
          callback(new Error('密码须包括大写字母、小写字母和数字'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  },
  /**
   * 4位验证码
   */
  vcode() {
    return {
      validator: (rule, value, callback) => {
        if (!/^\d{4}$/.test(value)) {
          callback(new Error('请输入正确的四位数字验证码'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  },

  /**
   * 邮箱
   */
  email() {
    return {
      validator: (rule, value, callback) => {
        const emailReg = /^[A-Za-z0-9_-\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (!value) {
          callback()
        } else {
          if (emailReg.test(value)) {
            callback()
          } else {
            callback(new Error('郵箱格式不正確'))
          }
        }
      },
      trigger: 'blur'
    }
  },

  /**
   * 用户名
   */
  username() {
    return {
      validator: (rule, value, callback) => {
        const usernameReg = /^[A-Za-z\u4e00-\u9fa5]+$/
        if (usernameReg.test(value)) {
          callback()
        } else {
          callback(new Error('仅限汉字或字母'))
        }
      },
      trigger: 'blur'
    }
  },
  /**
   * 限制长度
   * @param {Number} min
   * @param {Number} max
   */
  len(min = 0, max = Infinity) {
    let message
    if (min === 0) {
      message = `長度不能超過${max}個字符`
    } else if (max === Infinity) {
      message = `長度不能少於${min}個字符`
    } else {
      message = `長度必須在${min}到${max}個字符之間`
    }
    return {
      min,
      max,
      message,
      trigger: 'blur'
    }
  },

  /**
   * 正浮点数限制
   * @param {Number} i 整数最大位数
   * @param {Number} f 小数最大位数
   * @param {Object} option 配置
   *    isMoreThanZero: 是否强制大于0
   */
  float(i, f, option = {}) {
    return {
      validator: (rule, value, callback) => {
        let reg
        if (f == 0) {
          reg = new RegExp(`^\\d{1,${i}}$`)
        } else {
          reg = new RegExp(`^\\d{1,${i}}(\\.\\d{1,${f}})?$`)
        }
        if (!value) {
          callback()
        } else {
          if (reg.test(value)) {
            if (option.isMoreThanZero && Number(value) == 0) {
              callback(new Error('请输入大于零的数值'))
            } else {
              callback()
            }
          } else {
            let errmsg = `请输入正确的数值，最多包含${i}位整数`
            if (f != 0) {
              errmsg += `和${f}位小数`
            }
            callback(new Error(errmsg))
          }
        }
      },
      trigger: 'blur'
    }
  },

  /*
    不允许输入空格
   */
  notBlank(label){
    return {
      validator: (rule, value = '', callback) => {
        value += ''
        let arr = []
        value && (arr = value.split(" "))
        if(arr.length > 1){
          callback(new Error(`${label}不能包含空格`))
        }else {
          callback()
        }
      },
      trigger: 'blur',
    }
  },

  /*
    输入纯数字
   */
  onlyNumber(){
    return {
      validator: (rule, value, callback) => {
        if (value === undefined || value === '') {
          callback()
          return
        }
        if (!/^[0-9]*$/.test(value)) {
          callback(new Error('請輸入整數'))
        }else {
          callback()
        }
      },
      trigger: 'blur',
    }
  },
  /**
   * 只正整数
   * @returns {{validator: validator, trigger: string}}
   */
  onlyPositive() {
    return {
      validator: (rule, value, callback) => {
        if (value === undefined || value === '') {
          callback()
          return
        }
        if (!/^[0-9]*$/.test(value)) {
          callback(new Error('請輸入整數'))
        } else if(parseInt(value) === 0) {
          callback(new Error('請輸入正整數'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    }
  },

  /*
    输入数字或字母
   */
  onlyNumLetter(){
    return {
      validator: (rule, value, callback) => {
        if (value === undefined || value === '') {
          callback()
          return
        }
        if (!/^[0-9a-zA-Z]+$/.test(value)) {
          callback(new Error('请输入数字或字母'))
        }else {
          callback()
        }
      },
      trigger: 'blur',
    }
  },

  /**
   * 仅限汉字或字母
   */
  chineseOrLetter() {
    return {
      validator: (rule, value, callback) => {
        const testReg = /^[A-Za-z\u4e00-\u9fa5]+$/
        if(value){
          if (testReg.test(value)) {
            callback()
          } else {
            callback(new Error('仅限汉字或字母'))
          }
        }else {
          callback()
        }
      },
      trigger: 'blur'
    }
  },

  /**
   * 不允许标点和数字
   */
  notNumPoint() {
    return {
      validator: (rule, value, callback) => {
        const testReg = /^[A-Za-z\u4e00-\u9fa5\(\)（）]+$/
        if(value){
          if (testReg.test(value)) {
            callback()
          } else {
            callback(new Error('不允许输入标点或数字'))
          }
        }else {
          callback()
        }
      },
      trigger: 'blur'
    }
  },
}



// WEBPACK FOOTER //
// ./src/util/rules.js