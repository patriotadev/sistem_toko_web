import Service from './role.service';

const getAll = () => {
    return Service.getAll()
    .then((response) => Promise.resolve(response), (error) => Promise.reject(error));
};

export default { getAll };