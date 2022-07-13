// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    qyduan: [
      {
        name: '企业固废台账',
        icon: '/images/icon1.png',
        url: '/pages/taizhangl/taizhangl'
      },
      {
        name: '计划管理',
        icon: '/images/icon2.png',
        url: '/pages/jihuagl/jihuagl'
      },
      {
        name: '发车服务管理',
        icon: '/images/icon3.png',
        url: '/pages/fachegl/fachegl'
      },
      {
        name: '产废企业信息',
        icon: '/images/icon4.png',
        url: '/pages/qyinfotb/qyinfotb'
      },
      {
        name: '运输企业',
        icon: '/images/icon5.png',
        url: '/pages/yunshugl/yunshugl'
      },
      {
        name: '利用处置企业',
        icon: '/images/icon6.png',
        url: '/pages/chuzhigl/chuzhigl'
      },
      {
        name: '统计分析',
        icon: '/images/icon7.png',
        url: ''
      }
    ],
    qyduanN: [
      {
        name: '企业固废台账',
        icon: '/images/icon1.png',
        url: '/pages/taizhangl/taizhangl'
      },
      {
        name: '计划管理',
        icon: '/images/icon2.png',
        url: '/pages/jihuagl/jihuagl'
      },
      {
        name: '发车服务管理',
        icon: '/images/icon3.png',
        url: '/pages/fachegl/fachegl'
      },
      // {
      //   name: '企业基本信息',
      //   icon: '/images/icon4.png',
      //   url: '/pages/qyinfotb/qyinfotb'
      // },
      {
        name: '运输企业',
        icon: '/images/icon5.png',
        url: '/pages/yunshugl/yunshugl'
      },
      {
        name: '处置企业',
        icon: '/images/icon6.png',
        url: '/pages/chuzhigl/chuzhigl'
      },
      {
        name: '统计分析',
        icon: '/images/icon7.png',
        url: '/pages/abctjfxs/abctjfxs'
      }
    ],
    glduan: [
      {
        name: '企业固废台账',
        icon: '/images/icon1.png',
        url: '/pages/taizhangl/taizhangl'
      },
      {
        name: '计划管理',
        icon: '/images/icon2.png',
        url: '/pages/jihuagl/jihuagl'
      },
      {
        name: '发车服务管理',
        icon: '/images/icon3.png',
        url: '/pages/fachegl/fachegl'
      },
      {
        name: '企业基本信息',
        icon: '/images/icon4.png',
        url: '/pages/qiyegl/qiyegl'
      },
      {
        name: '运输企业',
        icon: '/images/icon5.png',
        url: '/pages/yunshugl/yunshugl'
      },
      {
        name: '处置企业',
        icon: '/images/icon6.png',
        url: '/pages/chuzhigl/chuzhigl'
      },
      {
        name: '领导驾驶舱',
        icon: '/images/icon8.png',
        url: '/pages/abctjfx/abctjfx'
      }
    ],
    czduan: [
      {
        name: '发车服务管理',
        icon: '/images/icon3.png',
        url: '/pages/fachegl/fachegl'
      },
      {
        name: '企业基本信息',
        icon: '/images/icon4.png',
        url: '/pages/addchuzhi/addchuzhi'
      },
    ],
    czduanN: [
      {
        name: '发车服务管理',
        icon: '/images/icon3.png',
        url: ''
      },
      {
        name: '企业基本信息',
        icon: '/images/icon4.png',
        url: '/pages/addchuzhi/addchuzhi'
      },
    ],
    infolist: [],
    banshow: false,
    roles: '',
    addUrl: '/pages/qyinfotb/qyinfotb'
  },
  quitClick: function() {
    wx.showModal({
      title: '提示',
      content: '确定退出吗',
      success (res) {
        if (res.confirm) {
          wx.clearStorage();
          wx.reLaunch({
            url: '/pages/login/login'
          });
        }
      }
    })
  },
  // 点击出现黑色文字出现内容
  boxClick: function(e) {
    var that = this;
    // 判断点击的是哪一个按钮
    var eValue = e.currentTarget.dataset;
    // if (that.data.roles == 'qy' && !that.data.qyId) {
    //   if (eValue.index != 3) {
    //     wx.showToast({
    //       title: '请先填写企业信息',
    //       icon: 'none',
    //       duration: 1200
    //     });
    //   }
    // }
    // if (that.data.roles == 'cz' && !that.data.qyId) {
    //   if (eValue.index != 1) {
    //     wx.showToast({
    //       title: '请先填写企业信息',
    //       icon: 'none',
    //       duration: 1200
    //     });
    //   }
    // }
  },
  onLoad() {
    var that = this;
    var token = wx.getStorageSync('token');
    var roles = wx.getStorageSync('roles');
    var qyId = wx.getStorageSync('qyId');
    that.setData({
      token: token,
      roles: roles,
      qyId: qyId
    });
    if (roles == 'qy') {
      if (!qyId) {
        that.setData({
          banshow: true,
          infolist: that.data.qyduanN
        }); 
        console.log(this.data.infolist)
      }
    }else if (roles == 'gl') {
      that.setData({
        infolist: that.data.glduan
      });
    }else if (roles == 'cz') {
      if (!qyId) {
        that.setData({
          banshow: true,
          addUrl: '/pages/addchuzhi/addchuzhi',
          infolist: that.data.czduanN
        });
      }
    }else {
      wx.reLaunch({
        url: '/pages/login/login'
      });
      return;
    }

    wx.request({
      url: app.ajaxUrl + 'getInfo',
      data: {},
      method: 'get',
      dataType: 'json',
      header: {
        'Authorization': token
      },
      success (res) {
        var resData = res.data
        console.log(resData);
        
        if (resData.code == 200) {
          if (resData.qyId) {
            wx.setStorage({
              key: "qyId",
              data: resData.qyId
            });
            wx.setStorage({
              key: "remark",
              data: resData.user.remark
            });
            
            if (roles == 'qy') {
              var getqyid = that.data.qyduan;
              getqyid[6].url = '/pages/abctjfxs/abctjfxs?id=' + resData.qyId;
             
              that.setData({
                infolist: getqyid,
                qyId: resData.qyId,
                banshow: false,
              });
            }else if (roles == 'cz') {
              that.setData({
                infolist: that.data.czduan,
                qyId: resData.qyId,
                banshow: false,
              });
            }
          }
        }else {
          wx.showToast({
            title: '用户信息过期，请重新登录',
            icon: 'none',
            duration: 1200,
            mask: true
          });
          setTimeout(function() {
            wx.reLaunch({
              url: '/pages/login/login'
            });
          },1000)
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
