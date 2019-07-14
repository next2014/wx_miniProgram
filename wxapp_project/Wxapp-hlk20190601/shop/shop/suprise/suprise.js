// pages/shop/surprise/suprise.js
var GAMEID = 0, GAMETIME = 0, DAOJISHIID = 0, ACTION = 180, CompassTimeId=0
const ROW = 13
Page({
  data: {
    npc:[],
    play: [],
    score:0,
    game:false,
    showText:'',
    daojishi:0,


  




  },
  onLoad: function (options) {},

  start:function(){
    if(this.data.game == true) return 
    //初始化npc与play
    this.data.npc=[];
    for (let i = 0; i < 10; i++) {
      this.data.npc.push(this.newNpc())
    }
    this.data.npc.push([])
    this.data.npc.push([])
    this.data.npc.push([])
    this.data.npc.push([])
    this.data.npc.push([])
    this.data.play=[]
    for (let i = 0; i < ROW; i++) {
      if (i == parseInt(ROW / 2)) {
        this.data.play.push(1)
      } else {
        this.data.play.push(0)
      }

    }

    this.setData({ game: true, score:0})
    let x = 300, clear_npc = [], add_npc = []
    let that = this
    //显示初始信息
    // console.clear()
    console.log(that.gameToStr())
    //显示倒计时
    that.setData({ daojishi:5})
    DAOJISHIID = setInterval(function(){
      console.log('倒计时：', that.data.daojishi)
      that.data.daojishi--
      that.setData({ daojishi: that.data.daojishi})
      if (that.data.daojishi == 0) clearInterval(DAOJISHIID)
    },1000)
    //开启定时器
    GAMEID = setInterval(function () {//每过5S加快执行频率
      x -= 0.1*x
      if (GAMETIME) clearInterval(GAMETIME)
      GAMETIME = setInterval(function () {
        
        //npc数组去除头部成员，并在尾部添加新的成员
        clear_npc = that.data.npc.pop()
        add_npc = that.newNpc()
        that.data.npc.unshift(add_npc)
        //清屏并重新输出
        // console.clear()
        console.log(that.gameToStr())
        //判断去掉的头部成员与play是否冲突
        for (var key in that.data.play){
          if (that.data.play[key] == 1 && clear_npc[key] == 1){
            //game over
            that.gameOver()
          }
        }
        //增加游戏得分
        that.data.score++
        that.setData({score:that.data.score})
      }, x)
    },5000)
    //监听罗盘
    // CompassTimeId = setInterval(function(){
    //   if (GAMETIME>0){
    //     if (ACTION > 200) that.right()
    //     if (ACTION < 160) that.left()
    //   }
    // },200)
  },
  newNpc:function(){
    let arr=[]
    for (let i = 0; i < ROW;i++){
      if (Math.random()<=0.1){
        arr.push(1)
      }else{
        arr.push(0)
      }
    }
    return arr
  },
  gameOver:function(){
    if (this.data.game == false) return 
    clearInterval(DAOJISHIID)
    clearInterval(GAMEID)
    clearInterval(GAMETIME)
    clearInterval(CompassTimeId)
    DAOJISHIID = 0, GAMEID = 0, GAMETIME = 0, CompassTimeId = 0,ACTION=180
    console.log('gameOver')
    console.log('得分：',this.data.score)
    this.setData({game:false})
  },
  gameToStr:function(){
    // '第一行\n第二行\n第三行'
    let str = '', npc_num_to_str = ['丨丨', '问题'], play_num_to_str = ['丨丨', '码农']
    for (let key in this.data.npc){
      str += this.data.npc[key].reduce(function (oldValue, currentValue) {
        return oldValue + npc_num_to_str[currentValue]
      }, '')
      str += '\n'
    }
    str += this.data.play.reduce(function (oldValue, currentValue) {
      return oldValue + play_num_to_str[currentValue]
    }, '')
    // console.log(str)
    this.setData({showText:str})
    return str
  },
  left:function(){
    if (this.data.game == false || GAMETIME == 0) return
    var that = this
    //play中1向左移动一位
    for(let key in this.data.play){
      if(this.data.play[key] == 1){
        if(key == 0){
          return
        }else{
          let index = key 
          this.data.play[index - 1] = 1
          this.data.play[index] = 0
          // console.clear()
          console.log(this.gameToStr())
          return
        }
      }
    }
    
  },
  right:function(){
    if (this.data.game == false || GAMETIME == 0) return
    //play中1向右移动一位
    for (let key in this.data.play) {
      if (this.data.play[key] == 1) {
        if (key == (this.data.play.length - 1)) {
          return
        } else {
          let index = key 
          this.data.play[index*1 + 1] = 1
          this.data.play[index] = 0
          // console.clear()
          console.log(this.gameToStr())
          return
        }
      }
    }
  },
  startCompass:function(){
    wx.onCompassChange(function (res) {
      ACTION = res.direction
    })
  },
  stopCompass:function(){
    wx.stopCompass({})
    ACTION=180
  },

  startGame2:function(){
    

  }
})