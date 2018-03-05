//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    location: "",
    temperature:"",
    info:"",
    wind:"",
    humidity:"",//湿度
    hidden:true,
    array:[]//未来3天天气数组
  },
  onLoad: function (options) {
    // Do some initialize when page load.
    //天气预报接口 https://free-api.heweather.com/s6/weather/forecast?parameters
    //实况天气接口 https://free-api.heweather.com/s6/weather/now?parameters

    // console.log('首页加载')

    var that = this
    //获取用户当前的地理位置
    wx.getLocation({
      type: 'wgs84',//默认gps坐标
      altitude: false,
      success: function(res) {
        console.log(res.latitude)
        console.log(res.longitude)
        that.getTodayWeather({ 
          'latitude': res.latitude,
          'longitude': res.longitude
        })
        that.getFutureWeather({
          'latitude': res.latitude,
          'longitude': res.longitude
        })
      },
      fail: function(res) {
          that.setData({
            hidden: false
          })
      },
      complete: function(res) {},
    })

  },
  getTodayWeather: function (e) {
    var that = this
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/now?parameters',
      data: {
        location: e.longitude + ',' + e.latitude,
        key: 'dd3bf8ea3dd24dffb6df0cd411ea0102' //和风天气key dd3bf8ea3dd24dffb6df0cd411ea0102
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log('请求成功')
        var weatherList = res.data.HeWeather6
        var bigArea = weatherList[0].basic.admin_area
        var middleArea = weatherList[0].basic.parent_city
        var smallArea = weatherList[0].basic.location
        var location = ""

        if (bigArea == middleArea) {
            location = middleArea+" "+smallArea
        } else if (middleArea == smallArea) {
            location = bigArea+" "+middleArea
        }else{
            location = bigArea+" "+middleArea+" "+smallArea
        }

        that.setData({
          temperature: weatherList[0].now.tmp,
          wind:"风速 "+weatherList[0].now.wind_dir+weatherList[0].now.wind_sc,
          humidity:"湿度 "+weatherList[0].now.hum,
          info: weatherList[0].now.cond_txt,
          location: location
        })
        console.log(res.data)
      },
      fail: function (res) {
        // console.log(res.data)
      },
      complete: function (res) {
        // console.log(res.data)
      }
    })
  },
  getFutureWeather: function (e) {
    var that = this
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/forecast?parameters',
      data: {
        location: e.longitude + ',' + e.latitude,
        key: 'dd3bf8ea3dd24dffb6df0cd411ea0102' //和风天气key dd3bf8ea3dd24dffb6df0cd411ea0102
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log('请求成功')
        console.log(res.data)
        for (var i = 0; i < res.data.HeWeather6[0].daily_forecast.length; i++) {
          var x = res.data.HeWeather6[0].daily_forecast[i]
          console.log(x.date)
          console.log(x.cond_txt_d)
        }
        that.setData({
          array: res.data.HeWeather6[0].daily_forecast
        })
      },
      fail: function (res) {
        // console.log(res.data)
      },
      complete: function (res) {
        // console.log(res.data)
      }
    })
  },
  confirm: function () {
    //浦东新区经纬度121.53	31.22
    this.getTodayWeather({
      'latitude': 31.22,
      'longitude': 121.53
    })
    this.setData({
      hidden:true
    })
  },
  tap: function () {
    wx.navigateTo({
      url: '../test/test',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onReady: function () {
    // Do something when page ready.
  },
  onShow: function () {
    // Do something when page show.
  },
  onHide: function () {
    // Do something when page hide.
  },
  onUnload: function () {
    // Do something when page close.
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
  },
  onReachBottom: function () {
    // Do something when page reach bottom.
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  onPageScroll: function () {
    // Do something when page scroll
  },
  onTabItemTap(item) {
    console.log(item.index)
    console.log(item.pagePath)
    console.log(item.text)
  },
  // Event handler.
  viewTap: function () {
    this.setData({
      text: 'Set some data for updating view.'
    }, function () {
      // this is setData callback
    })
  },
  customData: {
    hi: 'MINA'
  }



  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  // onLoad: function () {
  //   if (app.globalData.userInfo) {
  //     this.setData({
  //       userInfo: app.globalData.userInfo,
  //       hasUserInfo: true
  //     })
  //   } else if (this.data.canIUse){
  //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //     // 所以此处加入 callback 以防止这种情况
  //     app.userInfoReadyCallback = res => {
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   } else {
  //     // 在没有 open-type=getUserInfo 版本的兼容处理
  //     wx.getUserInfo({
  //       success: res => {
  //         app.globalData.userInfo = res.userInfo
  //         this.setData({
  //           userInfo: res.userInfo,
  //           hasUserInfo: true
  //         })
  //       }
  //     })
  //   }
  // },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  // changeColor: function () {
  //   console.log('msg')
  //   this.setData({
  //     text: 'changed data'
  //   })
  // },
  // switch: function (e) {
  //   const length = this.data.objectArray.length
  //   for (let i = 0; i < length; ++i) {
  //     const x = Math.floor(Math.random() * length)
  //     const y = Math.floor(Math.random() * length)
  //     const temp = this.data.objectArray[x]
  //     this.data.objectArray[x] = this.data.objectArray[y]
  //     this.data.objectArray[y] = temp
  //   }
  //   this.setData({
  //     objectArray: this.data.objectArray
  //   })
  // },
  // addToFront: function (e) {
  //   const length = this.data.objectArray.length
  //   this.data.objectArray = [{ id: length, unique: 'unique_' + length }].concat(this.data.objectArray)
  //   this.setData({
  //     objectArray: this.data.objectArray
  //   })
  // },
  // addNumberToFront: function (e) {
  //   this.data.numberArray = [this.data.numberArray.length + 1].concat(this.data.numberArray)
  //   this.setData({
  //     numberArray: this.data.numberArray
  //   })
  // }
})
