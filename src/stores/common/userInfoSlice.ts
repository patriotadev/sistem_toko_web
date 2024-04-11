import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getUserLogin } from "../../helpers/helper";

const fetchUserLogin = async () => {
    const result = await getUserLogin();
    return result;
}

console.log(await fetchUserLogin());

const initialState = {
    value : await fetchUserLogin() as unknown as any                                                                        
}

export const userInfoSlice = createSlice({
    name: "userInfo",
    initialState,
    reducers: {}
});

export const SelectUserInfo = (state: RootState) => {
    return {
        name: state.userInfo.value?.personal?.name,
        email: state.userInfo.value?.personal?.email,
        role: state.userInfo.value?.role?.description,
        tokoId: state.userInfo.value?.toko?.id,
        tokoName: state.userInfo.value?.toko?.description,
        tokoContact: state.userInfo.value?.toko?.contact,
        tokoAddress: state.userInfo.value?.toko?.address,
        tokoCity: state.userInfo.value?.toko?.city,
        paymentAccount: state.userInfo.value?.paymentAccount,
    }
};


export default userInfoSlice.reducer;