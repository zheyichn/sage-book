import axios from "axios";
const getGoogleBookByIsbn = async (isbn) => {
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
  try {
    const response = await axios.get(url);
    const resObj = response.data;
    if (resObj.totalItems === 0) {
      return [];
    } else {
      const book = resObj["items"][0];
      const title = book.volumeInfo.title;
      const authors = book.volumeInfo.authors ? book.volumeInfo.authors : []; // a list
      const yearPublished = book.volumeInfo.publishedDate
        ? book.volumeInfo.publishedDate
        : "";
      const description = book.volumeInfo.description
        ? book.volumeInfo.description
        : "No Description About This Book Was Found.";
      const imgUrl = book.volumeInfo.imageLinks.thumbnail
        ? book.volumeInfo.imageLinks.thumbnail
        : "";
      const preview_link = book.volumeInfo.previewLink
        ? book.volumeInfo.previewLink
        : "";
      const categories = book.volumeInfo.categories
        ? book.volumeInfo.categories
        : []; // a list
      const res = {
        isbn: isbn,
        title,
        authors,
        yearPublished,
        description,
        imgUrl,
        preview_link,
        categories,
      };
      return [res];
    }
  } catch (e) {
    return e;
  }
};

export { getGoogleBookByIsbn };
