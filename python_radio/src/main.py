import eventlet
import socketio

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
  eventlet.wsgi.server(eventlet.listen(('localhost', 5000)), app)