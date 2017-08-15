# README

このサーバはゲームに必要なAPIを提供しています。
以下に自分がテストした際のcurlコマンドを記載します。詳細はドキュメントリポジトリを参照してください。

## ユーザ関連

### 全ユーザ確認(デバッグ用)
	curl http://localhost:3000/debug -X GET
	
### ユーザ表示
スコアが高い順にユーザを表示する

	curl http://localhost:3000/users -X GET


### ユーザ登録
	curl http://localhost:3000/signup -X POST -H "Content-Type: application/json" -d '{ "name": "Nenecchi", "device_id":"NenecchiID"}'
	
	{"name":"Nenecchi","login_key":"LOGINKEY"}%

### 各ユーザのステータス表示
	 curl http://localhost:3000/users/NenecchiID/status?login_key=LOGINKEY -X GET	
	 
	{"name":"Nenecchi","score":0,"rank":"C","win_count":0,"lose_count":0}	
### アイテム作成(必要なければ削除予定)
	curl http://localhost:3000/users/NenecchiID/items -X POST -H "Content-Type: application/json" -d '{"name": "SuperBall", "login_key": "LOGINKEY", "value": "200", "number": "2"}'
	
	{"name":"SuperBall","value":200}	
### 所持アイテムの確認
	curl http://localhost:3000/users/NenecchiID/items?login_key=LOGINKEY -X GET	
	
	{"items":[{"name":"SuperBall","value":200},{"name":"UltraWater","value":1000}]}
	

### ゲーム結果の更新(勝敗とスコア)
`win`,`lose`を送信することで勝敗数をインクリメントする


	curl http://localhost:3000/users/NenecchiID/results -X PATCH -H "Content-Type: application/json" -d '{"score": "500","vs": "win", "login_key": "LOGINKEY"}'	
	
	{"name":"Nenecchi","score":500,"win_count":1,"lose_count":0}
	
		
	curl http://localhost:3000/users/NenecchiID/results -X PATCH -H "Content-Type: application/json" -d '{"score": "200","vs": "lose", "login_key": "LOGINKEY"}'
	
	{"name":"Nenecchi","score":200,"win_count":0,"lose_count":1}


### ゲーム結果の表示
	curl http://localhost:3000/users/NenecchiID/results?login_key=LOGINKEY -X GET 

	{"name":"Nenecchi","score":200,"win_count":5,"lose_count":2}	

### ガチャ

`low`,`middle`, `high`に応じて課金額とレアアイテム出現確率が変動する。`status`は既にそのアイテムを新規アイテムはダブリアイテムかを示す。

	curl http://localhost:3000/gacha -X POST -H "Content-Type: application/json" -d '{"device_id":"NenecchiID", "value":"low"}'
	{"status":"new","normal":"Super Rare","rarity":"SR"}
	
	