## Socket-Server
Raspberry-piで動かすsocketサーバです。

`python socket-server.py HOST-NAME`で起動します。

Socketサーバーは`HIT`文字列を受け取ると、サーボモータを動かして水を噴射し、`Splash`メッセージをクライアントにsendします。

それ以外の文字列を受け取ったときは`Silent`を返却します。

現在はクライアントは一台を想定しているので、ブロッキングかつシングルスレッドで動作させています。