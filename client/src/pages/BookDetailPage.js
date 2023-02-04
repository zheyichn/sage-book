import Header from "../component/common/Header";
import ReviewTable from "../component/bookdetail/table";
import { fetchBookDetail, fetchBookReviews } from "../api/bookdetailAPI";
import { useState } from "react";
import React from "react";
import {
  Typography,
  CardContent,
  CardMedia,
  Grid,
  Card,
  Box,
  Alert,
  Divider,
} from "@mui/material";
import { bookFontStyle } from "../styles/bookFontStyle";
import Button from "@mui/material/Button";
import SearchInput from "../component/common/SearchInput";
import ExternalSearch from "../component/search/ExternalSearch";

export default function BookDetailPage(props) {
  const img_url =
    "https://drupal.nypl.org/sites-drupal/default/files/blogs/J5LVHEL.jpg";

  const [bookInput, setBook] = useState("");
  const [isBookLoading, setIsBookLoading] = useState(false);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [review, setReview] = useState([]);
  const [isNotFound, setIsNotFound] = useState(false);

  const [bookResult, setBookResult] = useState({});

  const handleIsbnChange = (newVal) => {
    setBook(newVal);
  };

  const handleSearchClick = async () => {
    setIsNotFound(false);
    try {
      const result = await fetchBookDetail(bookInput);
      let editedResult;
      if (result.length === 0) {
        editedResult = {
          isbn: "ISBN: xxxxxxxxxx",
          title: "Search your book",
          authors: "xxxx",
          year_published: "year xxxx",
        };
        setIsNotFound(true);
      } else {
        editedResult = result[0];
      }

      const bookReview = await fetchBookReviews(bookInput);
      setBookResult(editedResult);
      setReview(bookReview);
      setIsBookLoading(true);
      setIsReviewLoading(true);
    } catch (err) {
      return err;
    }
  };

  return (
    <>
      <Header />

      <Grid container spacing={2} ml={17} mt={0.5} mb={1}>
        <Grid item xs={6}>
          <Grid container mt={2}>
            <Grid item>
              <SearchInput inputLabel="ISBN" saveText={handleIsbnChange} />
            </Grid>
            <Grid item ml={5} mt={1}>
              <Button
                color="success"
                variant="contained"
                onClick={handleSearchClick}
              >
                {" "}
                search
              </Button>
            </Grid>
          </Grid>

          {isNotFound ? (
            <Box mt={3}>
              <Alert severity="error" style={{ width: "22vh" }}>
                Book not found
              </Alert>
            </Box>
          ) : null}

          <Box
            mt={5}
            style={{ height: "33vh", width: "80vh", overflow: "auto" }}
            borderRadius={2}
            border={2}
            borderColor="#a6a69c"
          >
            {isBookLoading ? (
              bookResult.description !== "Unknown" ? (
                <Grid padding={2}>
                  <Typography textAlign="center" color="#a6a69c" mb={2}>
                    Book Description
                  </Typography>
                  <Typography>{bookResult.description}</Typography>
                </Grid>
              ) : null
            ) : (
              <Typography color="#a6a69c" textAlign="center">
                Description of searched book goes here...
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Grid
            item
            container
            borderRadius={2}
            borderColor="#EFF5F5"
            boxShadow={4}
            m={2}
            mr={10}
            mt={7}
            width="50%"
          >
            <Grid width="100%">
              <Card>
                <CardMedia
                  pb={0}
                  image={
                    isBookLoading && bookResult.imgUrl
                      ? bookResult.imgUrl
                      : img_url
                  }
                  component="img"
                  sx={{ objectFit: "contain" }}
                  height="200px"
                  width="100%"
                  onError={(e) =>
                    (e.target.src =
                      "https://drupal.nypl.org/sites-drupal/default/files/blogs/J5LVHEL.jpg")
                  }
                />
                {isBookLoading ? (
                  <CardContent mt={0} pb={0} width="100%">
                    {bookResult.isbn ? (
                      <Typography component="h1" sx={bookFontStyle}>
                        ISBN {bookResult.isbn}
                      </Typography>
                    ) : null}
                    {bookResult.title ? (
                      <Typography
                        component="h1"
                        sx={bookFontStyle}
                        fontSize={22}
                      >
                        {bookResult.title}
                      </Typography>
                    ) : null}
                    {bookResult.authors ? (
                      <Typography
                        component="h2"
                        sx={bookFontStyle}
                        fontSize={20}
                        fontStyle="italic"
                      >
                        by {bookResult.authors}
                      </Typography>
                    ) : null}
                    {bookResult.year_published ? (
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        component="p"
                        sx={bookFontStyle}
                      >
                        Publihsed in {bookResult.year_published}{" "}
                      </Typography>
                    ) : null}
                  </CardContent>
                ) : (
                  <CardContent mt={0} pb={0} width="100%">
                    <Typography component="h1" sx={bookFontStyle}>
                      ISBN: xxxxxxxxxx
                    </Typography>

                    <Typography component="h1" sx={bookFontStyle} fontSize={22}>
                      Search your book
                    </Typography>

                    <Typography
                      component="h2"
                      sx={bookFontStyle}
                      fontSize={20}
                      fontStyle="italic"
                    >
                      by xxxx
                    </Typography>

                    <Typography
                      variant="body1"
                      color="textSecondary"
                      component="p"
                      sx={bookFontStyle}
                    >
                      Publihsed in year xxxx{" "}
                    </Typography>
                  </CardContent>
                )}
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container mb={3}>
        {isReviewLoading ? (
          <Box
            ml={19}
            mr={20}
            mt={2}
            style={{ maxHeight: "50vh", minWidth: "76.5%", overflow: "auto" }}
          >
            <ReviewTable rows={review} />
          </Box>
        ) : null}
      </Grid>

      <Divider>
        <Typography fontStyle="italic" color="#a6a69c">
          Book not found in our dataset? Try the search bar below which wraps
          around Google Books APIs
        </Typography>
      </Divider>
      <ExternalSearch></ExternalSearch>
    </>
  );
}
