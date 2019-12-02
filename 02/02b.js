// status register;
// first bit is a halt instruction to the program counter, this is set by opcode 99 (1 = run, 0 = halt)
const sreg = [0];
let ram;

// program counter with extra steps (fetches and decodes instructions before passing them along)
function pc() {
    const stepsize = 4;
    let addr = 0;
    while(!!sreg[0]) {
        execute(ram[addr], ram.slice(addr + 1, addr + stepsize));
        addr += stepsize;
    }
}

// instruction execution
function execute(opcode, data) {
    const opcodes = {
        '99': () => {
            // set halt status flag
            sreg[0] = 0;
        },
        '1': (data) => {
            // addition
            ram[data[2]] = +ram[data[0]] + +ram[data[1]];
        },
        '2': (data) => {
            // multiply
            ram[data[2]] = +ram[data[0]] * +ram[data[1]];
        }
    };

    opcodes[opcode](data);
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

// boot the computer
let prg = '1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,9,1,19,1,19,5,23,1,23,6,27,2,9,27,31,1,5,31,35,1,35,10,39,1,39,10,43,2,43,9,47,1,6,47,51,2,51,6,55,1,5,55,59,2,59,10,63,1,9,63,67,1,9,67,71,2,71,6,75,1,5,75,79,1,5,79,83,1,9,83,87,2,87,10,91,2,10,91,95,1,95,9,99,2,99,9,103,2,10,103,107,2,9,107,111,1,111,5,115,1,115,2,119,1,119,6,0,99,2,0,14,0';

// brute force to find answer 19690720, keep booting computer untill we find that number on addr 0
loop:
for(let i = 0; i < 99; i++) {
    for(let j = 0; j < 99; j++) {
        const splitprg = prg.split(',');
        splitprg[1] = i;
        splitprg[2] = j;
        boot(splitprg.join(','));

        if (ram[0] === 19690720) {
            console.log('found noun and verb...');
            break loop;
        }
    }
}
// when done dump ram
console.log('done running... dumping ram:\n', ram);
// answer
console.log('answer: ', parseInt(100 * ram[1]) + parseInt(ram[2]));
