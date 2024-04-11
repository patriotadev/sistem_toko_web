import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const thousandLimiter = (number: string | number, currency: string | null): string => {
    if (number === undefined || number === null) return '';
    let n: string;
    if (typeof number === 'number') {
        n = number.toString();
    } else {
        n = number
    }
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
    console.log(`${result.reverse().join("")}`, ">>>> delimiter")
    return `${result.reverse().join("")}`;
}

export const getUserLogin = async () => {
    const token = Cookies.get('accessToken');
    const roleData = Cookies.get('role');
    const tokoData = Cookies.get('toko');
    const paymentAccountData = Cookies.get('paymentAccount');
    const userRoleMenuData = Cookies.get('userRoleMenu');
    if (token && roleData && tokoData && userRoleMenuData && paymentAccountData) {
        const personal = jwtDecode(token);
        const role = JSON.parse(roleData);
        const toko = JSON.parse(tokoData);
        const userRoleMenu = JSON.parse(userRoleMenuData);
        const paymentAccount = JSON.parse(paymentAccountData);
        return {
            personal,
            role,
            toko,
            userRoleMenu,
            paymentAccount
        };
    }
    return null;
}