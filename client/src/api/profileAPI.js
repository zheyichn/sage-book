import axios from "axios";
import config from "./config.json";

// API to get a user
const getUser = async (userName) => {
  const url = `http://${config.server_host}:${config.server_port}/user/${userName}`;
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (e) {
    return e;
  }
};

const getUserFavBooks = async (userName) => {
  const url = `http://${config.server_host}:${config.server_port}/favorites/${userName}`;
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (e) {
    return e;
  }
};

export { getUser, getUserFavBooks };
