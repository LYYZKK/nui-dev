// 领创短信服务配置
export function getPlatform() {
  return '1'// 短信平台
}
export function getType() {
  return '3'// 短信模式（3为营销短信）
}

export function getSendMessageTime() {
  return 10 // 通话多少秒后发送短信
}
export function getContent() {
  return '【测试短信】内容（测试发送短信功能）,退订回T' // 短信内容
}
