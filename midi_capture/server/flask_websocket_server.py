from flask import Flask
from flask_socketio import SocketIO, send
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'bananeinderbirne'
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow all origins

num_midi_messages_received = 0

@app.route('/')
def index():
    return 'WebSocket Server'

@socketio.on('midi_message')
def handle_message(midi_message):
    try:
        global num_midi_messages_received
        # Process MIDI data
        if not isinstance(midi_message, dict):
            raise ValueError("Invalid message format") # The dict should contain the MIDI data in keys 'note', 'status' and 'velocity'
        for key in ['note', 'status', 'velocity', 'timestamp_webmidiapi_event_received']:
            if key not in midi_message:
                raise ValueError(f"Missing key '{key}' in midi message dictionary")
        print(f"Received MIDI data: {midi_message}")
        num_midi_messages_received += 1
        # Send a success response
        midi_message['timestamp_websocket_server_received'] = int(time.time() * 1000)  # convert to milliseconds since Unix epoch (1970-01-01)
        print(f"Received {num_midi_messages_received} so far. Sending response: {midi_message}")
        return({"status": "success", "data": midi_message})
    except Exception as e:
        # Send an error response
        print(f"Error: {e}")
        return({"status": "error", "error": str(e)})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)