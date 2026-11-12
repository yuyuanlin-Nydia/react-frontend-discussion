// 將 API 錯誤轉為使用者看得懂的訊息
export function getErrorMessage (error, fallback) {
  if (error?.code === 'AUTH_EXPIRED') return '登入已過期，請重新登入'
  if (error?.status === 401 || error?.status === 403) return '沒有權限執行此操作'
  return fallback
}
