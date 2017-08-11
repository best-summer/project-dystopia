#!/usr/bin/env python
# -*- coding: utf-8 -*-

import socket
import RPi.GPIO as GPIO
import time
import sys

def pull_servo_trigger():
    """
    霧吹きのトリガーを引いて水を噴射する
    処理は非同期なので各動作のあとにtimerを挿入している
    """

    GPIO.setmode(GPIO.BCM)

    gp_out = 4 # GPIOポート番号
    GPIO.setup(gp_out, GPIO.OUT)
    servo = GPIO.PWM(gp_out, 50)
    
    servo.start(0.0)
    for i in range(1):
        servo.ChangeDutyCycle(2)
        time.sleep(0.5)

        servo.ChangeDutyCycle(12.0)
        time.sleep(0.5)

        servo.ChangeDutyCycle(2)
        time.sleep(0.5)
        GPIO.cleanup()
        

def socket_server():
    # IPv4/TCP のソケット
    serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    serversocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, True)

    # host = '10.150.250.21' # IPアドレス
    host = sys.argv[1]
    print("Host IP Address:", host)
    port = 37564
    serversocket.bind((host, port))
    serversocket.listen(128)

    while True:
        # クライアントからの接続を待ち受ける
        clientsocket, (client_address, client_port) = serversocket.accept()
        print('New client: {0}:{1}'.format(client_address, client_port))

        while True:
            # クライアントソケットから指定したバッファバイト数だけデータを受け取る
            try:
                message = clientsocket.recv(1024)
                print('Recv: {}'.format(message))
            except OSError:
                break

            # 受信したデータの長さが 0 ならクライアントからの切断
            if len(message) == 0:
                break
            print("TEST:", message)

            if message == b'HIT\n':
                pull_servo_trigger()
                print('HIT!')
            else:
                print('NON HIT')

            # message= sent_message
            # while True:
            #     sent_len = clientsocket.send(sent_message)
            #     # 全てのメセージが送信できたら終了
            #     if sent_len == len(sent_message):
            #         break
            #     # 送信できなかったら終了
            #     sent_message = sent_message[sent_len:]
            # print('Send: {}'.format(message))

        clientsocket.close()
        print('Bye-Bye: {0}:{1}'.format(client_address, client_port))

if __name__ == '__main__':
    socket_server()

