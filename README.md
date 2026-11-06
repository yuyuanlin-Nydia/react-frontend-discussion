# frontend-discussion

前端問答討論網站（Stack Overflow 改版設計）。

UI 參考：https://dribbble.com/shots/2876030-Stackoverflow-redesign/attachments/593826?mode=media

## 技術

- React 18、Redux Toolkit、React Router v6
- Vite
- Firebase Realtime Database（REST API）、Firebase Auth（REST API）

## 環境設定

複製 `.env.example` 為 `.env`，並填入 Firebase 設定：

```
VITE_FIREBASE_DOMAIN='https://<your-project>-default-rtdb.firebaseio.com'
VITE_FIREBASE_API_KEY='<your-firebase-web-api-key>'
```

## 指令

| 指令 | 說明 |
| --- | --- |
| `npm install` | 安裝套件 |
| `npm run dev`（或 `npm start`） | 啟動開發伺服器：http://localhost:3000 |
| `npm run build` | 建置正式版本至 `dist/` |
| `npm run preview` | 本機預覽建置結果 |
| `npm run lint` | 執行 ESLint 並自動修正 |
