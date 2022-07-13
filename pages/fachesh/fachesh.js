// pages/addfache/addfache.js
const app = getApp()
Page({

    data: {
      token: '',
      qyId: '',
      appAjaximg: '',
      topTitle: [],
      gfName: '',
      weight: '',
      jbr: '',
      phone: '',
      cph: '',
      jsy: '',
      jsyphone: '',
      ysdw: '',
      czdw: '',

      fcfwid: '',
      arrayys: [],
      indexys: 0,
      arraycz: [],
      indexcz: 0,

      weish: false,
      tuibox: false,
      thyy: '',
      thyybox: false,
      date: ''
    },
    bindDateChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            date: e.detail.value
        })
    },
    getthyy: function(e) {
      this.setData({
        thyy: e.detail.value
      })
    },
    getgfName: function(e) {
      this.setData({
        gfName: e.detail.value
      })
    },
    getweight: function(e) {
      this.setData({
        weight: e.detail.value
      })
    },
    getjbr: function(e) {
      this.setData({
        jbr: e.detail.value
      })
    },
    getphone: function(e) {
      this.setData({
        phone: e.detail.value
      })
    },
    getcph: function(e) {
      this.setData({
        cph: e.detail.value
      })
    },
    getjsy: function(e) {
      this.setData({
        jsy: e.detail.value
      })
    },
    getjsyphone: function(e) {
      this.setData({
        jsyphone: e.detail.value
      })
    },
    bindPickerChangeYs: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        indexys: e.detail.value,
        ysBox: true
      })
      var objarr = this.data.arrayys;
      var objarrinx = this.data.indexys;
      console.log(objarr[objarrinx]);
    },
    bindPickerChangeCz: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        indexcz: e.detail.value,
        czBox: true
      })
      var objarr = this.data.arraycz;
      var objarrinx = this.data.indexcz;
      console.log(objarr[objarrinx]);
    },
    //运输企业字典
    dataYsqy: function(qyId) {
      var that = this;
      wx.request({
        url: app.ajaxUrl + 'system/ysqy/getYsdw/' + qyId,
        data: {},
        method: 'get',
        dataType: 'json',
        header: {
            'Authorization': that.data.token
        },
        success (res) {
            var resData = res.data
            console.log(resData);
            var getData = resData.data;
            var ysdws = that.data.ysdw;
            if (resData.code == 200) {
              that.setData({
                arrayys: resData.data,
              });
              for (let i = 0; i < getData.length; i ++) {
                if (getData[i] == ysdws) {
                  that.setData({
                    indexys: i,
                  });
                  break;
                }
              }
            }
        }
      });
    },
    //处置企业字典
    dataCzqy: function(qyId) {
      var that = this;
      wx.request({
        url: app.ajaxUrl + 'system/czxx/getCzdw/' + qyId,
        data: {},
        method: 'get',
        dataType: 'json',
        header: {
            'Authorization': that.data.token
        },
        success (res) {
            var resData = res.data
            console.log(resData);
            var getData = resData.data;
            var czdws = that.data.czdw;
            if (resData.code == 200) {
              that.setData({
                arraycz: resData.data,
              });
              for (let i = 0; i < getData.length; i ++) {
                if (getData[i] == czdws) {
                  that.setData({
                    indexcz: i,
                  });
                  break;
                }
              }
            }
        }
      });
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
        var rolesdata = wx.getStorageSync('roles');
        that.setData({
            token: token,
            qyId: qyId,
            appAjaximg: app.ajaxImg,
            fcfwid: options.id
        });
        wx.request({
          url: app.ajaxUrl + 'system/fcfwgl/' + options.id,
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
                  gfName: resData.data.gfName,
                  weight: resData.data.weight,
                  jbr: resData.data.jbr,
                  phone: resData.data.phone,
                  ysdw: resData.data.ysdw,
                  cph: resData.data.cph,
                  jsy: resData.data.jsy,
                  jsyphone: resData.data.jsyphone,
                  date: resData.data.tbDate,
                  czdw: resData.data.czdw,
                });
                that.dataYsqy(resData.data.qyId);
                that.dataCzqy(resData.data.qyId);
                if (resData.data.state == '未审核' && rolesdata == 'gl') {
                  that.setData({
                    weish: true
                  })
                }
                if (resData.data.state == '待确认') {
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
                if (resData.data.skzp && resData.data.skzp != '' && resData.data.skzp != null) {
                  that.setData({
                    topTitle: resData.data.skzp.split(',')
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
      var rolesdata = wx.getStorageSync('roles');
      var shurl = '';
      if (rolesdata == 'gl') {
        shurl = 'system/fcfwgl/shenhe'
      }else if(rolesdata == 'cz') {
        shurl = 'system/fcfwgl/queren'
      }
      wx.request({
        url: app.ajaxUrl + shurl,
        data: {
          id: that.data.fcfwid,
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
                  url: '/pages/fachegl/fachegl'
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
      var rolesdata = wx.getStorageSync('roles');
      var shurl = '';
      if (rolesdata == 'gl') {
        shurl = 'system/fcfwgl/shenhe'
      }else if(rolesdata == 'cz') {
        shurl = 'system/fcfwgl/queren'
      }
      wx.request({
        url: app.ajaxUrl + shurl,
        data: {
          id: that.data.fcfwid,
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
                  url: '/pages/fachegl/fachegl'
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