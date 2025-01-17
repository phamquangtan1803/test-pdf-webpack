import mainClient from "../clients/mainClient.js";

export const fetchData = {
  get: async (templateSizeID) => {
    const url = '';
    return mainClient.get(url, {
      params: { template_size_id: templateSizeID}
    });
  }
}

