import React, { useRef } from 'react';
import { SynthEngineModel } from './models/SynthEngineModel';
import { createSynthEngine } from './services/SynthEngineFactory';
import SynthComponent from './components/SynthComponent/SynthComponent';
import './App.css';

function App() {
    const synthEngine = useRef<SynthEngineModel>(createSynthEngine());

    return <SynthComponent {...synthEngine} />;
}

export default App;
