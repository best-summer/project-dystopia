# ゲーム機能application

## マッチング管理

### ルームリスト取得
#### 通信方向
Unity->Rails

#### Request
```js
{
  "type":"get_rooms"
}
```

#### Response
```js
{
  "type":"get_rooms",
  "rooms":[
    {
      "room_id":"",
      "players":[
        {
          "device_id":"",
          "user_name":""
        },
        {
          "device_id":"",
          "user_name":""
        }
      ]
    }
  ]
}
```

### ルーム入室
#### 通信方向
Unity->Rails

#### Request
```js
{
  "type":"join_room",
  "room_id":""
}
```

#### Response
```js
{
  "type":"join_room",
  "room_id":""
}
```

### ルーム退出
#### 通信方向
Unity->Rails

#### Request
```js
{
  "type":"leave_room",
  "room_id":""
}
```

#### Response
```js
{
  "type":"leave_room",
  "status":"ok"
}
```

## ゲームプレイ
