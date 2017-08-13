# CCDB
CompureCraftから扱えるデータベースを操作するWebAPI  
実際それ以外にも使えると思う

## 環境
- JavaScript
  - Node.js
    - express 4
- MongoDB

## How to use
###  サーバの立て方
##### 前提
- npmがインストールされていること

##### 手順
1. MongoDBを27017ポート(デフォルト)で起動する
2. レポジトリをクローンする
3. node-devをインストール(bata版のみ)
  - `npm i -g node-dev`
4. サーバ起動
  - `npm start`
5. アクセスは`http://localhost:55440`

※今後もうちょっと簡単にする予定です(ポート番号設定など)

### ユーザ管理

機能名|URL|Method|Params|備考
---|---|---|---|---
ユーザ認証|/api/user/|GET|{username:ユーザ名, password:パスワード}|
ユーザ作成|/api/user/insert/|POST|{username:ユーザ名, password:パスワード}|
パスワード変更|/api/user/update/|POST|{username:ユーザ名, password: 現パスワード, newPassword: 新パスワード}|
ユーザ削除|/api/user/delete/|POST|{username:ユーザ名, password:パスワード}|めんどいので未実装

### データベース操作
#### 挿入
- URL: /api/db/insert/
- Method: POST
- Params:

key|value
---|---
username | ユーザ名
password | パスワード
collection | コレクション名
data | 挿入データ(json, 配列可)

#### 検索
- URL: /api/db/find/
- Method: GET
- Params:

key|value
---|---
username | ユーザ名
password | パスワード
collection | コレクション名
query | 検索条件(無しで全件)
sort | 並び替え(無しで並び替えしない)

#### 更新
- URL: /api/db/update/
- Method: POST
- Params:

key|value
---|---
username | ユーザ名
password | パスワード
collection | コレクション名
selector | 更新条件(json)
data | 更新データ(json)
one | trueなら１行のみ更新(true or null)
upsert | trueの場合存在しないなら挿入(true or null)

#### 削除
- URL: /api/db/delete/
- Method: POST
- Params:

key|value
---|---
username | ユーザ名
password | パスワード
collection | コレクション名
filter | 削除条件(json)

### APIレスポンスについて
- json
- 基本形
```json
{
  "result": true,
  "detail": {}
}
```

- "result"がtrueなら成功、falseならエラーである
- "detail"は成功なら実行結果、失敗ならエラー名とエラーメッセージを返す

成功例(データベース検索時)
```json
{
  "result": true,
  "detail": [
    {
      "_id": "598d1bfc52f3c9068822656b",
      "str": "aaaa",
      "num": "1"
    },
    {
      "_id": "598d1c1f52f3c9068822656d",
      "str": "bbbb",
      "num": "2"
    }
  ]
}
```

エラー例(ユーザ名またはパスワードが違う場合)
```json
{
  "result": false,
  "detail": {
    "name": "LoginError",
    "message": "The username or password you entered is incorrect."
  }
}
```
