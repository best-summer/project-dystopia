## Socket-Server
Raspberry-piで動かすsocketサーバです。

`python socket-server.py HOST-NAME`で起動します。

Socketサーバーは`HIT`文字列を受け取ると、サーボモータを動かして水を噴射し、`Splash`メッセージをクライアントにsendします。

それ以外の文字列を受け取ったときは`Silent`を返却します。

現在はクライアントは一台を想定しているので、ブロッキングかつシングルスレッドで動作させています。
