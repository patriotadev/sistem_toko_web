export const thousandLimiter = (number: string | number, currency: string | null): string => {
    const n: string = number.toString();
    let counter: number = 1;
    const result: string[] = [];
    for (let index = n.length - 1; index >= 0; index--) {
        result.push(n[index]);
        if (counter % 3 === 0) {
            result.push('.');
        }
        counter++
    }
    if (result[result.length - 1] === '.') result.pop();
    if (currency) {
        return `${currency}. ${result.reverse().join("")}`;
    }
    return `${result.reverse().join("")}`;
}