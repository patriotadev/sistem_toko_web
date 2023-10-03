import Service from './toko.service';

const getAll = () => {
    return Service.getAll()
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
};

export default { getAll };