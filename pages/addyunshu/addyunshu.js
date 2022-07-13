// pages/addyunshu/addyunshu.js
const app = getApp()
Page({

    data: {
      token: '',
      qyId: '',
      appAjaximg: '',
      topTitle: [],
      qyName: '',
      addr: '',
      faren: '',
      fuzeren: '',
      phone: ''
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
      var that = this;
        var token = wx.getStorageSync('token');
        var qyId = wx.getStorageSync('qyId');
        that.setData({
            token: token,
            qyId: qyId,
            appAjaximg: app.ajaxImg
        });
    },
    submitClick: function() {
      var that = this;
      if (that.data.qyName == '') {
        wx.showToast({
          title: '请填写企业名称',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.addr == '') {
        wx.showToast({
          title: '请填写地址',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.faren == '') {
        wx.showToast({
          title: '请填写法人',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.fuzeren == '') {
        wx.showToast({
          title: '请填写负责人',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.phone == '') {
        wx.showToast({
          title: '请填写联系方式',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.phone.substring(0,1) == '0') {
        if (that.data.phone.length > 12 || that.data.phone.length < 11) {
          wx.showToast({
            title: '联系方式填写有误',
            icon: 'none',
            duration: 1200
          });
          return;
        }
      }else if (that.data.phone.substring(0,1) == '1') {
        if (that.data.phone.length != 11) {
          wx.showToast({
            title: '联系方式填写有误',
            icon: 'none',
            duration: 1200
          });
          return;
        }
      }else if (that.data.phone.length > 8 || that.data.phone.length < 5) {
        wx.showToast({
          title: '联系方式填写有误',
          icon: 'none',
          duration: 1200
        });
        return;
      }
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
        url: app.ajaxUrl + 'system/ysqy',
        data: {
          qyId: that.data.qyId,
          qyName: that.data.qyName,
          addr: that.data.addr,
          faren: that.data.faren,
          fuzeren	: that.data.fuzeren,
          phone: that.data.phone,
          hzxy: that.data.topTitle.join(',')
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
                  url: '/pages/yunshugl/yunshugl'
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
      wx.showLoading({
        title: '',
        mask: true
      });
      var that = this;
      wx.uploadFile({
        url: app.ajaxUrl + 'system/upload',
        name: 'file',
        filePath: paths,
        success: (res) => {
          console.log(res)
          var resdata = JSON.parse(res.data);
          console.log(resdata)
          if (resdata.code == 200) {
            var resdatas = resdata.data['1'];
            var childdata = that.data.topTitle;
            childdata.push(resdatas)
            that.setData({
              topTitle: childdata
            })
            console.log(that.data.topTitle)
          }else {
            wx.showToast({
              title: '上传失败',
              icon: 'none',
              duration: 1200
            });
          }
        },
        fail: function() {
          wx.showToast({
            title: '上传失败',
            icon: 'none',
            duration: 1200
          });
        },
        complete: function() {
          wx.hideLoading();
        }
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