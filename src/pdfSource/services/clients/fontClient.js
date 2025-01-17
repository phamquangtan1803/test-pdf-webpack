import axios from "axios"

export default async function initializeFontClients(data) {
    const mainData = data
    const textData = mainData.flatMap((item) => item.children).filter((child) => child.type === "text")
    const fontClients = textData.map((textItem) => {
        const fileExtension = textItem.s3FilePath.match(/\.([a-zA-Z0-9]+)$/)?.[1];
        const client = axios.create({
            baseURL: textItem.s3FilePath 
        });
        client.fileExtension = fileExtension;
        return client
        }
    )

    const responseInterceptor = (client) => {
        client.interceptors.response.use(
            (response) => ({ data: response.data, fileExtension: client.fileExtension }),
            (error) => {
                if (error.response) {
                    return Promise.reject(error.response.data);
                }
                return Promise.reject(error.message);
            }
        );
    };

    fontClients.forEach(responseInterceptor);
    return fontClients;
}


