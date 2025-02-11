// Start the WebSocket connection with the server

let send_to_server = false; // Set to true to send MIDI data to the server, false to display it in the console.
let socket = null;

function handleSendToServerChanged(send_to_server) {
    if (send_to_server) {
        document.getElementById('server_status').innerText = `Sending data to server is turned on.`;
        socket = io('http://localhost:5000'); // WebSocket server address, see server/ directory.

        // Listen for connection errors
        socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            // Handle connection errors (e.g., retry, notify the user, etc.)
            document.getElementById('server_status').innerText = `Error trying to connect to web socket server. Did you start the server? (Error details: ${error}))`;
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
        if(socket) {
            socket.disconnect();
            socket = null;
        }
        document.getElementById('server_status').innerText = `None (Sending data to server is turned off).`;
    }
}

handleSendToServerChanged(send_to_server);

document.getElementById("toggleUseServerButton").addEventListener("click", function() {
    send_to_server = !send_to_server;
    handleSendToServerChanged(send_to_server);
    document.getElementById("setting_use_server_status").textContent = send_to_server  ? "Sending data to server." : "Not sending data to server.";
    document.getElementById("toggleUseServerButton").textContent = !send_to_server ? "Activate sending data to server" : "Deactivate sending data to server";
    console.log("Boolean value for use server:", send_to_server);
});


function sendMidiData(midiData) {
    if(send_to_server) {
        socket.emit('message', midiData, (response) => {
            console.log("response: ", response);
            if (response && response.error) {
                console.error('Error sending MIDI data:', response.error);
                document.getElementById('server_status').innerText = `Error sending MIDI data: ${response.error}`;
                // Handle the error (e.g., retry, notify the user, etc.)
            } else {
                console.log('MIDI data sent successfully:', response);
                document.getElementById('server_status').innerText = `MIDI data sent successfully: ${JSON.stringify(response)}`;
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

    // List all MIDI input devices in console
    const inputs = midiAccess.inputs;
    console.log(`Found ${inputs.size} MIDI Input Devices:`);
    inputs.forEach((input) => {
        console.log(` * Input: ${input.name} (ID: ${input.id})`);
    });

    // List all MIDI output devices in console
    const outputs = midiAccess.outputs;
    console.log(`Found ${outputs.size} MIDI Output Devices:`);
    outputs.forEach((output) => {
        console.log(` * Output: ${output.name} (ID: ${output.id})`);
    });

    // Listen for device connection/disconnection events
    midiAccess.onstatechange = (event) => {
        console.log('MIDI device state changed:', event.port);
    };

    // Iterate over all MIDI input devices and listed for incoming messages
    midiAccess.inputs.forEach((input) => {
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

document.getElementById("setting_use_server_status").textContent = send_to_server ? "Sending data to server." : "Not sending data to server.";
document.getElementById("toggleUseServerButton").textContent = !send_to_server ? "Activate sending data to server" : "Deactivate sending data to server";

