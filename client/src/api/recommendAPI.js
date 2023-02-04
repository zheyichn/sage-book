import axios from "axios";
import config from "./config.json";

// books recommendation by Genre
const fetchRecByGenre = async (userName) => {
  const url = `http://${config.server_host}:${config.server_port}/recommend/genre/${userName}`;
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (e) {
    return e;
  }
};

// books recommendation by shared books
const fetchRecByBooks = async (userName) => {
  const url = `http://${config.server_host}:${config.server_port}/recommend/sharedbooks/${userName}`;
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (e) {
    return e;
  }
};

export { fetchRecByGenre, fetchRecByBooks };
