import fs from 'fs';

// 0.1.0
const SUPPORTED_PROTOCOLS = [
    'RAW'
];

export function parseSub(file) {
    let sub_data = '';
    try {
        sub_data = fs.readFileSync(file).toString();
    } catch(ex) {
        console.error('Cannot read input file');
        process.exit(-1);
    }

    const sub_chunks = sub_data.split('\n').map(r => r.trim());
    const [ filetype, version, frequency, preset, protocol ] = sub_chunks;
    const infoObj = {};

    chunkRowToObj(filetype, infoObj);
    chunkRowToObj(version, infoObj);
    chunkRowToObj(frequency, infoObj);
    chunkRowToObj(preset, infoObj);
    chunkRowToObj(protocol, infoObj);

    if (!SUPPORTED_PROTOCOLS.includes(infoObj.protocol)) {
        console.error('Failed to parse', file, ': Currently supported protocols are', SUPPORTED_PROTOCOLS.join(','), '(found: ' + infoObj.protocol + ')');
        process.exit(-1);
    }

    infoObj.chunks = sub_chunks.slice(5)
        .map(r => r.split(':')[1]
            .split(' ')
            .map(e => e.trim())
            .filter(e => e.length)
            .map(e => parseInt(e, 10)
        ));

    return infoObj;
}

function chunkRowToObj(row, base = {}) {
    const [ value, key ] = row.split(':').map(e => e.trim());
    base[value.toLowerCase()] = key;
}