from flask import Flask
from flask_socketio import SocketIO, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'bananeinderbirne'
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow all origins

@app.route('/')
def index():
    return 'WebSocket Server'

@socketio.on('message')
def handle_message(message):
    try:
        # Simulate processing MIDI data
        if not isinstance(message, dict):
            raise ValueError("Invalid message format")
        print(f"Received MIDI data: {message}")
        # Send a success response
        send({"status": "success", "data": message})
    except Exception as e:
        # Send an error response
        print(f"Error: {e}")
        send({"status": "error", "error": str(e)})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)