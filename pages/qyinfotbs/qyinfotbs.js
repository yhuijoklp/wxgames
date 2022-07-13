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
        qyId: ''
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
    returnClick: function() {
        wx.navigateBack({
          delta: 1
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
        if (qyId) {
            that.getqyinfo(qyId);
        }
        
    },
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
    submitl: function() {
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
                that.quesubmit();
              }
            }
        })
    },
    quesubmit: function() {
        var that = this;
        var posturl = '';
        var postdata = {}
        posturl = 'system/qyxx/update';
        postdata = {
            id: that.data.qyId,
            qyName: that.data.qyName,
            ncl: that.data.ncl,
            gfmc: that.data.gfmc,
            addr: that.data.addr,
            faren: that.data.faren,
            yfl: that.data.yfl,
            yl: that.data.yl,
            huanjie: that.data.huanjie,
            phone: that.data.phone,
            fuzeren: that.data.fuzeren
        }
        wx.request({
            url: app.ajaxUrl + posturl,
            data: postdata,
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
                            url: '/pages/qyinfotb/qyinfotb'
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