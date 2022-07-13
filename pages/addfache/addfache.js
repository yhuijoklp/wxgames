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

      arrayys: [],
      indexys: 0,
      ysBox: false,
      arraycz: [],
      indexcz: 0,
      czBox: false,
      date: ''
    },
    bindDateChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            date: e.detail.value
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
    //运输企业
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
            if (resData.code == 200) {
              that.setData({
                arrayys: resData.data,
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
    //处置企业
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
            if (resData.code == 200) {
              that.setData({
                arraycz: resData.data,
              });
            }
        }
      });
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
      that.dataYsqy(qyId);
      that.dataCzqy(qyId);
    },
    //文字识别上传图片
    shibieClick: function(e) {
      var that = this;
      wx.chooseImage({
        count: 1,
        success: (res) => {
          console.log(res);
          that.setData({
            sbimg: res.tempFilePaths[0]
          });
          wx.setStorage({
            key: "sbimg",
            data: res.tempFilePaths[0]
          });
          wx.navigateTo({
            url: '/pages/cropper/cropper'
          });
        },
      });
    },
    //裁剪后图片上传识别
    uploadingse: function(paths) {
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
            that.setData({
              sbimgs: resdatas
            });
            that.shibietoken()
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
    shibietoken: function() {
      var that = this;
      wx.showLoading({
        title: '',
        mask: true
      });
      wx.request({
        url: app.ajaxUrl + 'system/fcfwgl/gettoken',
        data: {},
        method: 'post',
        dataType: 'json',
        header: {
            'Authorization': that.data.token
        },
        success (res) {
            var resData = res.data
            console.log(resData);
            var data = JSON.parse(resData.msg);
            that.dataOcr(data.access_token);
        },
        complete: function() {
          wx.hideLoading();
        }
      });
    },
    dataOcr: function(atoken) {
      var that = this;
      wx.showLoading({
        title: '',
        mask: true
      });
      wx.request({
        url: app.ajaxUrl + 'system/fcfwgl/imgesb',
        data: {
          img: app.ajaxImg + that.data.sbimgs,
          token: atoken
        },
        method: 'get',
        dataType: 'json',
        header: {
            'Authorization': that.data.token
        },
        success (res) {
            var resData = res.data
            console.log(resData);
            var data = JSON.parse(resData.msg);
            console.log(data);
            var sbdata = data.items;
            for (var i = 0; i < sbdata.length; i ++) {
              if (sbdata[i].text == '车号') {
                that.setData({
                  cph: sbdata[i+1].text
                })
              }
              if (sbdata[i].text == '净重') {
                var numshu = parseFloat(sbdata[i+1].text);
                var chu = numshu / 1000;
                var textdata = chu.toFixed(3)
                that.setData({

                  weight: textdata
                })
              }
              if (sbdata[i].text.indexOf('打印日期') > -1) {
                that.setData({
                  date: sbdata[i].text.substring(5)
                })
              }
            }
        },
        complete: function() {
          wx.hideLoading();
        }
      });
    },
    checkPhone(phone) {
      if (!(/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone))) {
        return false;
      } else {
        return true;
      }
    },
    submitClick: function() {
      var that = this;
      if (that.data.gfName == '') {
        wx.showToast({
          title: '请填写固废名称',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.weight == '') {
        wx.showToast({
          title: '请填写固废重量',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.jbr == '') {
        wx.showToast({
          title: '请填写经办人',
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
      // if (!that.data.ysBox) {
      //   wx.showToast({
      //     title: '请选择运输单位',
      //     icon: 'none',
      //     duration: 1200
      //   });
      //   return;
      // };
      if (that.data.cph == '') {
        wx.showToast({
          title: '请填写车牌号',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      // if (that.data.jsy == '') {
      //   wx.showToast({
      //     title: '请填写驾驶员',
      //     icon: 'none',
      //     duration: 1200
      //   });
      //   return;
      // };
      // if (that.data.jsyphone == '') {
      //   wx.showToast({
      //     title: '请填写驾驶员手机号',
      //     icon: 'none',
      //     duration: 1200
      //   });
      //   return;
      // };
      if (!that.checkPhone(that.data.jsyphone)) {
        wx.showToast({
          title: '驾驶员手机号填写有误',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.date == '') {
        wx.showToast({
          title: '请选择发车时间',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (!that.data.czBox) {
        wx.showToast({
          title: '请选择处置单位',
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
        url: app.ajaxUrl + 'system/fcfwgl',
        data: {
          qyId: that.data.qyId,
          gfName: that.data.gfName,
          weight: that.data.weight,
          jbr: that.data.jbr,
          phone: that.data.phone,
          ysdw: that.data.arrayys[that.data.indexys],
          cph: that.data.cph,
          skzp: that.data.topTitle.join(','),
          jsy: that.data.jsy,
          jsyphone: that.data.jsyphone,
          tbDate: that.data.date,
          czdw: that.data.arraycz[that.data.indexcz]
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
      var that = this;
      var sbimgs = wx.getStorageSync('sbimgs');
      if (sbimgs) {
        that.uploadingse(sbimgs);
      }
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
      wx.removeStorageSync('sbimgs');
      // var formshu = wx.getStorageSync('formdata');
        // if (formshu) {
        //   var formdata = JSON.parse(formshu);
        //   that.setData({
        //     topTitle: formdata.topTitle,
        //     gfName: formdata.gfName,
        //     weight: formdata.weight,
        //     jbr: formdata.jbr,
        //     phone: formdata.phone,
        //     cph: formdata.cph,
        //     jsy: formdata.jsy,
        //     jsyphone: formdata.jsyphone,
        //     indexys: formdata.indexys,
        //     indexcz: formdata.indexcz,
        //     date: formdata.date,
        //     ysBox: formdata.ysBox,
        //     czBox: formdata.czBox
        //   });
        // }

      // var formdata = {
      //   topTitle: that.data.topTitle,
      //   gfName: that.data.gfName,
      //   weight: that.data.weight,
      //   jbr: that.data.jbr,
      //   phone: that.data.phone,
      //   cph: that.data.cph,
      //   jsy: that.data.jsy,
      //   jsyphone: that.data.jsyphone,
      //   indexys: that.data.indexys,
      //   indexcz: that.data.indexcz,
      //   date: that.data.date,
      //   ysBox: that.data.ysBox,
      //   czBox: that.data.czBox
      // }
      // wx.setStorage({
      //   key: "formdata",
      //   data: JSON.stringify(formdata)
      // });
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