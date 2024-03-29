// status register;
// first bit is a halt instruction to the program counter, this is set by opcode 99 (1 = run, 0 = halt)
// second bit is a interrupt flag and is used for input scenarios. (0 = dont interrupt, 1 = interrupt)
const sreg = [0];
let ram;

const operations = {
    '99': {
        size: 1,
        execute: () => sreg[0] = 0
    },
    '01': {
        size: 4,
        execute: (params, modes) => ram[params[2]] = +(modes[0] ? params[0] : ram[params[0]]) + +(modes[1] ? params[1] : ram[params[1]])
    },
    '02': {
        size: 4,
        execute: (params, modes) => ram[params[2]] = +(modes[0] ? params[0] : ram[params[0]]) * +(modes[1] ? params[1] : ram[params[1]])
    },
    '03': {
        size: 2,
        execute: (params) => ram[params[0]] = +require('fs').readFileSync('./inputa')
    },
    '04': {
        size: 2,
        execute: (params, modes) => out(modes[0] ? params[0] : ram[params[0]])
    }
};

// Since support for immediate values were added we now have variable length instructions. This decoder calculates all
// required data to execute.
function decode(fetched) {
    // left pad the opcode with zeros, adding any if they were omitted
    const paddedValue = fetched.value.toString().padStart(5, 0);
    const opcode = paddedValue.slice(-2);
    return {
        opcode,
        modes: paddedValue.slice(0, 3).split('').map(v => !!+v).reverse(),
        params: Array(operations[opcode].size - 1).fill().map((v, i) => ram[fetched.counter + i + 1]),
        size: operations[opcode].size
    }
}

// program counter with extra steps (fetches and decodes instructions before passing them along)
function pc() {
    let counter = 0;
    // halt loop
    while(!!sreg[0]) {
        const fetched = { counter, value: ram[counter] };
        const { opcode, modes, params, size } = decode(fetched);
        execute(opcode, modes, params);
        // update instruction pointer
        counter += size;
    }
}

// instruction execution
function execute(code, modes, params) {
    operations[code].execute(params, modes);
}

// computer booting
function boot(prg) {
    // set halt status flag
    sreg[0] = 1;
    // load program into ram
    ram = prg.split(',');
    // start counting
    pc();
}

function out(value) {
    process.stdout.write(value.toString());
}

const prg = '3,225,1,225,6,6,1100,1,238,225,104,0,1001,92,74,224,1001,224,-85,224,4,224,1002,223,8,223,101,1,224,224,1,223,224,223,1101,14,63,225,102,19,83,224,101,-760,224,224,4,224,102,8,223,223,101,2,224,224,1,224,223,223,1101,21,23,224,1001,224,-44,224,4,224,102,8,223,223,101,6,224,224,1,223,224,223,1102,40,16,225,1102,6,15,225,1101,84,11,225,1102,22,25,225,2,35,96,224,1001,224,-350,224,4,224,102,8,223,223,101,6,224,224,1,223,224,223,1101,56,43,225,101,11,192,224,1001,224,-37,224,4,224,102,8,223,223,1001,224,4,224,1,223,224,223,1002,122,61,224,1001,224,-2623,224,4,224,1002,223,8,223,101,7,224,224,1,223,224,223,1,195,87,224,1001,224,-12,224,4,224,1002,223,8,223,101,5,224,224,1,223,224,223,1101,75,26,225,1101,6,20,225,1102,26,60,224,101,-1560,224,224,4,224,102,8,223,223,101,3,224,224,1,223,224,223,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,108,677,226,224,102,2,223,223,1006,224,329,1001,223,1,223,1108,226,677,224,1002,223,2,223,1006,224,344,101,1,223,223,7,226,677,224,102,2,223,223,1006,224,359,1001,223,1,223,1007,226,677,224,1002,223,2,223,1006,224,374,1001,223,1,223,1108,677,226,224,102,2,223,223,1005,224,389,1001,223,1,223,107,226,226,224,102,2,223,223,1006,224,404,101,1,223,223,1107,226,226,224,1002,223,2,223,1005,224,419,1001,223,1,223,1007,677,677,224,102,2,223,223,1006,224,434,101,1,223,223,1107,226,677,224,1002,223,2,223,1006,224,449,101,1,223,223,107,677,677,224,102,2,223,223,1005,224,464,1001,223,1,223,1008,226,226,224,1002,223,2,223,1005,224,479,101,1,223,223,1007,226,226,224,102,2,223,223,1005,224,494,1001,223,1,223,8,677,226,224,1002,223,2,223,1005,224,509,1001,223,1,223,108,677,677,224,1002,223,2,223,1005,224,524,1001,223,1,223,1008,677,677,224,102,2,223,223,1006,224,539,1001,223,1,223,7,677,226,224,1002,223,2,223,1005,224,554,101,1,223,223,1108,226,226,224,1002,223,2,223,1005,224,569,101,1,223,223,107,677,226,224,102,2,223,223,1005,224,584,101,1,223,223,8,226,226,224,1002,223,2,223,1005,224,599,101,1,223,223,108,226,226,224,1002,223,2,223,1006,224,614,1001,223,1,223,7,226,226,224,102,2,223,223,1006,224,629,1001,223,1,223,1107,677,226,224,102,2,223,223,1005,224,644,101,1,223,223,8,226,677,224,102,2,223,223,1006,224,659,1001,223,1,223,1008,226,677,224,1002,223,2,223,1006,224,674,1001,223,1,223,4,223,99,226';
console.log('booting computer...');
boot(prg);
console.log('\ndone running... dumping ram:\n', ram);
