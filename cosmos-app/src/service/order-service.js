import axios from "axios";

const baseUrl = 'http://localhost:3000/orders';

const CreateOrder = async (order) => {
    return axios.post(baseUrl, order);
}

const GetOrders = async () => {
    return axios.get(`http://localhost:3000/orders/all`);
}

export {CreateOrder, GetOrders};