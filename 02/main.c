#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define RAMSIZE 1024

void boot(char prg[]);
void pc();
void execute();

// status register
// bit 0 - halt flag (0 = stop, 1 = run)
char sreg[1] = { 0 };
unsigned int ram[RAMSIZE];

int main(int argc, char *argv[]) {
    // check argument requirements and program size
    if (argc != 2 || strlen(argv[1]) > RAMSIZE) {
        printf("Intcode computer emulator v0.1\n");
        printf("Loads intcode (<data>) into the ram and executes it. Dumps the ram to stdout when halted.\n");
        printf("RAM: %lu bytes\n", RAMSIZE * sizeof(int));
        printf("Usage: intcode <data>\n");

        return 0;
    }
    // boot the computer assuming the first argument is an intcode program
    boot(argv[1]);

    // when the computer ran dump the ram
    for(int i = 0; i < RAMSIZE; i++)
        printf(i == RAMSIZE - 1 ? "%d" : "%d,", ram[i]);
    printf("\n");
}

void boot(char prg[]) {
    // set halt status flag
    sreg[0] = 1;
    // load the program into ram
    char *ptr = strtok(prg, ",");
    int i = 0;

    while(ptr != NULL) {
        ram[i++] = strtol(ptr, NULL, 10);
        ptr = strtok(NULL, ",");
    }
    // start counting
    pc();
}

void pc() {
    int stepsize = 4;
    int addr = 0;

    while(sreg[0]) {
        int opcode = ram[addr];
        int params[3];
        memcpy(params, &ram[addr + 1], 3*sizeof(*ram));
        execute(ram[addr], params);
        addr += stepsize;
    }
}

void execute(int opcode, int params[]) {
    switch(opcode) {
        case 99:
            sreg[0] = 0;
            break;
        case 1:
            ram[params[2]] = ram[params[0]] + ram[params[1]];
            break;
        case 2:
            ram[params[2]] = ram[params[0]] * ram[params[1]];
            break;
        default:
            sreg[0] = 0;
            break;
    }
}
