# README

このサーバはゲームに必要なAPIを提供しています。
以下に自分がテストした際のcurlコマンドを記載します。詳細は/api-doc/basic.htmlを参照してください。

## ユーザ関連
### ユーザ登録
	curl http://localhost:3000/signup -X POST -H "Content-Type: application/json" -d '{ "name": "Nenecchi", "device_id":"NenecchiID"}'
	
	[{"id":1,"device_id":"NenecchiID","name":"Nenecchi","score":0,"billing":0,"rank":"C","login_key":"VBMbZV4sGD4=","win_count":0,"lose_count":0,"summer_vacation_days":0}]


### 全ユーザ確認(デバッグ用なのでパスワードも表示される)
	curl http://localhost:3000/users -X GET
	
	{"user_name":"Nenecchi","login_key":"VBMbZV4sGD4="}


### 各ユーザのステータス表示
	curl http://localhost:3000/users/Nenecchi/status?login_key=VBMbZV4sGD4= -X GET
	
	{"user_name":"Nenecchi","score":0,"win_count":0,"lose_count":0,"summer_vacation_days":0}
	
### アイテム作成
	curl http://localhost:3000/users/Nenecchi/items -X POST -H "Content-Type: application/json" -d '{"name": "SuperBall", "login_key": "VBMbZV4sGD4=", "value": "200", "number": "2"}'
	
	[{"id":1,"name":"SuperBall","value":200,"user_id":1,"number":2}]
### 各ユーザのアイテムの確認
	curl http://localhost:3000/items -X GET
	
	[{"id":1,"name":"SuperBall","value":200,"user_id":1,"number":2}]
	
	
### アイテムの確認
	curl http://localhost:3000/users/Nenecchi/items?login_key=VBMbZV4sGD4= -X GET
	
	[{"id":1,"name":"SuperBall","value":200,"user_id":1,"number":2}]
### アイテム情報の更新
	curl http://localhost:3000/users/Nenecchi/items -X PATCH -H "Content-Type: application/json" -d '{"name": "SuperBall", "login_key": "VBMbZV4sGD4=", "value": "200", "number": "1"}'
	
	{"name":"SuperBall","value":200,"number":1}
	
- このAPIをアイテムの消費に使うのが少ししんどいのであれば、違うリソースを提供します。(やろうと思えばこのAPIでもできそうだけど)


### ゲーム結果の更新(勝敗とスコア)
	curl http://localhost:3000/users/Nenecchi/results -X PATCH -H "Content-Type: application/json" -d '{"score": "200","vs": "win", "login_key": "VBMbZV4sGD4="}'
	
	{"win_count":1,"lose_count":0,"summer_vacation_days":0}%
	
	curl http://localhost:3000/users/Nenecchi/results -X PATCH -H "Content-Type: application/json" -d '{"score": "200","vs": "lose", "login_key": "VBMbZV4sGD4="}'
	
	{"win_count":1,"lose_count":1,"summer_vacation_days":0}%


### ゲーム結果の表示
	curl http://localhost:3000/users/Nenecchi/results?login_key=VBMbZV4sGD4= -X GET 

	{"win_count":2,"lose_count":1,"summer_vacation_days":0}%


