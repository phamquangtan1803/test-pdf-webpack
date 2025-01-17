import axios from "axios";

const mainClient = axios.create({baseURL: 'https://stg-api.obello.com/template-service/animations/list'})

mainClient.interceptors.response.use(
    (response) => {
        if (Array.isArray(response.data.data)) {
            response.data.data = response.data.data.map(item => {
                if (!item.hasOwnProperty('children')) {
                    item.children = [];
                }
                return item;
            });
        }
        return response.data.data;    
    },    
    (error) => {
        if (error.response) {
            return Promise.reject(error.response.data)
        }
        return Promise.reject(error.message)
    }
)

export default mainClient