# ゲーム機能application

## マッチング管理

### ルームリスト取得
#### 通信方向
Unity->Node

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
Unity->Node

#### Request
```js
{
  "type":"join_room",
  "room_id":"",
  "device_id":""
}
```

#### Response
```js
{
  "type":"join_room",
  "status":"ok"
}
```

### ルーム退出
#### 通信方向
Unity->Node

#### Request
```js
{
  "type":"leave_room",
  "room_id":"",
  "device_id":""
}
```

#### Response
```js
{
  "type":"leave_room",
  "status":"ok"
}
```

## ゲーム進行管理

### ゲーム開始
#### 通信方向
Node->Unity

#### Request
```js
{
  "type":"game_start",
  "room_id":""
}
```

### ゲーム終了
#### 通信方向
Node->Unity

#### Request
```js
{
  "type":"game_finish",
  "room_id":""
}
```

## ゲームプレイ

### 残り時間
#### 通信方向
Node->Unity

#### Request
```js
{
  "type":"game_time",
  "time_second":54
}
```

### スコア
#### 通信方向
Node->Unity

#### Request
```js
{
  "type":"game_score",
  "scores":[
    {
      "device_id":"",
      "score":78
    },
    {
      "device_id":"",
      "score":22
    }
  ]
}
```

### ボール射出
#### 通信方向
Node->Unity

#### Request
```js
{
  "type":"shoot_ball",
  "ball_type":"",
  "ball_id":"",
  "position":{
    "x":121,
    "y":33
  },
  "vector":{
    "x":323,
    "y":323
  }
}
```

### バー移動
#### 通信方向
Unity->Node->Unity

#### Request
```js
{
  "type":"move_bar",
  "device_id":""
  "bar_type":"{left,right}"
}
```

### スペシャル発動
#### 通信方向
Unity->Node->Unity

#### Request
```js
{
  "type":"launch_special",
  "device_id":""
  "ball_type":""
}
```

### ボール反射
#### 通信方向
Unity->Node->Unity

#### Request
```js
{
  "type":"reflect_ball",
  "device_id":"",
  "ball_id":"",
  "ball_type":"",
  "reflect_type":"{wall,bar}",
  "position":{
    "x":121,
    "y":33
  },
  "vector":{
    "x":323,
    "y":323
  }
}
```

### ゴール
#### 通信方向
Unity->Node->Unity

#### Request
```js
{
  "type":"goal",
  "device_id":"",
  "ball_id":"",
  "ball_type":""
}
```

## リザルト機能

### スコア送信

#### 通信方向
Node->Rails

#### エンドポイント
/gameresult

#### Request
```js
{
  "scores":[
    {
      "device_id":"",
      "score":""
    },
    {
      "device_id":"",
      "score":""
    }
  ]
}
```

#### Response
```js
{
  "status":"ok"
}
```