// pages/addchuzhi/addchuzhi.js
const app = getApp()
Page({

    data: {
      token: '',
      jhglid: '',
      qyName: '',
      date: '',
      rjhcsl: '',
      rjhczl: '',

      weish: false,
      tuibox: false,
      thyy: '',
      thyybox: false,
    },
    getthyy: function(e) {
      this.setData({
        thyy: e.detail.value
      })
    },
    bindDateChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
          date: e.detail.value
      })
    },
    getrjhcsl: function(e) {
        this.setData({
          rjhcsl: e.detail.value
        })
    },
    getrjhczl: function(e) {
        this.setData({
          rjhczl: e.detail.value
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
        that.setData({
            token: token,
            jhglid: options.id
        });
        wx.request({
          url: app.ajaxUrl + 'system/jhgl/' + options.id,
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
                that.setData({
                  qyName: resData.data.item1,
                  date: resData.data.tbDate,
                  rjhcsl: resData.data.rjhcsl,
                  rjhczl: resData.data.rjhczl
                });
                if (resData.data.state == '未审核') {
                  that.setData({
                    weish: true
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
    //通过
    submitClick: function() {
      var that = this;
      wx.showModal({
          title: '提示',
          content: '确定通过吗',
          success (res) {
            if (res.confirm) {
              that.submitData();
            }
          }
      })
    },
    submitData: function() {
      var that = this;
      wx.request({
        url: app.ajaxUrl + 'system/jhgl/shenhe',
        data: {
          id: that.data.jhglid,
          status: '1',
          thyy: ''
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
                  url: '/pages/jihuagl/jihuagl'
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
    //退回
    removeClick: function() {
      var that = this;
      that.setData({
        tuibox: true
      })
    },
    cancel: function() {
      var that = this;
      that.setData({
        tuibox: false
      })
    },
    confirm: function() {
      var that = this;
      if (that.data.thyy == '') {
        wx.showToast({
          title: '请填写退回原因',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      wx.showModal({
        title: '提示',
        content: '确定提交吗',
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
        url: app.ajaxUrl + 'system/jhgl/shenhe',
        data: {
          id: that.data.jhglid,
          status: '2',
          thyy: that.data.thyy
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
                  url: '/pages/jihuagl/jihuagl'
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