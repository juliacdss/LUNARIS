import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYzIzNmNmZjUxNDdmMTJiNjhkZDQyZmU4M2ZkOGI2NiIsIm5iZiI6MTc1OTIzMjc2OS41ODA5OTk5LCJzdWIiOiI2OGRiYzMwMWRjNjFhNWUwMTllMWMzYTQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.mAfEKkbeqdg7g3VjVaLLYQ-PDq7W7sR5ArFPBIyrXr4`,
  },
});

export default api;