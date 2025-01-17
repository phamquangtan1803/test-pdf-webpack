let fontClients = null
export const fetchFont = {
    setClients: (clients) => {
        fontClients = clients; 
    },
    get: async () => {
        const url = ''; 
        const requests = fontClients.map((client) =>
            client.get(url, { responseType: 'arraybuffer' })
        );
        return Promise.all(requests)
        .then((responses) => {
            return responses; 
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            throw error; 
        });
    }
}