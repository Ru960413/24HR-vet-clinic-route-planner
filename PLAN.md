# 24HR 獸醫院地圖 — 更新計畫

> 2026-07 重啟。目標：解決三大痛點 —— 資料難維護、中英文兩套並存、UI 過時。
> 原則：**資料庫是唯一真相來源**，自動化只負責「偵測異動」，人工核准後才更新。

## 現況問題（盤點於 2026-07-23）

- 資料散在 4 個地方：`JSON/info_zh.json`、`JSON/info_en.json`、`csv/` 兩份 CSV，另有 `24HR_VET_API_V3/` 一個做到一半的 SQLite API（zh/en 兩張表）。
- `info_zh.json` 目前壞掉：烏鐸動物醫院的 note 欄位引號未跳脫，整個檔案無法解析。
- `24HR_VET_API_V3/needEdit.md` 累積一批 2023 年後未套用的資料修改（新增/修改/刪除）。
- 頁面中英文各一套（route-planner、details、contact 都有 zh/en 兩份），`map-zh.js` / `map-en.js` 也是近乎重複的 500 行。
- 有一批未 commit 的 UI 修改（index.css、index.html、layout.html）。
- 最後 commit 為 2023-05，急診資訊（專線、營業時間）需要整批重新查證。

## Phase 0：基礎整理（先讓 repo 乾淨）

- [x] 修好 `info_zh.json` 的引號跳脫錯誤，驗證兩個 JSON 都能解析
- [x] 檢視未 commit 的 UI 修改，決定保留或捨棄，收乾淨後 commit
- [x] `.gitignore` 加入 `__pycache__/`、`.DS_Store`，移除已追蹤的快取檔

## Phase 1：資料統一（核心）

- [x] 設計單一資料格式：一間診所一筆，雙語欄位放同一筆 → `JSON/clinics.json`
- [x] 寫遷移腳本（`scripts/migrate_data.py`）：以中文版為基準合併，48 筆；
      英文版缺的 4 間（上弦/長佐/吉米哈利/慕光）已補翻譯，落後的 8 筆英文備註已同步
- [x] 套用 `needEdit.md`：確認全部項目已在資料中（中文版原本就套用了，英文版本次補齊）
- [ ] 逐筆重新查證急診資訊（2023 至今變化大），更新 `last_verified`
      （✓ 上弦已查證並拆成板橋/林口兩院區，2026-07-23）
- [x] 刪除舊的 csv/、雙 JSON
- [ ] `24HR_VET_API_V3` 決定去留（needEdit.md 已全數套用，剩參考價值）

> 注意：診所資料另有兩份硬編碼複本在 `map-zh.js` / `map-en.js` 裡（目前網站
> 實際使用的是這兩份），Phase 2/3 改接 API 後移除。

## Phase 2：後端重構

- [x] Flask 提供單一 API：`GET /api/clinics`（不帶參數回雙語完整欄位，`?lang=zh|en` 回單語）
- [x] 路由合併：`/route/<lang>`、`/details/<lang>`，舊網址 301 轉址
- [x] 更新 requirements.txt（釘到實測版本、移除沒用到的 Flask-Mail）、本機實測通過

## Phase 3：前端合併

- [ ] `map-zh.js` + `map-en.js` 合併成一支，文案抽成 i18n 字典，資料改吃 API
- [ ] 模板合併：route-planner、details、contact 各留一份，語言用變數帶入
- [ ] 頁面數 9 → 約 5

## Phase 4：UI 翻新

- [ ] 響應式設計（急診情境大多是手機使用）
- [ ] details 頁改成由資料動態產生（現在是 1000 行手寫 HTML）
- [ ] 每間診所顯示「資料確認於 YYYY-MM」
- [ ] 加「資訊有誤？回報」連結（Google Form）

## Phase 5：資料自動化維護

- [x] 一次性腳本：幫每間診所查出 Google `place_id`（49/49，散步的座標與 3 間搬家
      診所的地址已同步校正；候選新診所：永春〔信義〕、念念〔新莊〕待人工確認）
- [ ] 排程比對腳本：Place Details 抓 `businessStatus` + 營業時間，與資料庫比對，
      產生「待審異動」清單（不自動改資料）
- [ ] （選配）政府開放資料名冊比對，偵測新開/歇業診所
- [ ] 超過 12 個月未驗證的診所列入提醒清單

## Phase 6：部署

- [ ] 確認部署平台（原 Procfile 是 Heroku 時代的，評估 Render / Fly.io / Railway）
- [ ] API key 網域限制、環境變數整理

---
進度追蹤：完成一項就把 checkbox 打勾。每個 Phase 結束 commit 一次。
