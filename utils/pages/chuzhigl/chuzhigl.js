// pages/chuzhigl/chuzhigl.js
const app = getApp()
Page({
    data: {
        headlist: [
            {
                title: '未审核',
                state: true
            },
            {
                title: '已审核',
                state: false
            },
            {
                title: '已退回',
                state: false
            }
        ],
        titleInput: '',
        token: '',
        tagname: '',
        pageNum: 1,
        indexListx: [],
        addshow: true,
        navshow: false,
        navurl: '/pages/chuzhish/chuzhish?id='
    },
    //搜索框vale 改变
    inputClick: function(e) {
        var that = this;
        this.setData({
            titleInput: e.detail.value
        })
        if (e.detail.value == '') {
            this.setData({
                indexListx: [],
                pageNum: 1
            })
            wx.showLoading({
                title: '',
                mask: true
            });
            this.listXuan(1);
        }
    },
    //点击导航菜单
    navclick: function(e) {
      var that = this;
      var eValue = e.currentTarget.dataset;
      if (eValue.state == '未审核') {
        that.setData({
          tagname: '未审核'
        })
      }else if (eValue.state == '已审核') {
        that.setData({
          tagname: '已审核'
        })
      }else if (eValue.state == '已退回') {
        that.setData({
          tagname: '已退回'
        })
      }
      var indexList = that.data.headlist;
      for (var i = 0; i < indexList.length; i ++) {
        indexList[i].state = false;
      }
      indexList[eValue.index].state = true;
  
      that.setData({
        headlist: indexList,
        titleInput: '',
        pageNum: 1,
        indexListx: []
      })
      
        wx.showLoading({
          title: '',
          mask: true
        });
        that.listXuan(1);
    },
    //点击搜索
    searchClick: function() {
      var that = this;
      if(that.data.titleInput == '') {
        wx.showToast({
            title: '请输入关键字',
            icon: 'none',
            duration: 1200
        })
        return;
      };
      that.setData({
        pageNum: 1,
        indexListx: []
      })
      
        wx.showLoading({
          title: '',
          mask: true
        });
      that.listXuan(1);
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
        var roles = wx.getStorageSync('roles');
        
        if (roles == 'qy') {
            that.setData({
              token: token,
              navshow: false,
              // tagname: '已审核',
              navurl: '/pages/chuzhixq/chuzhixq?id='
            })
        }else {
          that.setData({
              token: token,
              // tagname: '未审核'
          });
        }
        that.listXuan(1)
    },
    listXuan: function(pageNum) {
        var that = this;
        wx.request({
          url: app.ajaxUrl + 'system/czxx/list',
          data: {
            qyName: that.data.titleInput,
            state: that.data.tagname,
            pageSize: 10,
            pageNum: pageNum
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
                var indexListxs = that.data.indexListx;
                var data = resData.rows;
                for (var i = 0; i < data.length; i ++) {
                  indexListxs.unshift(data[i])
                }
                that.setData({
                  indexListx: indexListxs
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
        var that = this;
        var pageNum = that.data.pageNum;
        that.setData({
            pageNum: pageNum+1
        })
            that.listXuan(pageNum+1);
        },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})