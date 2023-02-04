import axios from "axios";
import config from "./config.json";

// API to get book by userName and ISBN
const getBookByUserNameAndIsbn = async (userName, isbn) => {
  const url = `http://${config.server_host}:${config.server_port}/book/${userName}/${isbn}`;
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (e) {
    return e;
  }
};

// API to favorite a book
const favoriteABook = async (userName, isbn) => {
  const url = `http://${config.server_host}:${config.server_port}/favorite/${userName}/${isbn}`;
  try {
    const response = await axios.post(url);
    return response.data.results;
  } catch (e) {
    return e;
  }
};

// API to favorite a book
const UnFavoriteABook = async (userName, isbn) => {
  const url = `http://${config.server_host}:${config.server_port}/unfavorite/${userName}/${isbn}`;
  try {
    const response = await axios.delete(url);
    return response.data.results;
  } catch (e) {
    return e;
  }
};

export { getBookByUserNameAndIsbn, favoriteABook, UnFavoriteABook };
