import axiosInstance from "../../utils/axios-instance";

const getAll = () => {
    return axiosInstance({
        method: 'get',
        url: `/role`
    });
}

export default { getAll }