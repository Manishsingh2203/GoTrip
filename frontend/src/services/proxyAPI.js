import axios from 'axios';
const proxy = axios.create({ baseURL: process.env.REACT_APP_API_URL || '' });
export const proxyAPI = {
  countryInfo: (name) => proxy.get(`/api/proxy/country/${encodeURIComponent(name)}`),
  wiki: (title) => proxy.get(`/api/proxy/wiki/${encodeURIComponent(title)}`),
  exchange: (base, target) => proxy.get(`/api/proxy/exchange?base=${base}&target=${target}`)
};
