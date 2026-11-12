# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案簡介

問答討論網站（Stack Overflow 改版設計，UI 參考：https://dribbble.com/shots/2876030-Stackoverflow-redesign）。技術組合為 React 18 + Redux Toolkit + React Router v6，後端使用 Firebase Realtime Database（REST）與 Firebase Auth（REST）。專案最初以 Create React App 建立，現已遷移至 Vite（`package.json` 中 `eslintConfig`、`browserslist`、`web-vitals` 等為 CRA 殘留設定）。程式碼註解、UI 文字與 commit 訊息皆使用繁體中文。

## 常用指令

- `npm run dev`（或 `npm start`）：啟動 Vite 開發伺服器，port 3000
- `npm run build` / `npm run preview`
- `npm run lint`：ESLint（`standard` + `plugin:react/recommended`，設定於 `.eslintrc.js`）。此指令帶有 `--fix`，會直接修改檔案。
- `npm test`：以 watch 模式執行 Vitest（jsdom 環境，設定在 `vite.config.js` 的 `test`，setup 檔為 `src/setupTests.js`）。
  - 單次執行全部：`npx vitest run`
  - 單一測試檔：`npx vitest run src/component/answer/AnswerCard.test.jsx`
  - 單一測試案例：`npx vitest run -t "測試名稱"`

## 測試慣例

- 測試檔與被測檔案放在同一目錄，命名為 `*.test.js(x)`，測試名稱使用中文。
- 需要 Redux 與路由參數的元件使用 `src/test/renderWithStore.jsx`，可傳入 `auth` 狀態與 `questionId`。
- 不呼叫真實 Firebase：元件測試以 `vi.mock` mock `store/*-action`，action／API 測試以 `vi.stubGlobal('fetch', ...)` mock fetch。
- 會發出寫入請求的測試須先以 `src/test/session.js` 的 `loginForTest()` 寫入登入資訊，否則 `request()` 會拋出 `AUTH_EXPIRED`。`setupTests.js` 會在每個測試後清空 `localStorage`，並建立 Modal 所需的 `#modal-root`。

程式碼風格遵循 ESLint `standard`：不加分號、使用單引號、函式名稱與括號間留空格（`function App () {}`）。

## 環境變數

`.env`（已列入 `.gitignore`，範本見 `.env.example`）必須定義：

- `VITE_FIREBASE_DOMAIN`：Realtime Database 的 base URL，`src/api/client.jsx` 以此組出所有資料請求網址。
- `VITE_FIREBASE_API_KEY`：Firebase Web API key，供登入／註冊（`AuthenticationPage.jsx`）與 token 換新（`src/api/auth.js`）使用。

新增環境變數時須加上 `VITE_` 前綴（以 `import.meta.env.VITE_XXX` 讀取），並同步更新 `.env.example`。

## 架構

**資料流：** 頁面／元件 → `src/store/*-action.js` 中的 thunk → `src/api/*.jsx` 中的 API 函式 → `src/api/client.jsx` 的 `request()` → Firebase RTDB REST。

