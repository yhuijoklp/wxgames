// login.js
const app = getApp();

Page({
  data: {
    username: '',
    password: '',
    token: ''
  },
  getUser: function(e) {
    this.setData({
      username: e.detail.value
    })
  },
  getPass: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  onLoad() {
    //加载完
  },
  joinclick() {
    var that = this;
    if (!that.data.username) {
      wx.showToast({
        title: '请输入账号',
        icon: 'none',
        duration: 1200
      });
      return;
    }
    if (!that.data.password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 1200
      });
      return;
    }
    wx.showLoading({
      title: '正在登录',
      mask: true
    })
    wx.request({
      url: app.ajaxUrl + 'loginphone',
      data: {
        username: that.data.username,
        password: that.data.password
      },
      method: 'POST',
      dataType: 'json',
      success (res) {
        var resData = res.data
        console.log(resData);
        wx.hideLoading();
        if (resData.code == 200) {
          that.setData({
            token: resData.token
          });
          wx.setStorage({
            key: "token",
            data: resData.token
          });
          that.getRole();
          wx.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 2000
          })
        }else {
          wx.showToast({
            title: resData.msg,
            icon: 'none',
            duration: 2000
          });
        }
        
      }
    });
  },
  getRole: function() {
    var that = this;
    wx.request({
      url: app.ajaxUrl + 'getInfo',
      data: {},
      method: 'get',
      dataType: 'json',
      header: {
        'Authorization': that.data.token
      },
      success (res) {
        var resData = res.data
        console.log(resData);
        
        if (resData.code == 200) {
          if (resData.roles[0] == 'admin') {
            wx.showToast({
              title: '该账号无法在手机端操作',
              icon: 'none',
              duration: 3000
            });
            return;
          }
          wx.setStorage({
            key: "qyId",
            data: resData.qyId
          });
          wx.setStorage({
            key: "remark",
            data: resData.user.remark
          });
          wx.setStorage({
            key: "roles",
            data: resData.roles[0]
          });
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }else {
          wx.showToast({
            title: '获取用户信息失败，请重新登录',
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
