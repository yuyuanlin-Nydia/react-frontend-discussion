import { getValidIdToken } from './auth'

export const BASE_URL = import.meta.env.VITE_FIREBASE_DOMAIN

export class ApiError extends Error {
  constructor (status, message) {
    super(message || 'API Error')
    this.status = status
  }
}

/**
 * 呼叫 Firebase Realtime Database REST API
 * - params：查詢參數，字串值會自動加上 Firebase 規定的雙引號
 * - auth：是否附上登入 token。預設寫入（非 GET）請求會附上，讀取不附；
 *   傳入 false 可讓不需登入的寫入（如瀏覽次數）不帶 token
 */
export const request = async (
  path,
  options = {}
) => {
  const { params, auth, ...fetchOptions } = options
  const method = (fetchOptions.method || 'GET').toUpperCase()
  const needAuth = auth ?? method !== 'GET'

  const searchParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      // 處理 Firebase 要求的引號 (Firebase REST API 規定字串值需包含引號)
      const formattedValue = typeof value === 'string' ? `"${value}"` : value
      searchParams.append(key, formattedValue)
    })
  }
  if (needAuth) {
    // token 不可加引號，故不經過上方 params 處理
    searchParams.append('auth', await getValidIdToken())
  }
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : ''

  const response = await fetch(
    `${BASE_URL}${path}${queryString}`,
    {
      headers: {
        'Content-Type': 'application/json'
      },
      ...fetchOptions
    }
  )

  if (!response.ok) {
    let message
    try {
      message = (await response.json())?.error
    } catch (e) {}
    throw new ApiError(response.status, message)
  }

  return response.json()
}
