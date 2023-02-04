import axios from "axios";
import config from "./config.json";

// API to create a user
const createUserAPI = async (userObject) => {
  const url = `http://${config.server_host}:${config.server_port}/user`;
  try {
    const response = await axios.post(url, userObject);
    return response.data;
  } catch (e) {
    return e;
  }
};

const modifyUserAPI = async (userName) => {
  const url = `http://${config.server_host}:${config.server_port}/user/${userName}`;
  try {
    const response = await axios.put(url);
    return response.data.data;
  } catch (e) {
    return e;
  }
};

const loginAPI = async (userName, password) => {
  try {
    const url = `http://${config.server_host}:${config.server_port}/login`;
    const response = await axios.post(
      url,
      `userName=${userName}&password=${password}`
    );
    sessionStorage.setItem("userName", userName);
    sessionStorage.setItem("accessToken", response.data.accessToken);
    return response;
  } catch (e) {
    return e;
  }
};

export { createUserAPI, loginAPI, modifyUserAPI };
