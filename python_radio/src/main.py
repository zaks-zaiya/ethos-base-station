import eventlet
import socketio
import threading

from radio import radio_listen

# Allow web (9000) or electron (9300) apps to connect
sio = socketio.Server(cors_allowed_origins='*')
app = socketio.WSGIApp(sio)

@sio.event
def connect(sid, environ):
  print('connect ', sid)

@sio.event
def disconnect(sid):
  print('disconnect ', sid)

if __name__ == '__main__':
  radio_thread = threading.Thread(target=radio_listen, args=[sio])
  radio_thread.start()
  eventlet.wsgi.server(eventlet.listen(('localhost', 5000)), app)