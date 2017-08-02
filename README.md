# CCDB
CompureCraftから扱えるデータベースとそのためのAPIだよ

## 環境
- JavaScript
  - Node.js
    - express
- MongoDB

## How to use
1. ユーザ管理
  - ユーザ認証
    URL|/
  - ユーザ作成
  - パスワード変更
  - ユーザ削除

機能名|URL|Method|param
---|---|---|---
ユーザ認証|/api/user/|GET|username:ユーザ名
