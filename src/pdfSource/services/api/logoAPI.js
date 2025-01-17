import axios from "axios";

const logoClient = () => axios.create();

export const fetchLogo = {
    get: async (url) => {
        const client = logoClient();
        return client.get(url, {responseType: 'arraybuffer'});
    }
}