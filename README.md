```mermaid
flowchart TD
    AUDIO_CTX[[AudioContext]]
        AUDIO_CTX --> OSC_1
        AUDIO_CTX --> OSC_2

    OSC_1["Primary OSC\n(OscillatorNode)"] -- "frequency \n wave shape \n detune" --> 
        VCA_1["Primary VCA\n(GainNode)"] -- "volume" --> ALL_OSC
    OSC_2["Secondary OSC\n(OscillatorNode)"] -- "frequency \n wave shape \n detune"--> 
        VCA_2["Secondary VCA\n(GainNode)"] -- "volume" --> ALL_OSC
    
    ALL_OSC["Combined oscillators"] --> BIQUAD_FILTER
   
    subgraph FILTER
      BIQUAD_FILTER["BiquadFilter\n(BiquadFilterNode)"] -- "- low-pass\n- high-pass\n- band-pass" --> DETUNE["BiquadFilterNode.detune"]
    end

    subgraph LFO__1["LFO > FILTER"]
        LFO_1["LFO frequency\n(OscillatorNode)"] -- "wave shape \n freq 0.1 - 20 Hz \n level" --> LFO_1_GAIN["LFO amount\n(GainNode)"] --> DETUNE
    end

    subgraph LFO__2["LFO 2 - VCA"]
        LFO_2["LFO frequency\n(OscillatorNode)"] -- "wave shape \n freq 0.1 - 20 Hz \n level" --> LFO_2_GAIN["LFO amount\n(GainNode)"]
    end LFO__2 --> ALL_OSC
    
    FILTER --> DISTORTION["Distortion \n (WaveShaperNode)"] -- "level" --> LIMITER["Limiter \n (DynamicCompressorNode)"]
    FILTER --> DELAY["Delay time \n (DelayNode)"] -- "time \n feedback" --> DELAY_FEEDBACK["Feedback\n(GainNode)"] --> FILTER
    LIMITER --> MASTER_VCA["Master VCA\n(GainNode)"]
    LIMITER --> REVERB
   
    subgraph REVERB
        REVERB_GAIN["Reverb amount\n(GainNode)"] -- "length \n amount" --> REVERB_CONVOLVER["Reverb length\n(ConvolverNode)"]
    end    
    
    REVERB --> MASTER_VCA
    MASTER_VCA --> ANALYSER["Analyser\n(AnalyserNode)"]
    ANALYSER --> CTX_DESTINATION[[AudioContext.destination]]
```
# SynthJS

Monophonic synthesizer based on JavaScript Web API AudioContext.

![](SynthJS.png)

## Features:
- 2 oscillators
- 4 wave shapes 
  - sine
  - sawtooth
  - square
  - triangle
- 3 filters with Frequency and Quality Factor
  - LP - Low pass
  - HP - High pass
  - BP - Band pass
- ADSR envelope generator / gate switch 
- 2 LFO's for OSC Detune and Master VCA
- distortion with one algorithm
- effects
  - delay - time and feedback
  - reverb - length and amount
- master VCA
- live wave shape analyser
- playable keyboard with UI
- current note with Hz frequency

## Nodes connection diagram


## Available Scripts

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
