const HACKRF_OFFSET = 0; // set to 0 for signed

export function durationsToBinSequence(durations, sampling_rate, intermediate_freq, amplitude) {
    const sequence = durations.map(d => {
        return usToSin(d > 0, Math.abs(d), sampling_rate, intermediate_freq, amplitude);
    });
    return sequence.flat(1);
}

function usToSin(level, duration, sampling_rate, intermediate_freq, amplitude) {
    const ITERATIONS = sampling_rate * duration / (1000 * 1000);
    const DATA_STEP_PER_SAMPLE = 2 * Math.PI / (sampling_rate / intermediate_freq);
    const HACKRF_AMPLITUDE = (256**2 - 1) * (amplitude / 100); 	// generated sin wave amplitude

    //console.log(duration, 'us =', ITERATIONS);
    const samples = new Array(ITERATIONS).fill(0);
    return samples.map((_,i) => level ?
        [
            HACKRF_OFFSET + Math.floor(Math.cos(i*DATA_STEP_PER_SAMPLE) * (HACKRF_AMPLITUDE / 2)),
            HACKRF_OFFSET + Math.floor(Math.sin(i*DATA_STEP_PER_SAMPLE) * (HACKRF_AMPLITUDE / 2))
        ] : 
        [HACKRF_OFFSET, HACKRF_OFFSET]
    );
}

export function sequenceTo16LEBuffer(sequence) {
    const le16Buff = Buffer.alloc(sequence.length*4); // 2 bytes for I, 2 bytes for Q
    sequence.forEach(([i, q], cursor) => {
        const buffPtr = cursor * 4;
        le16Buff.writeInt16LE(i, buffPtr);
        le16Buff.writeInt16LE(q, buffPtr+2);
    });
    return le16Buff;
}
