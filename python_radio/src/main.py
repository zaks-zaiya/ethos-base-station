from aiohttp import web
import socketio
import sys

import threading
from radio import radio_listen

# Allow web (9000) or electron (9300) apps to connect
sio = socketio.AsyncServer(cors_allowed_origins='*')
app = web.Application()
sio.attach(app)

@sio.event
def connect(sid, environ):
  print('connect ', sid)

@sio.event
def disconnect(sid):
  print('disconnect ', sid)

if __name__ == '__main__':
  production_arg = sys.argv[1] if len(sys.argv) > 1 else False
  if production_arg == 'prod' or production_arg == 'production':
    radio_thread = threading.Thread(target=radio_listen, args=[sio])
    radio_thread.start()
  web.run_app(app, port=5000)