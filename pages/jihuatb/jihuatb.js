// pages/jihuatb/jihuatb.js
const app = getApp();
Page({
    data: {
        qyId: '',
        token: '',

        date: '',
        rjhcsl: '',
        rjhczl: ''
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
        var that = this;
        var token = wx.getStorageSync('token');
        var qyId = wx.getStorageSync('qyId');
        that.setData({
            token: token,
            qyId: qyId,
        });
    },
    submitClick: function() {
      var that = this;
      if (that.data.date == '') {
        wx.showToast({
          title: '请选择日期',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.rjhcsl == '') {
        wx.showToast({
          title: '请填写日计划产生量',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.rjhczl == '') {
        wx.showToast({
          title: '请填写日计划处置量',
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
              that.submitData();
            }
          }
      })
    },
    submitData: function() {
      wx.showLoading({
        title: '',
        mask: true
      });
      var that = this;
      wx.request({
        url: app.ajaxUrl + 'system/jhgl',
        data: {
          qyId: that.data.qyId,
          tbDate: that.data.date,
          rjhcsl: that.data.rjhcsl,
          rjhczl: that.data.rjhczl
        },
        method: 'post',
        dataType: 'json',
        header: {
            'Authorization': that.data.token
        },
        success (res) {
            var resData = res.data
            console.log(resData);
            wx.hideLoading();
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
            }else if(resData.code == 500) {
                wx.showToast({
                    title: resData.msg,
                    icon: 'none',
                    duration: 1200,
                    mask: true
                });
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