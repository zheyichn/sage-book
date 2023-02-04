const config = require("./config.json");
const mysql = require("mysql");
const e = require("express");
// jwt & webtoken
require("dotenv").config();
const jwt = require("jsonwebtoken");

const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  port: config.aws_port,
  database: config.db,
});
connection.connect();
connection.query("use BOOKS");

// 1. get and post user endpoint
async function getAllUsers(req, res) {
  connection.query(`SELECT * FROM User`, function (error, results, fields) {
    if (error) {
      res.status(404).json({ error: error });
    } else if (results) {
      res.status(200).json({ data: results });
    }
  });
}

async function addAUser(req, res) {
  if (!req.body.userName) {
    res.status(404).json({
      message: "Missing user name",
    });
    return;
  }
  if (!req.body.age) {
    res.status(404).json({
      message: "Missing age",
    });
    return;
  }
  if (!req.body.gender) {
    res.status(404).json({
      message: "Missing gender",
    });
    return;
  }
  if (!["male", "female", "other"].includes(req.body.gender)) {
    res.status(404).json({
      message: "Gender not male, female or other",
    });
    return;
  }
  if (!req.body.password) {
    res.status(404).json({
      message: "Missing password",
    });
    return;
  }
  const ageInt = parseInt(req.body.age);
  // Note: set default fav_genre to "Other"
  connection.query(
    `INSERT INTO User (user_name, gender, age, password, fav_genre)
    VALUES (
      '${req.body.userName}', 
      '${req.body.gender}', 
      '${ageInt}', 
      '${req.body.password}',
      'Other')`,
    function (error, results, fields) {
      if (error) {
        res.status(404).json({ error: "Error posting user" });
      } else if (results) {
        res.status(200).json({ data: results });
      }
    }
  );
}

// 2. get and put user by userName
async function modifyUserByUserName(req, res) {
  if (!req.params.userName) {
    res
      .status(404)
      .json({ message: "Missing userName in modifyUserByUserName" });
    return;
  }
  // Note: only modify fav_genre
  connection.query(
    `UPDATE User
    SET fav_genre = (WITH User_genre AS(
    SELECT bt.genre
    FROM   Book AS b
           JOIN Belong_To AS bt
             ON b.isbn = bt.isbn
    WHERE  b.isbn IN (SELECT f.isbn
                      FROM   Favorite AS f
                      WHERE  f.user_name = '${req.params.userName}'))
    SELECT genre
    FROM User_genre
    GROUP BY genre
    ORDER BY COUNT(*) DESC
    LIMIT 1)
    WHERE user_name = '${req.params.userName}';`,
    function (error, results, fields) {
      if (error) {
        res.status(404).json({ error: "Error modifying user" });
      } else if (results) {
        res.status(200).json({ data: results });
      }
    }
  );
}

var getUserByName = function (userName) {
  return new Promise(function (resolve, reject) {
    connection.query(
      `SELECT * FROM User WHERE user_name = '${userName}'`,
      function (err, results, fields) {
        if (err) {
          return err;
        } else {
          return resolve(results);
        }
      }
    );
  });
};

// get and put user by userName endpoint
async function getUserByUserName(req, res) {
  if (!req.params.userName) {
    res.status(404).json({ message: "Missing userName in getUserByUserName" });
    return;
  }
  connection.query(
    `SELECT * FROM User WHERE user_name = '${req.params.userName}' `,
    function (error, results, fields) {
      if (error) {
        return null;
      } else if (results) {
        res.status(200).json({ results: results });
      }
    }
  );
}

async function userLogin(req, res) {
  // check that the username was sent
  if (!req.body.userName) {
    res.status(401).json({ message: "Missing username" });
    res.end();
    return;
  }
  // check that the password was sent
  if (!req.body.password) {
    res.status(401).json({ message: "Missing password" });
    res.end();
    return;
  }
  // fetch the user from backend...
  let result;

  try {
    result = await getUserByName(req.body.userName);
    result = JSON.parse(JSON.stringify(result))[0];

    if (result === null) {
      res.status(404).json({ message: "User not found!" });
      res.end();
      return;
    }
    // check we have the right password
    if (result.password !== req.body.password) {
      res.status(403).json({ message: "Incorrect password" });
      res.end();
      return;
    }

    const userName = req.body.userName;
    const user = { userName: userName };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRECT);
    res.json({ accessToken: accessToken });
    // res.status(200).json({ data: userObj });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
    res.end();
    return;
  }
}

