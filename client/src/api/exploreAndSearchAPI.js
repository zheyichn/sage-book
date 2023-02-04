import axios from "axios";
import config from "./config.json";

export async function fetchTopRatedBooks() {
  const url = `http://${config.server_host}:${config.server_port}/explore/toprated`;
  try {
    const res = await axios.get(url);
    return res.data.results;
  } catch (e) {
    return e;
  }
}

export async function fetchNewReleasedBooks() {
  const url = `http://${config.server_host}:${config.server_port}/explore/newestrelease`;
  try {
    const res = await axios.get(url);
    return res.data.results;
  } catch (e) {
    return e;
  }
}

export async function searchBooks(
  authorInput,
  titleInput,
  genreInput,
  publisherInput,
  publishYearStart,
  publishYearEnd,
  bxRatingLow,
  bxRatingHigh,
  amznRatingLow,
  amznRatingHigh
) {
  const url = `http://${config.server_host}:${config.server_port}/books/search`;
  try {
    const params = {
      author: authorInput,
      title: titleInput,
      genre: genreInput,
      publisher: publisherInput,
      publicationYearStart: publishYearStart,
      publicationYearEnd: publishYearEnd,
      bxRatingLow: bxRatingLow,
      bxRatingHigh: bxRatingHigh,
      amznRatingLow: amznRatingLow,
      amznRatingHigh: amznRatingHigh,
    };
    const res = await axios.get(url, { params });
    return res.data.results;
  } catch (e) {
    return e;
  }
}
