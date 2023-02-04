import axios from "axios";
import config from "./config.json";

// books detail
const fetchBookDetail = async (isbn) => {
  const url = `http://${config.server_host}:${config.server_port}/detail/${isbn}`;
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (e) {
    return e;
  }
};

// reviews
const fetchBookReviews = async (isbn) => {
  const url = `http://${config.server_host}:${config.server_port}/review/${isbn}`;
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (e) {
    return e;
  }
};

export { fetchBookDetail, fetchBookReviews };
