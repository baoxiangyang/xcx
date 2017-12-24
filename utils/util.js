Promise.prototype['finally'] = function finallyPolyfill(callback) {
  let constructor = this.constructor;
  return this.then(function (value) {
    return constructor.resolve(callback()).then(function () {
      return value;
    });
  }, function (reason) {
    return constructor.resolve(callback()).then(function () {
      throw reason;
    });
  });
};

const formatTime = date => {
  date = new Date(date);
  const year = date.getFullYear()
  const month = formatNumber(date.getMonth() + 1)
  const day = formatNumber(date.getDate())
  const hour = formatNumber(date.getHours())
  const minute = formatNumber(date.getMinutes())
  const second = formatNumber(date.getSeconds())

  return `${month}月${day}日` + ' ' + [hour, minute].join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
let oldCookies = wx.getStorageSync('cookies') || '';
function postRequest(url, data, loding){
  loding && wx.showLoading({
    title: (typeof loding == 'string') ? loding : '加载中',
    mask: true
  });
  return new Promise((resolve, reject) => {
    wx.request({
      url: `http://127.0.0.1${url}`,
      method: 'POST',
      data,
      header: {
        Cookie: oldCookies
      },
      success: res => {
        let cookies = res.header['Set-Cookie'] || res.header.Cookie;
        if(cookies) {
          oldCookies = cookies;
          wx.setStorage({ key: 'cookies', data: cookies });
        }
        resolve(res.data);
      },
      fail: err => {
        reject(err);
      },
      complete: () =>{
        loding && wx.hideLoading()
      }
    });
  });
}
//校验规则
const validator = (function(){
  const moneyReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
    emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
  return function(data, rules) {
    let rulesArr = Object.keys(rules), errArr = [];
    for (let i = 0; i < rulesArr.length; i++) {
      let value = data[rulesArr[i]],
        rule = rules[rulesArr[i]];
      rule = Array.isArray(rule) ? rule : [rule];
      rules:
      for (let y = 0; y < rule.length; y++) {
        let yRule = rule[y];
        if (yRule.required && !value) {
          errArr.push({ name: rulesArr[i], message: yRule.message || '此字段不能为空' });
          continue rules;
        }
        if (!value) {
          continue rules;
        }
        yRule.required && delete yRule.required;
        let ruleArr = Object.keys(yRule);
        for (let z = 0; z < ruleArr.length; z++) {
          switch (ruleArr[z]) {
            case 'minLength':
              value.length < yRule[ruleArr[z]] && errArr.push({ name: rulesArr[i], message: yRule.message || `此字段长度不小于${yRule[ruleArr[z]]}` });
              break;
            case 'maxLength':
              value.length > yRule[ruleArr[z]] && errArr.push({ name: rulesArr[i], message: yRule.message || `此字段长度不大于${yRule[ruleArr[z]]}` });
              break;
            case 'money':
              !moneyReg.test(value) && errArr.push({ name: rulesArr[i], message: yRule.message || `请输入正确的金额格式` });
              break;
            case 'type':
              switch (yRule.type) {
                case 'string':
                  typeof value !== 'string' && errArr.push({ name: rulesArr[i], message: yRule.message || '此字段必须为String类型' });
                  break;
                case 'number':
                  typeof value !== 'number' && errArr.push({ name: rulesArr[i], message: yRule.message || '此字段必须为Number类型' });
                  break;
                case 'regexp':
                  !yRule.pattern.test(value) && errArr.push({ name: rulesArr[i], message: yRule.message || '此字段不符合规则' });
                  break;
                case 'email':
                  !emailReg.test(value) && errArr.push({ name: rulesArr[i], message: yRule.message || '错误的邮箱地址' });
                  break;
                default:
                  console.log(`type:${yRule.type} 此校验规则不存在`);
              }
              break;
            case "pattern":
              break;
            default:
              console.log(`${ruleArr[z]} 此校验规则不存在`);
              break;
          }
        }
      }
    }
    return (errArr.length ? errArr : null);
  }
}());


module.exports = {
  formatTime,
  postRequest,
  validator
}
