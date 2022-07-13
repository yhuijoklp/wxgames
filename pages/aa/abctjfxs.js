// pages/abctjfxs/abctjfxs.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        token: '',
        qyId: '',
        ecline: {},
        date: '2021-12',
        chart: null
    },
    bindDateChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            date: e.detail.value
        })
        wx.showLoading({
            title: '',
            mask: true
        });
        console.log(1)
        this.getdata(e.detail.value);
      },
    /**
     * 生命周期函数--监听页面加载
     */
    echartInit: function(e) {
      this.initChart(e.detail.canvas, e.detail.width, e.detail.height);
    },
    initChart: function(canvas, width, height) {
      var that = this;
      var chart = that.data.chart
      chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
    
      var option = {
        tooltip: {
          trigger: 'axis', //柱状图、折线图
          axisPointer: {
            type: 'shadow'  //鼠标指中效果
          }
        },
        grid: {
          top: '8%',
          left: '4%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['产生量', '处置量', '利用量'],
            axisTick: {
              alignWithLabel: true
            },
              axisLabel: { //坐标轴标签
                  textStyle: {
                      color: '#999999',
                      fontSize: '14px'
                  },
                  interval: 0, //强制显示所有标签(不隐藏不重叠)。
                  formatter:function(value)  
                    {  
                        var ret = "";//拼接加\n返回的类目项  
                        var maxLength = 5;//每项显示文字个数  
                        var valLength = value.length;//X轴类目项的文字个数  
                        var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
                        if (rowN > 1)//如果类目项的文字大于5,  
                        {  
                            for (var i = 0; i < rowN; i++) {  
                                var temp = "";//每次截取的字符串  
                                var start = i * maxLength;//开始截取的位置  
                                var end = start + maxLength;//结束截取的位置  
                           //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
                                temp = value.substring(start, end) + "\n";  
                                ret += temp; //凭借最终的字符串  
                            }  
                            return ret;  
                        }else {  
                          return value;  
                        }  
                    }
              },
              axisLine: { //坐标轴轴线
                  lineStyle: {
                      color: '#dddddd',
                  }
              },
              axisTick: { //坐标轴刻度线
                  show: false
              }
          }
        ],
        yAxis: [
          {
            type: 'value',
              axisLabel: { //坐标轴标签
                  textStyle: {
                      color: '#666666',
                  },
              },
              splitLine: { //坐标轴网格线线
                  lineStyle: {
                      color: '#dddddd',
                  }
              },
              axisTick: { //坐标轴刻度线
                  show: false
              }
          }
        ],
        series: [
          {
            name: '数量',
            type: 'bar',
            barWidth: '24',
            data: [0, 0, 0],
              label: {
                  show: true,
                  position: 'top',
                  color: '#999999'
              },
            itemStyle: {
                normal: {
                    color: '#1895ff'
                }
            }
          }
        ]
    
      };
      chart.setOption(option);
      that.setData({
        chart: chart
      })
    },
    onLoad: function (options) {
      var that = this;
        var that = this;
        var token = wx.getStorageSync('token');
        that.setData({
            token: token,
            qyId: options.id
        });
    },
    getdata: function(date) {
        var that = this;
        wx.request({
            url: app.ajaxUrl + 'system/Tongji/getAllByQy/'+that.data.qyId+'/'+date,
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
              var datavalue = [];
              if (resData.code == 200) {
                datavalue.push(resData.data.cs);
                datavalue.push(resData.data.cz);
                datavalue.push(resData.data.ly);

                var chart = that.data.chart
                chart.setOption({
                  series: [{
                      data: datavalue
                  }]
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
      var that = this;
      that.getdata('2021-12')
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