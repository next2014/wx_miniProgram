<view class="container">

  
  <form class="list" bindsubmit="submitTemplateMessageForm" report-submit>
    <button class="list-item" form-type="submit">
      <text>发送模板消息</text>
    </button>
    {result && <view class="list-item">
      <text class="request-text">调用结果：{result}</text>
    </view>}
  </form>

  <view class="guide">
    <text class="headline">测试须知</text>
    <text class="p">1. 需在手机上预览测试，工具中无效</text>
    <text class="p">2. 需上传 cloudfunctions 目录下的 openapi 云函数</text>
    <text class="p">3. 调用成功后返回到微信主界面查看收到的模板消息</text>
  </view>

  <form class="list" bindsubmit="submitGetWXACodeForm" report-submit>
    <button class="list-item" form-type="submit">
      <text>获取小程序码</text>
    </button>
  </form>

  <view class="guide">
    <text class="headline">测试须知</text>
    <text class="p">需上传 cloudfunctions 目录下的 openapi 云函数</text>
  </view>

  <view class="guide">
    <image src={wxacodeSrc} mode="aspectFit"></image>
  </view>

</view>