// 3.1 get user's favorite books
async function getFavBooksByUserName(req, res) {
  if (!req.params.userName) {
    res
      .status(404)
      .json({ message: "Missing userName in getFavBooksByUserName" });
    return;
  }
  connection.query(
    `SELECT BD.isbn, title, year_published AS yearPublished, img_url AS imgUrl, authors AS author, preview_link AS previewLink
    FROM Favorite F
    JOIN Book_Details BD on BD.isbn = F.isbn
    WHERE user_name = '${req.params.userName}';`,
    function (error, results, fields) {
      if (error) {
        res.status(404).json({ error: "Error getting user by userName" });
      } else if (results) {
        res.status(200).json({ results: results });
      }
    }
  );
}

// 4. get a book by its ISBN
async function getABookByIsbn(req, res) {
  if (!req.params.isbn) {
    res
      .status(404)
      .json({ message: "missing isbn in path for geeting a book by isbn" });
    return;
  }
  connection.query(
    `SELECT Book.isbn AS isbn, title, year_published AS yearPublished, publisher, img_url AS imgUrl , preview_link AS previewLink, description, genre, author_name AS author, preview_link AS previewLink FROM
      Book LEFT JOIN Belong_To BT on Book.isbn = BT.isbn 
      LEFT JOIN Authored_By AB on Book.isbn = AB.isbn
      WHERE Book.isbn = '${req.params.isbn}'`,
    function (error, results, fields) {
      if (error) {
        res.json({ error: "Error getting book by isbn" });
      } else if (results) {
        res.status(200).json({ results: results });
      }
    }
  );
}

// 3.2 user favorites a book
async function favoriteABook(req, res) {
  if (!req.params.userName || !req.params.isbn) {
    res.status(404).json({
      message: "Missing userName or isbn in favoriteABook",
    });
    return;
  }
  connection.query(
    `INSERT INTO Favorite (user_name, isbn)
    VALUES (
      '${req.params.userName}', 
      '${req.params.isbn}')`,
    function (error, results, fields) {
      if (error) {
        res.status(404).json({ error: "Error adding a book to favorite" });
      } else if (results) {
        res.status(201).json({ results: results });
      }
    }
  );
}

// 3.3 user un-favorites a book
async function unFavoriteABook(req, res) {
  if (!req.params.userName || !req.params.isbn) {
    res.status(404).json({
      message: "Missing userName or isbn in favoriteABook",
    });
    return;
  }
  connection.query(
    `DELETE FROM Favorite WHERE user_name = '${req.params.userName}' AND isbn = '${req.params.isbn}'`,
    function (error, results, fields) {
      if (error) {
        res.status(404).json({ error: "Error deleting a book from favorite" });
      } else if (results) {
        res.status(200).json({ results: results });
      }
    }
  );
}

async function getBookByUserNameAndIsbn(req, res) {
  if (!req.params.userName || !req.params.isbn) {
    res.status(404).json({
      message: "Missing userName or isbn in getBookByUserNameAndIsbn",
    });
    return;
  }
  connection.query(
    `SELECT *
    FROM Favorite
    WHERE user_name = '${req.params.userName}' AND isbn = '${req.params.isbn}'`,
    function (error, results, fields) {
      if (error) {
        res.status(404).json({ error: "Error getting user by userName" });
      } else if (results) {
        res.status(200).json({ results: results });
      }
    }
  );
}

// 7. get average Amazon rating for a book
async function getAvgAmzRatingByIsbn(req, res) {
  if (!req.params.isbn) {
    res.status(404).json({
      message: "Missing isbn in getAvgAmzRating",
    });
    return;
  }
  connection.query(
    `WITH R AS (SELECT *
      FROM AMZN_Rating
      WHERE isbn = ${req.params.isbn} AND book_rating <> 0.0)
      SELECT isbn, AVG(book_rating) AS avg_rating
      FROM R
      GROUP BY isbn`,
    function (error, results, fields) {
      if (error) {
        res
          .status(404)
          .json({ error: "Error calculating avg rating in AMZN_Rating" });
      } else if (results) {
        res.status(200).json({ results: results });
      }
    }
  );
}

// 8. get average BX rating for a book
async function getAvgBxRatingByIsbn(req, res) {
  if (!req.params.isbn) {
    res.status(404).json({
      message: "Missing isbn in getAvgBxRating",
    });
    return;
  }
  connection.query(
    `WITH R AS (SELECT *
      FROM BX_Rating
      WHERE isbn = ${req.params.isbn} AND book_rating <> 0)
      
      SELECT isbn, AVG(book_rating) AS avg_rating
      FROM R
      GROUP BY isbn`,
    function (error, results, fields) {
      if (error) {
        res
          .status(404)
          .json({ error: "Error calculating avg rating in BX_Rating" });
      } else if (results) {
        res.status(200).json({ results: results });
      }
    }
  );
}

