
<view class="container">

  <view class="list">
    <view class="list-item" bindtap="testCgi">
      <text class="black">上传成功</text>
    </view>
    <view class="list-item">
      <text class="request-text">文件 ID：{fileID}</text>
    </view>
    <view class="list-item">
      <text class="request-text">云文件路径：{cloudPath}</text>
    </view>
    <view class="list-item">
      <image class="image1" src={imagePath} mode="aspectFit"></image>
    </view>
  </view>

  <view class="guide">
  
    <text class="headline">云开发控制台中管理文件</text>
    <text class="p">1. 打开云开发控制台</text>
    <image class="image1" src="../../images/console-entrance.png" mode="aspectFit"></image>
    <text class="p">2. 切换到文件管理标签页</text>
    <text class="p">3. 可查看文件列表、管理权限</text>
    <text class="p">4. 详细的教程和 API 文件，可点击调试器中打印的链接查看</text>
  </view>

</view>