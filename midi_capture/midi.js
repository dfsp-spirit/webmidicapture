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
    document.getElementById('status').innerText = 'MIDI access granted. Waiting for messages...';

    // Iterate over all MIDI input devices
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

    // Display message on the page (for example, MIDI note information)
    document.getElementById('status').innerText = `MIDI Message: [status: ${status}, note: ${note}, velocity: ${velocity}]`;
}
