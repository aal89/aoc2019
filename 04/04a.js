const range = [367479,893698];

const containsAdjacentDigits = (n) => n.toString().split('').some((e, i, a) => a.lastIndexOf(e) != i++);
const digitsIncrease = (n) => n.toString().split('').every((e, i, a) => e <= (a[++i] || Number.MAX_SAFE_INTEGER));

const passwords = Array(range[1] - range[0])
    .fill()
    .map((e, i) => i + range[0])
    .filter(digitsIncrease)
    .filter(containsAdjacentDigits);

console.log(passwords.length);