- `src/api/client.jsx` 的 `request(path, { params, auth, ...fetchOptions })` 會將路徑接在 `BASE_URL` 之後。**`params` 中的字串值會自動加上雙引號**，因為 Firebase REST 查詢參數（如 `orderBy="time"`）規定要有引號。請直接傳入原始值，不要自行加引號。
- 寫入請求（非 GET）會自動附上 `?auth=<idToken>`；不需登入的寫入（目前只有瀏覽次數）須傳 `auth: false`。失敗時拋出帶 `status` 的 `ApiError`，UI 以 `src/lib/errorMessage.js` 的 `getErrorMessage()` 轉成提示文字。
- 資料庫權限規則在 `database.rules.json`，修改後須手動貼到 Firebase 主控台（Realtime Database → 規則）。前端的權限判斷（如是否顯示編輯按鈕）必須與規則一致。
- Firebase 回傳的集合格式為 `{ pushKey: {...} }` 物件。action thunk 會先轉成 `{ id: pushKey, ...data }` 陣列，再 dispatch 進 slice。
- 資料庫結構：`/questions/{questionId}` 與 `/answers/{questionId}/{answerId}`。回答以問題 id 為鍵另存一層，而不是存放在問題物件內。回答底下的留言串回覆存於 `/answers/{questionId}/{answerId}/replies/{replyId}`（`answer-action.js` 的 `addReply`／`editReply`／`deleteReply`），不計入回答數量；刪除回答時其回覆一併刪除。`AnswerCard` 傳入 `parentId` 時即為回覆卡片。
- 瀏覽次數與回答數量透過 PATCH 搭配 Firebase 伺服器端遞增（`{ '.sv': { increment: n } }`）更新，參見 `src/api/question.jsx`。回答數量由 `answer-action.js` 的 `addAnswer`／`deleteAnswer` 一併處理（+1／-1，失敗重試一次）；回答本身成功但數量更新失敗時拋出 `code: 'ANSWER_COUNT_SYNC'`，UI 須視為成功並顯示警告。
- 回答的建立時間欄位是 `time`（`fetchAnswerData` 以 `orderBy: 'time'` 排序），部分舊資料為 `createTime`；編輯後另存 `updateTime`。更新既有資料一律用 PATCH，不要用 PUT，否則會覆蓋掉 `time`、`email` 等欄位。
- 判斷回答是否為本人所寫：優先比對 `email`，舊資料沒有 `email` 時才比對作者名稱（見 `AnswerCard.jsx`，`database.rules.json` 採相同邏輯）。

**Redux store**（`src/store/index.js`）：slice 有 `questions`、`answers`、`auth`、`snackbar`。每個 slice 匯出 `xxxAction`／`xxxActions` 與 reducer。非同步邏輯放在對應的 `*-action.js`（thunk 或一般 async 函式），不要寫在 slice 內。`redux-persist` 雖列為相依套件，但目前並未使用。

**登入驗證：** `src/page/AuthenticationPage.jsx` 直接用 `fetch` 呼叫 Firebase Identity Toolkit REST 端點（`signInWithPassword`／`signUp`），不經過 `api/client`。
- localStorage 的登入資訊（`idToken`、`refreshToken`、`tokenExpiresAt`、`userInfo`）一律透過 `src/lib/authStorage.js` 讀寫，不要直接操作。
- idToken 一小時後過期。`src/api/auth.js` 的 `getValidIdToken()` 會在過期前 60 秒以 refreshToken 換新；換新失敗或沒有 refreshToken 時清除登入資訊、dispatch `logout`，並拋出 `code: 'AUTH_EXPIRED'`。
- `auth-slice` 的初始狀態從 localStorage 還原，沒有 refreshToken 的舊版登入資料視為已登出。登出時也必須重置其他與使用者相關的狀態。

**路由**（`src/App.jsx`）：在 `/authentication` 頁面不顯示 `Nav`，且該路由只在未登入時註冊。問題詳情頁路徑為 `/question/question-details/:questionId`。

**全域提示訊息：** dispatch `snackbarActions.showSnackbar({ message, icon, bgColor, duration, ... })`。唯一的 `<Snackbar />` 掛載於 `App`。請使用它而非 `alert()`（部分舊程式碼仍在使用 `alert()`）。

**Modal：** `src/UI/Modal.jsx` 與 `src/UI/ModalWrapper.jsx` 透過 `ReactDOM.createPortal` 渲染到 `#modal-root`。需要使用者確認的操作用 `src/UI/ConfirmDialog/ConfirmDialog.jsx`，不要用 `window.confirm`。

**樣式：** 使用 CSS Modules（`*.module.css`，以 `classes` 名稱匯入），檔案與元件放在同一目錄。共用設計變數（顏色、陰影）定義於 `src/index.css` 的 `:root`，請使用這些變數而非寫死色碼。圖示使用 `@mdi/react` + `@mdi/js`。
