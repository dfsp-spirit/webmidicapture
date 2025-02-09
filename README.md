# webmidiplayground
Messing with MIDI in the browser via the Web MIDI Api.


## A note on browser support and local development / testing

Recent versions of Firefox, Chrome, Edge and Opera support the Web MIDI Api.

When testing locally, the situation in Firefox (FF) is a bit more complicated than in Chrome though: while FF has had support for quite a while according to [caniuse](https://caniuse.com/midi), at least locally via `file://` URLs, it does not seem to work for me in Firefox 135, the latest version as of 2/9/2025. This may be intentional because according to the FF documentation, usage of the API is only supported in *secure contexts* (`https://`). I tried serving the directory via python's built-in web server and it worked then (http:// is fine as long as it's on localhost, accoring to the FF docs that combination is considered a secure context). So try ```python -m http.server 8000``` in the local directory with the HTML/JS file for local testing, and you should be fine with FF.


## Some tests


### MIDI event capturing test

See [./midi_capture/ directory](./midi_capture/).

You can use a hardware MIDI generator like a keyboard, but for testing purposes a virtual MIDI keyboard like [VPMK](https://vmpk.sourceforge.io/) will do just as fine.

I have its output attached to [loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html), and from there into FL Studio to synthesize sounds from the MIDI signals, but that is entirely optional. We are only interested in the raw MIDI signals here, so if you're fine with not hearing anything or using the default Windows software sythesizer, you do not need this.

The Web MIDI API, which is integrated in recent Chrome versions and other browsers, can then pick up the MIDI signals and make them available to your Javascript code. For now we simply display them on key presses:


![WebMIDI](./midi_capture/webmiditest.jpg)
