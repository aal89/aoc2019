const computer = (() => {
    let input = [];
    let output = [];
    // status register;
    // first bit is a halt instruction to the program counter, this is set by opcode 99 (1 = run, 0 = halt)
    // second bit is a interrupt flag and is used for input scenarios. (0 = dont interrupt, 1 = interrupt)
    const sreg = [0];
    let ram;
    let instructionpointer;

    const operations = {
        '99': {
            size: 1,
            execute: () => sreg[0] = 0
        },
        '01': {
            size: 4,
            execute: (params, modes) => ram[params[2]] = paramVal(modes, params, 0) + paramVal(modes, params, 1)
        },
        '02': {
            size: 4,
            execute: (params, modes) => ram[params[2]] = paramVal(modes, params, 0) * paramVal(modes, params, 1)
        },
        '03': {
            size: 2,
            execute: (params) => {
                const next = input[0];
                input = input.slice(1);
                ram[params[0]] = next;
            }
        },
        '04': {
            size: 2,
            execute: (params, modes) => output.push(+(modes[0] ? params[0] : ram[params[0]]))
        },
        '05': {
            size: 3,
            execute: (params, modes) => paramVal(modes, params, 0) !== 0 ? instructionpointer = paramVal(modes, params, 1) - 3 : void 0
        },
        '06': {
            size: 3,
            execute: (params, modes) => paramVal(modes, params, 0) === 0 ? instructionpointer = paramVal(modes, params, 1) - 3 : void 0
        },
        '07': {
            size: 4,
            execute: (params, modes) => paramVal(modes, params, 0) < paramVal(modes, params, 1) ? ram[params[2]] = 1 : ram[params[2]] = 0
        },
        '08': {
            size: 4,
            execute: (params, modes) => paramVal(modes, params, 0) === paramVal(modes, params, 1) ? ram[params[2]] = 1 : ram[params[2]] = 0
        }
    };

    // helper function
    function paramVal(modes, params, i) {
        return +(modes[i] ? params[i] : ram[params[i]]);
    }

    // Since support for immediate values were added we now have variable length instructions. This decoder calculates all
    // required data to execute.
    function decode(fetched) {
        // left pad the opcode with zeros, adding any if they were omitted
        const paddedValue = fetched.value.toString().padStart(5, 0);
        const opcode = paddedValue.slice(-2);
        return {
            opcode,
            modes: paddedValue.slice(0, 3).split('').map(v => !!+v).reverse(),
            params: Array(operations[opcode].size - 1).fill().map((v, i) => ram[fetched.instructionpointer + i + 1]),
            size: operations[opcode].size
        }
    }

    // program counter with extra steps (fetches and decodes instructions before passing them along)
    function pc() {
        // halt loop
        while(!!sreg[0]) {
            const fetched = { instructionpointer, value: ram[instructionpointer] };
            const { opcode, modes, params, size } = decode(fetched);
            execute(opcode, modes, params);
            // update instruction pointer
            instructionpointer += size;
        }
    }

    // instruction execution
    function execute(code, modes, params) {
        operations[code].execute(params, modes);
    }

    // computer booting
    function boot(prg, inp = '') {
        // clearing stdin/stdout
        input = [].concat(inp.split(',')).map(n => +n);
        output = [];
        // reset instruction pointer
        instructionpointer = 0;
        // set halt status flag
        sreg[0] = 1;
        // load program into ram
        ram = prg.split(',');
        // start counting
        pc();
        
        return {
            ram,
            output
        };
    }

    return { boot };
})();

// runner sequence
function run(prg, input) {
    // process.stdout.write('executing program...'.toString());
    const { ram, output } = computer.boot(prg, input);
    // console.log('done...');
    // console.log('ram:\n', ram, '\n');
    // console.log('output: ', output);
    return { ram, output };
}

// computer tests
// const input = '8';
// let prg = '3,9,8,9,10,9,4,9,99,-1,8';
// run(prg, input);
// prg = '3,9,7,9,10,9,4,9,99,-1,8';
// run(prg, input);
// prg = '3,3,1108,-1,8,3,4,3,99';
// run(prg, input);
// prg = '3,3,1107,-1,8,3,4,3,99';
// run(prg, input);

// // larger example from day 05
// prg = '3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99';
// run(prg, input);

// helper function
function thrusterSettings(prg, settings) {
    const ampl = settings.split(',');
    return run(prg, `${ampl[4]},${run(prg, `${ampl[3]},${run(prg, `${ampl[2]},${run(prg, `${ampl[1]},${run(prg, `${ampl[0]},0`).output}`).output}`).output}`).output}`);
}

const max = {
    current: 0,
    setting: ''
}

// program
const prg = '3,8,1001,8,10,8,105,1,0,0,21,46,59,72,93,110,191,272,353,434,99999,3,9,101,4,9,9,1002,9,3,9,1001,9,5,9,102,2,9,9,1001,9,5,9,4,9,99,3,9,1002,9,5,9,1001,9,5,9,4,9,99,3,9,101,4,9,9,1002,9,4,9,4,9,99,3,9,102,3,9,9,101,3,9,9,1002,9,2,9,1001,9,5,9,4,9,99,3,9,1001,9,2,9,102,4,9,9,101,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,99,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,99,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,99';

let i = -1;
while(i !== 100000) {
    i++;
    const rawThrusterSettings = i.toString().padStart(5, 0).split('');
    if (rawThrusterSettings.every(n => n < 5)) {
        const result = thrusterSettings(prg, rawThrusterSettings.join(','));
        // if the new output is larger than we current track and only contains unique digits track it
        if (result.output[0] > max.current && rawThrusterSettings.every((n, i, a) => a.lastIndexOf(n) === i)) {
            max.current = result.output[0];
            max.setting = rawThrusterSettings.join(',');
        }
    }    
}

console.log(max);
