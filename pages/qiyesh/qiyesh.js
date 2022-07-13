// pages/qyinfotb/qyinfotb.js
const app = getApp()
Page({
    data: {
        token: '',
        qyName: '',
        ncl: '',
        gfmc: '',
        addr: '',
        faren: '',
        yfl: '',
        yl: '',
        huanjie: '',
        phone: '',
        fuzeren: '',
        qyId: '',
        weish: false,
        thyybox: false,
        thyy: '',
        tuibox: false
    },
    getthyy: function(e) {
      this.setData({
        thyy: e.detail.value
      })
    },
    getqyName: function(e) {
        this.setData({
            qyName: e.detail.value
        })
    },
    getfuzeren: function(e) {
        this.setData({
            fuzeren: e.detail.value
        })
    },
    getphone: function(e) {
        this.setData({
            phone: e.detail.value
        })
    },
    gethuanjie: function(e) {
        this.setData({
            huanjie: e.detail.value
        })
    },
    getaddr: function(e) {
        this.setData({
            addr: e.detail.value
        })
    },
    getfaren: function(e) {
        this.setData({
            faren: e.detail.value
        })
    },
    getyfl: function(e) {
        this.setData({
            yfl: e.detail.value
        })
    },
    getyl: function(e) {
        this.setData({
            yl: e.detail.value
        })
    },
    getgfmc: function(e) {
        this.setData({
            gfmc: e.detail.value
        })
    },
    getncl: function(e) {
        this.setData({
            ncl: e.detail.value
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
            qyId: options.id,
        });
        that.getqyinfo(options.id);
        
    },
    //获取企业信息
    getqyinfo: function(qyId) {
        var that = this;
        wx.request({
            url: app.ajaxUrl + 'system/qyxx/getqyxx',
            data: {
                id: qyId
            },
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
                        qyName: resData.data.qyName,
                        ncl: resData.data.ncl,
                        gfmc: resData.data.gfmc,
                        addr: resData.data.addr,
                        faren: resData.data.faren,
                        yfl: resData.data.yfl,
                        yl: resData.data.yl,
                        huanjie: resData.data.huanjie,
                        phone: resData.data.phone,
                        fuzeren: resData.data.fuzeren
                    })
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
    // 提交
    submitData: function() {
        var that = this;
        wx.request({
          url: app.ajaxUrl + 'system/qyxx/shenhe',
          data: {
            id: that.data.qyId,
            status: '1',
            thyy: ''
          },
          method: 'post',
          dataType: 'json',
          header: {
              'Authorization': that.data.token
          },
          success (res) {
            console.log(res)
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
                    url: '/pages/qiyegl/qiyegl'
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
        url: app.ajaxUrl + 'system/qyxx/shenhe',
        data: {
          id: that.data.qyId,
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
                  url: '/pages/qiyegl/qiyegl'
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