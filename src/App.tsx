import React, { useRef } from 'react';
import { SynthEngineModel } from './models/SynthEngineModel';
import { createSynthEngine } from './services/SynthEngineFactory';
import SynthComponent from './components/SynthComponent/SynthComponent';
import { SynthParametersModel } from './models/SynthParametersModel';
import { createSynthParameters } from './services/SynthParametersFactory';

function App() {
    const synthEngine = useRef<SynthEngineModel>(createSynthEngine());
    const synthParameters = useRef<SynthParametersModel>(createSynthParameters());
    return <SynthComponent synthEngine={synthEngine} synthParameters={synthParameters} />;
}

export default App;