// 5. search books by filters optimized query (4-6s)
async function getBooksWithFilters(req, res) {
  // for filter input in format string, if it's empty string, take "%" as input value
  const titleMatch = req.query.title ? req.query.title : "%";
  const authorMatch = req.query.author ? req.query.author : "%";
  const publisherMatch = req.query.publisher ? req.query.publisher : "%";
  const genreMatch = req.query.genre ? req.query.genre : "%";

  const publicationYearStart = parseInt(req.query.publicationYearStart);

  const publicationYearEnd = parseInt(req.query.publicationYearEnd);

  const bxRatingLow = parseInt(req.query.bxRatingLow);
  const bxRatingHigh = parseInt(req.query.bxRatingHigh);

  const amznRatingLow = parseInt(req.query.amznRatingLow);
  const amznRatingHigh = parseInt(req.query.amznRatingHigh);

  if (
    publicationYearStart === 0 &&
    publicationYearEnd == 2022 &&
    bxRatingLow === 0 &&
    bxRatingHigh === 10 &&
    amznRatingLow === 0 &&
    amznRatingHigh === 5
  ) {
    // this block of code doesn't need to check for slider fiters(aka ratings and publication year
    // as user doesn't change the default setting,
    // meaning they don't care about ratings and publication year)
    connection.query(
      `
      SELECT isbn, title, year_published AS yearPublished, publisher, img_url AS imgUrl , description, book_genre AS genre, authors AS author, preview_link AS previewLink
      FROM Book_Details  
      WHERE title LIKE '%${titleMatch}%' 
      AND publisher LIKE '%${publisherMatch}%' 
      AND book_genre LIKE '%${genreMatch}%' 
      AND authors LIKE '%${authorMatch}%'
      ORDER BY title`,
      function (error, results, fields) {
        if (error) {
          res.json({ error: "Error getting searched released books" });
        } else if (results) {
          res.status(200).json({ results: results });
        }
      }
    );
  } else {
    if (publicationYearStart === 0 && publicationYearEnd == 2022) {
      connection.query(
        `
      SELECT isbn , title, year_published AS yearPublished, publisher, img_url AS imgUrl , description, book_genre AS genre, authors AS author, preview_link AS previewLink
      FROM Book_Details  
      WHERE title LIKE '%${titleMatch}%' 
      AND publisher LIKE '%${publisherMatch}%' 
      AND book_genre LIKE '%${genreMatch}%' 
      AND authors LIKE '%${authorMatch}%'
      AND BX_avg_rating >= ${bxRatingLow}
      AND BX_avg_rating <= ${bxRatingHigh}
      AND AMZN_avg_rating >= ${amznRatingLow}
      AND AMZN_avg_rating <= ${amznRatingHigh}
      ORDER BY title
      `,
        function (error, results, fields) {
          if (error) {
            res.json({ error: "Error getting searched books 2" });
          } else if (results) {
            res.status(200).json({ results: results });
          }
        }
      );
    } else {
      const newPublicationYearStart = Math.max(1, publicationYearStart);
      connection.query(
        `
      SELECT isbn , title, year_published AS yearPublished, publisher, img_url AS imgUrl , description, book_genre AS genre, authors AS author, preview_link AS previewLink
      FROM Book_Details  
      WHERE title LIKE '%${titleMatch}%' 
      AND publisher LIKE '%${publisherMatch}%' 
      AND book_genre LIKE '%${genreMatch}%' 
      AND authors LIKE '%${authorMatch}%'
      AND year_published >= ${newPublicationYearStart}
      AND year_published <= ${publicationYearEnd}
      AND BX_avg_rating >= ${bxRatingLow}
      AND BX_avg_rating <= ${bxRatingHigh}
      AND AMZN_avg_rating >= ${amznRatingLow}
      AND AMZN_avg_rating <= ${amznRatingHigh}
      ORDER BY title
      `,
        function (error, results, fields) {
          if (error) {
            res.json({ error: "Error getting searched books 3" });
          } else if (results) {
            res.status(200).json({ results: results });
          }
        }
      );
    }
  }
}

