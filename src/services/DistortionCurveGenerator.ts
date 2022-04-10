export const createDistortionCurve = (distGain: number) => {
    const n_samples = 44100;
    let curve = new Float32Array(n_samples);
    let x: number;
    for (let i = 0; i < n_samples; ++i) {
        x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + distGain) * x * 57 * (Math.PI / 180)) / (Math.PI + distGain * Math.abs(x));
    }
    return curve;
};
