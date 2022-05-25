import axios from "axios";
const url = "http://localhost:1337/api/portfolios";
export const readPortfolios = () => axios.get(url);