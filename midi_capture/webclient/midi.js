// Start the WebSocket connection with the server

const send_to_server = false; // Set to true to send MIDI data to the server, false to display it in the console.
let socket = null;
if (send_to_server) {
    document.getElementById('server_status').innerText = `Sending data to server is turned on.`;
    socket = io('http://localhost:5000'); // WebSocket server address, see server/ directory.

    // Listen for connection errors
    socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        // Handle connection errors (e.g., retry, notify the user, etc.)
        document.getElementById('server_status').innerText = `Error trying to connect to web socket server: ${error}`;
    });

    // Listen for disconnection events
    socket.on('disconnect', (reason) => {
            console.warn('WebSocket disconnected:', reason);
            document.getElementById('server_status').innerText = `Disconnected from the web socket server: ${reason}`;
            // Handle disconnection (e.g., attempt to reconnect)
            if (reason === 'io server disconnect') {
                // Manually reconnect if the server disconnects
                document.getElementById('server_status').innerText = `Disconnected from the web socket server: ${reason}. Trying to reconnect...`;
                socket.connect();
            }
    });
} else {
    document.getElementById('server_status').innerText = `Sending data to server is turned off.`;
}


function sendMidiData(midiData) {
    if(send_to_server) {
        socket.emit('message', midiData, (response) => {
            if (response.error) {
                console.error('Error sending MIDI data:', response.error);
                // Handle the error (e.g., retry, notify the user, etc.)
            } else {
                console.log('MIDI data sent successfully:', response);
            }
        });
    } else {
        console.log('MIDI data:', midiData);
    }
}


// Check if the browser supports Web MIDI API
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
        .then(onMIDISuccess, onMIDIFailure);
} else {
    document.getElementById('status').innerText = 'Web MIDI API is not supported in this browser.';
}

// Success callback function
function onMIDISuccess(midiAccess) {
    console.log('MIDI Access Successful');
    document.getElementById('status').innerText = 'MIDI access granted. Waiting for MIDI messages. Play your instrument or a virtual device like VMPK...';

    // Iterate over all MIDI input devices
    midiAccess.inputs.forEach((input) => {
        console.log('Input device:', input.name);
        input.onmidimessage = handleMIDIMessage; // Set up the message handler
    });
}

// Failure callback function
function onMIDIFailure() {
    console.log('Failed to get MIDI access');
    document.getElementById('status').innerText = 'Failed to get MIDI access.';
}

// Handle incoming MIDI messages
function handleMIDIMessage(event) {
    const data = event.data;
    const status = data[0]; // MIDI message type
    const note = data[1];   // MIDI note number (if applicable)
    const velocity = data[2]; // MIDI velocity (if applicable)

    console.log(`MIDI Message: [status: ${status}, note: ${note}, velocity: ${velocity}]`);
    if (send_to_server) {
        sendMidiData({ status, note, velocity }); // Send the MIDI message to the server
    }

    // Display message on the page (for example, MIDI note information)
    document.getElementById('status').innerText = `MIDI Message: [status: ${status}, note: ${note}, velocity: ${velocity}]`;
}
