import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";

//to add a delay on displaying the products
const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true;//to store the cookie in our app storage

const responseBody = (response : AxiosResponse) => response.data;

//using axios interceptor
axios.interceptors.response.use(async response => {
    await sleep();
    return response;

}, (error: AxiosError) => {
    const {data, status} = error.response as any; ;
    switch (status) {
        case 400:
            if (data.errors){
                const modelStateErrors: string[] = [];
                for(const key in data.errors) {
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title)
            break;
        case 401:
            toast.error(data.title)
            break;
        case 500:
            //we want to redirect the user to the server error component
            history.push({
                pathname: "/server-error",
                state: {error: data}
            });
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),//get the data out the response itself
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),//when creating a resource on the server
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),//updating a resource on the server
    delete: (url: string) => axios.delete(url).then(responseBody)//deleting a resource on the server
}

//create an object to store our requests for our catalog
const Catalog = {
    list: () => requests.get("products"),
    details: (id: number) => requests.get(`products/${id}`),
}

//create another object for our buggy controller
const TestErrors = {
    get400Error: () => requests.get("buggy/bad-request"),
    get401Error: () => requests.get("buggy/unauthorised"),
    get404Error: () => requests.get("buggy/not-found"),
    get500Error: () => requests.get("buggy/server-error"),
    getValidationError: () => requests.get("buggy/validation-error")
}

//basket
const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
}

const agent = {
    Catalog,
    TestErrors,
    Basket
}

export default agent;