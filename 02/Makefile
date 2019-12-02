all:
	gcc -o ./bin/intcode main.c
	./bin/intcode "1,0,0,0,99"

auto:
	nodemon --exec "make || exit 1" -e "c,h"