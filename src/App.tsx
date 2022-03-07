import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import VolumeComponent from './VolumeComponent';

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

function App() {
  const waveforms: string[] = ["sawtooth", "sine", "square", "triangle"];

  const audioContextRef = useRef<any>();
  const lfoRef = useRef<any>();
  const vcaRef = useRef<any>();

  const [playing, setPlaying] = useState(false);
  const [masterVolumeLevel, setMasterVolumeLevel] = useState<number>(0.1);
  const [waveform, setWaveform] = useState<OscillatorType>('sine');


  useEffect(() => {
    // new context
    const audioContext = new AudioContext();

    // LFO - oscillator node
    let LFO = audioContext.createOscillator();
    LFO.type = waveform;
    LFO.frequency.value = 440;

    // VCA - gain node
    let VCA = audioContext.createGain();
    VCA.gain.value = randomValue();  

    LFO.start();
    audioContext.suspend();

    // connect
    LFO.connect(VCA).connect(audioContext.destination);

    audioContextRef.current = audioContext;
    lfoRef.current = LFO;
    vcaRef.current = VCA;


    return () => LFO.disconnect(VCA);
  }, []);

  useEffect(() => {
    if (vcaRef) {
      vcaRef.current.gain.value = masterVolumeLevel;
    }
  }, [masterVolumeLevel, vcaRef])

  const randomValue = () => {
    const a = Math.random();
    console.log(a);
    return a;
  }

  useEffect(() => {
    console.log(waveform);
    if (lfoRef.current) {
      lfoRef.current.type = waveform;
    }
  }, [waveform])

  const toggleOscillator = () => {
    if (playing) {
      audioContextRef.current.suspend();
    } else {
      audioContextRef.current.resume();
    }
    setPlaying((play) => !play);
  };

  const handleVolumeChange = (event: any) => {
    const volumeLevel: number = event.target.value;
    console.log(volumeLevel);
    setMasterVolumeLevel(volumeLevel);
  }

  const handleWaveformChange = (event: any) => {
    const selectedWaveform: OscillatorType = event.target.value;
    setWaveform(selectedWaveform);
  }

  return (
    <div className="App">
      <br />
      <button onClick={toggleOscillator} data-playing={playing}>
        <span>{playing ? "Pause" : "Play"}</span>
      </button>
      <br /><br />
      <hr />
      <h5>Master Volume</h5>
      <br />
      <input type="range" id="volume-control" min={0} max={1} step={0.05}
        value={masterVolumeLevel} onChange={handleVolumeChange} /><br />
      <VolumeComponent gainNode={vcaRef} />
      <hr />
      <h5>Master Volume</h5>
      <br />
      {
        waveforms.map((w, i) => {
          return (
            <div key={i}>
              <input
                type="radio"
                id={w + "-wave"}
                name="waveform"
                value={w}
                onChange={handleWaveformChange}
                checked={w === waveform} />
              <label htmlFor={w + "-wave"}>{w + " wave"}</label><br />
            </div>
          )
        })
      }

    </div>
  );
}

export default App;
