// pages/addchuzhi/addchuzhi.js
const app = getApp()
Page({

    data: {
      token: '',
      ysqyid: '',
      appAjaximg: '',
      topTitle: [],
      qyName: '',
      addr: '',
      faren: '',
      fuzeren: '',
      phone: '',
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
    getqyName: function(e) {
      this.setData({
        qyName: e.detail.value
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
            appAjaximg: app.ajaxImg,
            ysqyid: options.id
        });
        wx.request({
          url: app.ajaxUrl + 'system/czxx/' + options.id,
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
                  qyName: resData.data.qyName,
                  addr: resData.data.addr,
                  faren: resData.data.faren,
                  fuzeren	: resData.data.fuzeren,
                  phone: resData.data.phone,
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
                if (resData.data.hzxy && resData.data.hzxy != '' && resData.data.hzxy != null) {
                  that.setData({
                    topTitle: resData.data.hzxy.split(',')
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
        url: app.ajaxUrl + 'system/czxx/shenhe',
        data: {
          id: that.data.ysqyid,
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
                  url: '/pages/chuzhigl/chuzhigl'
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
        url: app.ajaxUrl + 'system/czxx/shenhe',
        data: {
          id: that.data.ysqyid,
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
                  url: '/pages/chuzhigl/chuzhigl'
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
    fileImg: function(e) {
        var that = this;
        wx.chooseImage({
          count: 10,
          success: (res) => {
            console.log(res)
            for (var i = 0; i < res.tempFilePaths.length; i ++) {
              that.uploading(res.tempFilePaths[i])
            }
          },
        });
    },
    //图片上传到服务器
    uploading: function(paths) {
      var that = this;
      wx.uploadFile({
        url: app.ajaxUrl + 'system/upload',
        name: 'file',
        filePath: paths,
        header: {
          'Authorization': that.data.token
        },
        success: (res) => {
          console.log(res)
          var resdata = JSON.parse(res.data);
          console.log(resdata)
          var resdatas = resdata.data['1'];
          var childdata = that.data.topTitle;
          childdata.push(resdatas)
          that.setData({
            topTitle: childdata
          })
          console.log(that.data.topTitle)
        },
      });
    },
    chechImg: function(e) {
      var index = e.currentTarget.dataset.index;
      var that = this;
      var tops = that.data.topTitle;
      var topsin = [];
      for (var i = 0; i < tops.length; i ++) {
        topsin.push(that.data.appAjaximg + tops[i])
      }
      wx.previewImage({
        urls: topsin,
        current: topsin[index]
      })
    },
    removeImg: function(e) {
      var that = this;
      var index = e.currentTarget.dataset.index;
      var oArr = that.data.topTitle;
      oArr.splice(index, 1);
      that.setData({
        topTitle: that.data.topTitle
      })
      console.log(that.data.topTitle)
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