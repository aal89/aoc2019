const inputArr = [
    89407,
    103327,
    75227,
    80462,
    147732,
    127392,
    147052,
    67987,
    69650,
    63139,
    117260,
    75686,
    146517,
    147057,
    91654,
    96757,
    123428,
    118351,
    84167,
    73536,
    59261,
    139879,
    85969,
    93931,
    125232,
    62629,
    107163,
    105032,
    124295,
    112716,
    72402,
    137719,
    126924,
    59903,
    102568,
    63963,
    145435,
    54578,
    141348,
    77099,
    64050,
    60012,
    131514,
    81400,
    118451,
    124420,
    124821,
    51746,
    72382,
    125018,
    130662,
    116926,
    73573,
    117827,
    101462,
    85172,
    123277,
    62842,
    91856,
    61046,
    57290,
    86265,
    59080,
    55713,
    88492,
    138409,
    134009,
    114376,
    86621,
    107651,
    146528,
    135273,
    87760,
    134164,
    141430,
    133574,
    109457,
    110225,
    147989,
    74089,
    55747,
    61602,
    139444,
    111397,
    95751,
    133049,
    129641,
    101287,
    88916,
    83340,
    140286,
    88824,
    66013,
    65935,
    141174,
    105662,
    97399,
    91345,
    120164,
    80904
];

function calculateFuelRequirement( mass) {
    const fuel = Math.max(0, Math.floor(mass / 3) - 2);

    if (fuel > 0) {
        return fuel + calculateFuelRequirement(fuel);
    }

    return fuel;
}

console.log(inputArr.map(calculateFuelRequirement).reduce((a, c) => a + c, 0));
