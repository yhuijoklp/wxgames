// pages/addchuzhi/addchuzhi.js
const app = getApp()
Page({

    data: {
      token: '',
      gfmc: '',
      cph_arr: [''],
      qyId: '',
      date: '',
      cssl: '',
      wtlysl: '',
      wtczsl: '',
      zxlysl: '',
      zxczsl: '',
      syccsl: '',
      tbr: '',
      bz: '',
      thyybox: false,
      thyy: '',
      ysqyid: '',
      weish: true,
      fccs: ''
    },
    bindDateChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
          date: e.detail.value
      })
    },
    getcssl: function(e) {
        this.setData({
            cssl: e.detail.value
        })
    },
    getwtlysl: function(e) {
        this.setData({
            wtlysl: e.detail.value
        })
    },
    getwtczsl: function(e) {
        this.setData({
            wtczsl: e.detail.value
        })
    },
    getzxlysl: function(e) {
        this.setData({
            zxlysl: e.detail.value
        })
    },
    getzxczsl: function(e) {
        this.setData({
            zxczsl: e.detail.value
        })
    },
    getsyccsl: function(e) {
        this.setData({
            syccsl: e.detail.value
        })
    },
    gettbr: function(e) {
        this.setData({
            tbr: e.detail.value
        })
    },
    getfccs: function(e) {
        this.setData({
          fccs: e.detail.value
        })
    },
    getbz: function(e) {
        this.setData({
            bz: e.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      wx.showLoading({
        title: '',
        mask: true
      });
      var that = this;
        var token = wx.getStorageSync('token');
        var qyId = wx.getStorageSync('qyId');
        that.setData({
            token: token,
            qyId: qyId,
            ysqyid: options.id
        });
        wx.request({
          url: app.ajaxUrl + 'system/tzdj/' + options.id,
          data: {},
          method: 'get',
          dataType: 'json',
          header: {
              'Authorization': that.data.token
          },
          success (res) {
              var resData = res.data
              console.log(resData);
              wx.hideLoading();
              if (resData.code == 200) {
                var tbtimes = resData.data.tbDate;
                if (resData.data.type == 'month') {
                  tbtimes = resData.data.tbDate.substring(0,7);
                }
                let cph = []
                if(resData.data.cph != null && resData.data.cph != '') {
                  cph = resData.data.cph.split(',')
                }
                if(cph == null || cph == '') {
                  cph = ['']
                }
                that.setData({
                  date: tbtimes,
                  gfmc: resData.data.gfmc,
                  cph_arr: cph,
                  cssl: resData.data.cssl,
                  wtlysl: resData.data.wtlysl,
                  wtczsl: resData.data.wtczsl,
                  zxlysl: resData.data.zxlysl,
                  zxczsl: resData.data.zxczsl,
                  syccsl: resData.data.syccsl,
                  tbr: resData.data.tbr,
                  fccs: resData.data.fccs,
                  bz: resData.data.bz
                });
                if (resData.data.state == '已审核') {
                  that.setData({
                    weish: false
                  })
                }
                if (resData.data.state == '已退回') {
                  that.setData({
                    thyybox: true,
                    thyy: resData.data.thyy
                  });
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
    returnClick: function() {
      wx.navigateBack({
        delta: 1
      })
    },
    //修改
    submitClick: function() {
      var that = this;
      wx.navigateTo({
        url: '/pages/taizhangxqs/taizhangxqs?id=' + that.data.ysqyid
      });
    },
    submitData: function() {
      var that = this;
      wx.request({
        url: app.ajaxUrl + 'system/tzdj/update',
        data: {
          id: that.data.ysqyid,
          cssl: that.data.cssl,
          wtlysl: that.data.wtlysl,
          wtczsl: that.data.wtczsl,
          zxlysl: that.data.zxlysl,
          zxczsl: that.data.zxczsl,
          syccsl: that.data.syccsl,
          tbr: that.data.tbr,
          bz: that.data.bz
        },
        method: 'post',
        dataType: 'json',
        header: {
            'Authorization': that.data.token
        },
        success (res) {
            var resData = res.data
            console.log(resData);
            if (resData.code == 200) {
              wx.showToast({
                title: '提交成功',
                icon: 'none',
                duration: 1200,
                mask: true
              });
              setTimeout(function() {
                wx.redirectTo({
                  url: '/pages/taizhangl/taizhangl'
                });
              },1000)
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
    //删除
    removeClick: function() {
      var that = this;
      wx.showModal({
          title: '提示',
          content: '确定删除吗',
          success (res) {
            if (res.confirm) {
              that.removeData();
            }
          }
      })
    },
    removeData: function() {
      var that = this;
      wx.request({
        url: app.ajaxUrl + 'system/tzdj/delete/' + that.data.ysqyid,
        data: {},
        method: 'post',
        dataType: 'json',
        header: {
            'Authorization': that.data.token
        },
        success (res) {
            var resData = res.data
            console.log(resData);
            if (resData.code == 200) {
              wx.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 1200,
                mask: true
              });
              setTimeout(function() {
                wx.reLaunch({
                  url: '/pages/taizhangl/taizhangl',
                })
              },1000)
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
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})