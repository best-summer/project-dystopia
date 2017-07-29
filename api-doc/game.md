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
  "status":""
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

### ゲーム開始
#### 通信方向
Rails->Unity

#### Request
```js
{
  "type":"game_start",
  "room_id":""
}
```

#### Response
```js
{
  "status":"ok"
}
```

### ゲーム終了
#### 通信方向
Rails->Unity

#### Request
```js
{
  "type":"game_finish",
  "room_id":""
}
```

#### Response
```js
{
  "status":"ok"
}
```
