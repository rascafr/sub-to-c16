import path from 'path';
import { argsToUsageStr, parseArgs } from './lib/args.mjs';
import { durationsToBinSequence, sequenceTo16LEBuffer } from './lib/bitseq.mjs';
import { writeHRFFile } from './lib/hrf.mjs';
import { parseSub } from './lib/sub.mjs';
import { ARGS_SPECS } from './args.specs.js';

const args = parseArgs(ARGS_SPECS, process.argv);

let {
    file, output,
    intermediate_freq,
    sampling_rate = 500000,
    amplitude = 100
} = args;

if (!file) {
    console.error(argsToUsageStr(ARGS_SPECS));
    process.exit(-1);
}

// use 1/100th of sampling rate by default for IF if not specified
if (!intermediate_freq) {
    intermediate_freq = Math.round(parseInt(sampling_rate) / 100);
    console.log('No intermediate frequency specified, using', (intermediate_freq / 1000), 'kHz');
}

// use input file path for output if not specified
if (!output) {
    output = path.parse(file).name;
    console.log('No output file specified, using', output);
}

const { filetype, version, frequency, preset, protocol, chunks } = parseSub(file);

console.log('Sub File information:');
console.log('-', [filetype, version, frequency, preset, protocol].join('\n- '));
console.log('Found', chunks.length, 'pure data chunks');

const IQSequence = durationsToBinSequence(chunks.flat(1), sampling_rate, intermediate_freq, amplitude);
const buff = sequenceTo16LEBuffer(IQSequence);
const outFiles = writeHRFFile(output, buff, frequency, sampling_rate);
console.log('Written', Math.round(buff.length / 1024), 'kiB,', IQSequence.length / sampling_rate, 'seconds in files', outFiles.join(', '));
