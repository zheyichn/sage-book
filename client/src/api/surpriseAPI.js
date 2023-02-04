import axios from "axios";
import config from "./config.json";

// API surprised books by userName
const getSurprisedBooksByUserName = async (userName) => {
  const url = `http://${config.server_host}:${config.server_port}/surprise/${userName}`;
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (e) {
    return e;
  }
};

export { getSurprisedBooksByUserName };
