import { fetchData } from "./api/mainAPI.js";

let templateSizeID = ''

export const templateData = {
    getAll: async () => {
        return await fetchData.get(templateSizeID)
    }
}