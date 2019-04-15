# 面馆小程序

#### 介绍
专为面馆打造的小程序，本项目是纯原生开发的小程序项目，没有使用第三方的开发框架，具有较高的研究学习价值。

本项目为专业的小程序项目，我们没有能力和计划为该项目配套开发接口及后台管理程序，为了更好的展示、演示本小程序的运行效果，本项目的 api接口及后台管理直接嫁接使用的 [api工厂](https://www.it120.cc/) 的免费云接口和云后台，在此先表示感谢！

本项目我们将会持续的维护下去，同时欢迎大家踊跃提交 ISSUE 或者加入进来一起开发和维护本项目！

#### 接口 & 后台声明

本项目为小程序商城纯前端项目，由于人力和精力所限，本项目并未有开发配套的后台系统，而是直接使用了 [api 工厂](https://www.it120.cc/) 提供的免费接口和后台，可以完全满足本项目的所有功能需求。

- [接口 SDK](https://github.com/gooking/wxapi)

- [免费后台](https://www.it120.cc/user)

- [WeUI](https://github.com/Tencent/weui-wxss/)

#### 扫码体验
<img src="https://cdn.it120.cc/apifactory/2019/03/29/9e30cfe31eabcd218eb9c434f17e9295.jpg" width="200px">


#### 使用说明

1. 加入QQ群 973122103 免费获取 mock测试数据、接口、后台账号
2. 设置小程序名称 mallName
   <img src="https://cdn.it120.cc/apifactory/2019/04/12/0f472c5d8ecc3719a940cd052630499a.png">
3. 上传 banner 轮播图片
   <img src="https://cdn.it120.cc/apifactory/2019/04/12/92ee8b39efea11c7a4b53d30480073d1.png">
4. 设置小程序 appid 和 secret
   <img src="https://cdn.it120.cc/apifactory/2019/04/12/dcfd73bf82d6dc77aaedaa3b313ce5f5.png">
5. 数据维护
   <img src="https://cdn.it120.cc/apifactory/2019/04/12/e4520d8e4d67728f3a610e7e7d4029f3.png">

6. 修改本项目源码根目录下 config.js 文件， noodles 为您的专属域名
   
    ```javascript
    module.exports = {
      version: "0.0.1",
      note: '构建项目',
      subDomain: "noodles"
    }
    ```

7. [设置小程序合法服务器域名](https://www.it120.cc/info/faq/10469)
   
8. 重启您的小程序开发工具，完成
   
#### 参与贡献

1. Fork 本仓库
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request


#### 版本计划

1. 「2019-04-13」 发布 0.0.1 版本，支持在线下单；联动打印机自动出单；