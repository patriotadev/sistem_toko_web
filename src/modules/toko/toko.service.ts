
const getAll = () => {
    return fetch('http://localhost:3082/api/toko', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export default { getAll }