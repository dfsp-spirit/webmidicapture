# webmidiplayground
Messing with MIDI in the browser.

Some tests:


# MIDI event capturing test

See [./midi_capture/ directory](./midi_capture/).

You can use a hardware MIDI generator like a keyboard, but for testing purposes a virtual MIDI keyboard like [VPMK](https://vmpk.sourceforge.io/) will do just as fine.

I have its output attached to [loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html), and from there into FL Studio to synthesize sounds from the MIDI signals, but that is entirely optional. We are only interested in the raw MIDI signals here, so if you're fine with not hearing anything or using the default Windows software sythesizer, you do not need this.

The Web MIDI API, which is integrated in recent Chrome versions and other browsers, can then pick up the MIDI signals and make them available to your Javascript code. For now we simply display them on key presses:


![WebMIDI](./midi_capture/webmiditest.jpg)
