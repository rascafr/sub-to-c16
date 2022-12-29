import fs from 'fs';

const HRF_EXT = ['C16', 'TXT'];

export function writeHRFFile(file, buffer, frequency, sampling_rate) {
    const PATHS = HRF_EXT.map(ext => `${file}.${ext}`);
    fs.writeFileSync(PATHS[0], buffer);
    fs.writeFileSync(PATHS[1], generateMetaString(frequency, sampling_rate));
    return PATHS;
};

function generateMetaString(frequency, sampling_rate) {
    const meta = [
        ['sample_rate', sampling_rate],
        ['center_frequency', frequency],
    ];
    return meta.map(r => r.join('=')).join('\n');
}