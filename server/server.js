const express = require("express");
const mysql = require("mysql");
var cors = require("cors");
const bcrypt = require("bcrypt");

const routes = require("./routes");
const config = require("./config.json");

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
// neede for parse req.body
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.json());

// root endpoint / route
app.get("/", (req, resp) => {
  resp.json({ message: "welcome to backend!" });
});

// 1. get and post user endpoint
app.get("/user", routes.getAllUsers);
app.post("/user", routes.addAUser);

// 2. get and put user by userName endpoint
app.put("/user/:userName", routes.modifyUserByUserName);

// 3. get user by userName endpoint
app.get("/user/:userName", routes.getUserByUserName);

// 4. get a book by isbn endpoint
app.get("/book/:isbn", routes.getABookByIsbn);

// 5. get books with search fitler endpoint
app.get("/books/search", routes.getBooksWithFilters);

// 9. get top-rated books
app.get("/explore/toprated", routes.getTopRatedBooks);

// 10. get top-rated books
app.get("/explore/newestrelease", routes.getNewestRelease);

// 11. user login endpoint
app.post("/login", routes.userLogin);

// 3.1 get user's favorite books
app.get("/favorites/:userName", routes.getFavBooksByUserName);

app.get("/book/:userName/:isbn", routes.getBookByUserNameAndIsbn);

// 3.2 user favorites a book
app.post("/favorite/:userName/:isbn", routes.favoriteABook);

// 3.3 user un-favorites a book
app.delete("/unfavorite/:userName/:isbn", routes.unFavoriteABook);

// 7. get average Amazon rating for a book
app.get("amzrating/:isbn", routes.getAvgAmzRatingByIsbn);

// 8. get average BX rating for a book
app.get("bxrating/:isbn", routes.getAvgBxRatingByIsbn);

// 13. get a list of books that surprises the user
app.get("/surprise/:userName", routes.getSurprisedBooksByUserName);

// 6. get reviews of a book
app.get("/review/:isbn", routes.getReviews);

// 12.1. get book recommendation by user's favorite genre
app.get("/recommend/genre/:userName", routes.getRecommendationByGenre);

// 12.2. get recommendation using users shared favorite books
app.get(
  "/recommend/sharedbooks/:userName",
  routes.getRecommendationBySharedBooks
);

// 14. get book details (isbn, title, yearPublished, publisher, description, previewLink, imgUrl, genre, author)
app.get("/detail/:isbn", routes.getBookDetails);

app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