// 9. get top-rated books for explore page
async function getTopRatedBooks(req, res) {
  const originalQuery = `WITH amzn_top AS
  (
            SELECT    book.isbn,
                      img_url AS imgUrl,
                      title,
                      author_name AS author
            FROM      (book
            JOIN      amzn_rating
            ON        book.isbn = amzn_rating.isbn)
            LEFT JOIN authored_by AB
            ON        book.isbn = ab.isbn
            ORDER BY  book_rating DESC limit 3 ), bx_top AS
  (
            SELECT    book.isbn,
                      img_url AS imgUrl,
                      title,
                      author_name AS author
            FROM      (book
            JOIN      bx_rating
            ON        book.isbn = bx_rating.isbn)
            LEFT JOIN authored_by AB
            ON        book.isbn = ab.isbn
            ORDER BY  book_rating DESC limit 5 )
  (
         SELECT *
         FROM   amzn_top)
  UNION
   (
         SELECT *
         FROM   bx_top);`;
  // old query takes 6s while optimized query below takes 698ms
  // in where condition, we remove tuples whose img_url is not available as we definitely want to display
  // book cover for books appear on the explore page
  // topRated is measured by average rating
  // 5 books from the BX recommendation dataset
  // 5 books from the Amazon books dataset
  connection.query(
    `WITH topRatedBooks AS(
      SELECT isbn, title, year_published as yearPublished, img_url AS imgUrl, authors as author, preview_link AS previewLink
      FROM Book_Details
      WHERE img_url != 'Unknown'
      order by BX_avg_rating DESC
      limit 5),
      topRatedAmzBooks AS(
      SELECT isbn, title, year_published as yearPublished, img_url AS imgUrl, authors as author, preview_link AS previewLink
      FROM Book_Details
      WHERE  img_url != 'Unknown'
      order by AMZN_avg_rating DESC
      limit 4)
      
      SELECT * FROM topRatedBooks
      UNION
      SELECT * FROM topRatedAmzBooks;`,
    function (error, results) {
      if (error) {
        res.json({ error: "Error getting topRated books" });
      } else if (results) {
        res.status(200).json({ results: results });
      }
    }
  );
}

// 13. get a list of books that surprises the user
async function getSurprisedBooksByUserName(req, res) {
  if (!req.params.userName) {
    res.status(404).json({ message: "Missing userName in getSurprisedBooks" });
    return;
  }
  connection.query(
    `SELECT BD.isbn, BD.img_url AS imgUrl, BD.title, BD.year_published AS yearPublished, BD.authors AS author, BD.preview_link AS previewLink, BD.publisher
    FROM Book_Details BD
    WHERE BD.book_genre <>'Unknown'
      AND BD.book_genre NOT IN (
        SELECT genre
        FROM   Belong_To Bt
        JOIN   Favorite F ON F.isbn = Bt.isbn
        WHERE  F.user_name = '${req.params.userName}'
        )
      AND BD.authors NOT IN (
        SELECT author_name
        FROM   Authored_By Ab
        JOIN   Favorite F ON F.isbn = Ab.isbn
        WHERE  F.user_name = '${req.params.userName}'
        )
    ORDER BY BD.AMZN_avg_rating DESC, BD.BX_avg_rating DESC
    LIMIT 100;`,
    function (error, results, fields) {
      if (error) {
        res.status(404).json({
          error: "Error getting surprised books by getSurprisedBooks",
        });
      } else if (results) {
        res.status(200).json({ results: results });
      }
    }
  );
}

// 10. get latest realeased books
async function getNewestRelease(req, res) {
  const originalQuery = `SELECT Book.isbn, title, img_url AS imgUrl, year_published as yearPublished, author_name AS author, preview_link AS previewLink
  FROM  Book JOIN Authored_By AB on Book.isbn = AB.isbn
  WHERE img_url != 'Unknown'
  ORDER BY year_published DESC
  LIMIT 9;`;
  // old query takes 17s, join takes a lot of time
  // optimized query takes 2s 12ms
  connection.query(
    `SELECT  isbn, title, img_url AS imgUrl, year_published as yearPublished, authors AS author, preview_link AS previewLink
      FROM   Book_Details
      WHERE img_url IS NOT NULL
      ORDER BY year_published DESC
      LIMIT 9;`,
    function (error, results, fields) {
      if (error) {
        res.json({ error: "Error getting latest released books" });
      } else if (results) {
        res.status(200).json({ results: results });
      }
    }
  );
}

