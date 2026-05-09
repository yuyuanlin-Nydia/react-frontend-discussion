export const BASE_URL = import.meta.env.VITE_FIREBASE_DOMAIN

export const request = async (
  path,
  options = {}
) => {
  const { params, ...fetchOptions } = options
  let queryString = ''

  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      // 處理 Firebase 要求的引號 (Firebase REST API 規定字串值需包含引號)
      const formattedValue = typeof value === 'string' ? `"${value}"` : value
      searchParams.append(key, formattedValue)
    })
    queryString = `?${searchParams.toString()}`
  }

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
    throw new Error('API Error')
  }

  return response.json()
}
