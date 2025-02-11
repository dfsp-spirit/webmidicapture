# Setup of a software MIDI keyboard

## Setup under Windows 10

If you do not have a physical MIDI keyboard, for testing purposes a virtual MIDI keyboard like [VMPK](https://vmpk.sourceforge.io/) will do just as fine.

You will also need a virtual MIDI cable to make your virtual device appear as a physical MIDI device on a MIDI port.We will use [loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html) for that purpose. Make sure to start it, create a port (simply click the `Add Port` button labeled `+` on the Setup tab once) and make sure to keep the software running. Running it minified is fine, but it needs to run and have a port configured:

![WebMIDI](./midi_capture/setup_loopmidi.jpg)

 The in your virtual MIDI controller like VMPK, configure MIDI routing and set the port you created in loopMIDI as the MIDI output:

 ![WebMIDI](./midi_capture/setup_vmpk.jpg)


## Using a custom software sythesizer

The VMPK tool comes with its own software sythesizer to play sounds from the MIDI events, but you can of course use a custom software sythesizer if you prefer. I have its output attached to [loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html), and from there into FL Studio to synthesize sounds from the MIDI signals, but the FL Studio part is entirely optional of course. We are only interested in the raw MIDI signals here, so if you're fine with using the default software sythesizer, you do not need a separate DAW.