// 6. get reviews of a book
async function getReviews(req, res) {
  if (!req.params.isbn) {
    res.status(404).json({ message: "Missing book isbn in getReviews" });
    return;
  }

  connection.query(
    `
      SELECT user_id AS userId, text AS review 
      FROM Review
      WHERE isbn = '${req.params.isbn}'
  `,
    function (error, results, fields) {
      if (error) {
        res.json({ error: "Error getting reviews by book isbn" });
      } else if (results) {
        res.status(200).json({ results: results });
      }
    }
  );
}

// 12.1. get book recommendation by user's favorite genre
async function getRecommendationByGenre(req, res) {
  if (!req.params.userName) {
    res
      .status(404)
      .json({ message: "Missing userName in getRecommendationByGenre" });
    return;
  }
  connection.query(
    `
    WITH same_fav_genre AS (
      SELECT u1.user_name
      FROM User AS u1
      WHERE u1.user_name != '${req.params.userName}'
      AND u1.fav_genre IN(
          SELECT u.fav_genre
          FROM   User AS u
          WHERE  u.user_name = '${req.params.userName}')
  )
  SELECT f.isbn, bo.title, bo.year_published AS yearPublished, bo.img_url AS imgUrl, bo.description, bo.authors AS author
  FROM     same_fav_genre AS s
  JOIN     Favorite       AS f
  ON       s.user_name = f.user_name
  JOIN     Book_Details AS bo
  ON       bo.isbn = f.isbn
  GROUP BY f.isbn
  ORDER BY Count(*) DESC limit 10;
  `,
    function (error, results, fields) {
      if (error) {
        res.json({
          error:
            "Error getting book recommendation in getRecommendationByGenre",
        });
      } else if (results) {
        res.status(200).json({ results: results });
      }
    }
  );
}

// 12.2. get recommendation using users shared favorite books
async function getRecommendationBySharedBooks(req, res) {
  if (!req.params.userName) {
    res
      .status(404)
      .json({ message: "Missing userName in getRecommendationBySharedBooks" });
    return;
  }
  connection.query(
    `
    With same_books As (
      SELECT F.isbn, user_name, COUNT(isbn) AS num_books
      FROM   Favorite F
      WHERE  F.isbn IN (
          SELECT isbn
          FROM   Favorite F
          WHERE  user_name = '${req.params.userName}')
      AND user_name <> '${req.params.userName}'
      GROUP BY user_name
      ORDER BY num_books DESC
      ),
  recommend_books AS (
      SELECT F.isbn
      FROM   same_books Sb
      JOIN   Favorite F
      ON     Sb.user_name = F.user_name
      WHERE F.isbn NOT IN (
          SELECT same_books.isbn
          FROM   same_books)
      )
  SELECT BD.isbn, BD.img_url AS imgUrl, BD.title, BD.year_published AS yearPublished, 
         BD.authors AS author, BD.preview_link AS previewLink, BD.publisher
  FROM   Book_Details BD
  JOIN   recommend_books Rb ON BD.isbn = Rb.isbn
  LIMIT 10;
  `,
    function (error, results, fields) {
      if (error) {
        res.json({
          error:
            "Error getting book recommendation in getRecommendationBySharedBooks",
        });
      } else if (results) {
        res.status(200).json({ results: results });
      }
    }
  );
}

// 14. get book details (isbn, title, yearPublished, publisher, description, previewLink,
// imgUrl, genre, author)
async function getBookDetails(req, res) {
  if (!req.params.isbn) {
    res.status(404).json({ message: "Missing book isbn in getBookDetails" });
    return;
  }

  connection.query(
    `
      SELECT isbn, title, authors, book_genre AS genre, 
            year_published AS yearPublished, publisher, img_url AS imgUrl,
            preview_link AS previewLink, description
      FROM Book_Details BD
      WHERE BD.isbn = '${req.params.isbn}'
  `,
    function (error, results, fields) {
      if (error) {
        res.json({ error: "Error getting book details by book isbn" });
      } else if (results) {
        res.status(200).json({ results: results });
      }
    }
  );
}

module.exports = {
  getAllUsers,
  addAUser,
  userLogin,
  modifyUserByUserName,
  getReviews,
  getRecommendationByGenre,
  getRecommendationBySharedBooks,
  getBookDetails,
  getFavBooksByUserName,
  favoriteABook,
  unFavoriteABook,
  getAvgAmzRatingByIsbn,
  getAvgBxRatingByIsbn,
  getSurprisedBooksByUserName,
  getABookByIsbn,
  getTopRatedBooks,
  getNewestRelease,
  getBooksWithFilters,
  getUserByUserName,
  getBookByUserNameAndIsbn,
};
