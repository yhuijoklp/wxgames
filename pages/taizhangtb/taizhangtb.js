// pages/taizhangtb/taizhangtb.js
const app = getApp();
Page({
    data: {
        qyId: '',
        token: '',
        cph_arr: [''],
        date: '',
        cssl: '',
        gfmc: '',
        wtlysl: '',
        wtczsl: '',
        zxlysl: '',
        zxczsl: '',
        syccsl: '',
        tbr: '',
        bz: '',
        type: 'day',
        dateType: 'day',
        xuanze: '请选择日期',
        fccs: ''
    },
    radioChange: function(e) {
      console.log('radio发送选择改变，携带值为', e.detail.value)
        
        if (e.detail.value == 'day') {
          this.setData({
            type: e.detail.value,
            dateType: 'day',
            date: '',
            xuanze: '请选择日期'
          })
        }else {
          this.setData({
            type: e.detail.value,
            dateType: 'month',
            date: '',
            xuanze: '请选择月份'
          })
        }
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
    getcph: function(e) {
      let index = e.currentTarget.dataset.index
      this.setData({
          [`cph_arr[${index}]`]: e.detail.value
      })
  },
    getgfmc: function(e) {
      this.setData({
        gfmc: e.detail.value
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
    //2022-04-18添加车牌号input
    add_cpinput() {
      console.log('添加车牌输入框')
      this.setData({
        cph_arr: this.data.cph_arr.concat('')
      })
    },
    del_cpinput: function(e) {
      console.log(e.currentTarget.dataset.index)
      let index = e.currentTarget.dataset.index
      let that = this
      wx.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success: function (sm) {
          if (sm.confirm) {
              // 用户点击了确定 可以调用删除方法了
              console.log(that.data.cph_arr)
              that.data.cph_arr.splice(index, 1);
              that.setData({
                cph_arr: that.data.cph_arr
              })
            } else if (sm.cancel) {
            }
          }
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
      if (that.data.gfmc == '') {
        wx.showToast({
          title: '请填写固废名称',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.cph_arr == '' || that.data.cph_arr.length <=0 || that.data.cph_arr[0] == '') {
        wx.showToast({
          title: '请填写车牌号',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.cssl == '') {
        wx.showToast({
          title: '请填写产生数量',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.wtlysl == '') {
        wx.showToast({
          title: '请填写委托利用数量',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.wtczsl == '') {
        wx.showToast({
          title: '请填写委托处置数量',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.zxlysl == '') {
        wx.showToast({
          title: '请填写自行利用数量',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.zxczsl == '') {
        wx.showToast({
          title: '请填写自行处置数量',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.syccsl == '') {
        wx.showToast({
          title: '请填写剩余贮存数量',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.tbr == '') {
        wx.showToast({
          title: '请填写填表人',
          icon: 'none',
          duration: 1200
        });
        return;
      };
      if (that.data.fccs == '') {
        wx.showToast({
          title: '请填写发车次数',
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
      console.log(this.data.cph_arr.join(','))
      wx.showLoading({
        title: '',
        mask: true
      });
      var that = this;
      var dates = that.data.date;
      var tbDate = '';
      if (that.data.type == 'month') {
        tbDate = dates + '-01'
      }else {
        tbDate = dates
      }
      wx.request({
        url: app.ajaxUrl + 'system/tzdj',
        data: {
          qyId: that.data.qyId,
          gfmc: that.data.gfmc,
          cph: that.data.cph_arr.join(','),
          type: that.data.type,
          tbDate: tbDate,
          cssl: that.data.cssl,
          wtlysl: that.data.wtlysl,
          wtczsl: that.data.wtczsl,
          zxlysl: that.data.zxlysl,
          zxczsl: that.data.zxczsl,
          syccsl: that.data.syccsl,
          tbr: that.data.tbr,
          fccs: that.data.fccs,
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
                  url: '/pages/taizhangl/taizhangl'
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