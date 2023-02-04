import { getGoogleBookByIsbn } from "../../api/googleAPI";
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
  CardActions,
  IconButton,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import GoogleIcon from "@mui/icons-material/Google";
import { bookFontStyle } from "../../styles/bookFontStyle";
import Button from "@mui/material/Button";
import SearchInput from "../common/SearchInput";

export default function ExternalSearch() {
  const img_url =
    "https://drupal.nypl.org/sites-drupal/default/files/blogs/J5LVHEL.jpg";

  const [isbn, setIsbn] = useState("");
  const [isBookLoading, setIsBookLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [bookResult, setBookResult] = useState({});

  const handleIsbnChange = (newVal) => {
    setIsbn(newVal);
  };

  const handleSearchClick = async () => {
    setIsNotFound(false);
    try {
      const result = await getGoogleBookByIsbn(isbn);
      let editedResult;
      if (result.length === 0) {
        editedResult = {
          isbn: "ISBN: xxxxxxxxxx",
          title: "Search your book",
          authors: ["xxxx"],
          yearPublished: "xxxx",
          categories: ["xxxx"],
        };
        setIsNotFound(true);
      } else {
        editedResult = result[0];
      }
      setBookResult(editedResult);
      setIsBookLoading(true);
    } catch (err) {
      return err;
    }
  };

  return (
    <>
      <Grid container spacing={2} ml={17} mt={0.5} mb={4}>
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
                <GoogleIcon ml={1} fontSize="small"></GoogleIcon>
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
              <Grid padding={2}>
                <Typography textAlign="center" color="#a6a69c" mb={2}>
                  Book Description
                </Typography>
                <Typography>{bookResult.description}</Typography>
              </Grid>
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
                    {bookResult.authors.length === 0 ? null : (
                      <Typography
                        component="h2"
                        sx={bookFontStyle}
                        fontSize={20}
                        fontStyle="italic"
                      >
                        by {bookResult.authors.join(" ")}
                      </Typography>
                    )}
                    {bookResult.yearPublished ? (
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        component="p"
                        sx={bookFontStyle}
                      >
                        Publihshed Date {bookResult.yearPublished}{" "}
                      </Typography>
                    ) : null}
                    {bookResult.categories.length === 0 ? null : (
                      <Typography
                        component="p"
                        sx={bookFontStyle}
                        variant="body1"
                      >
                        Categories: {bookResult.categories.join(" ")}
                      </Typography>
                    )}
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
                    <Typography
                      variant="body1"
                      component="p"
                      sx={bookFontStyle}
                    >
                      Categories xxxx
                    </Typography>
                  </CardContent>
                )}
                <CardActions disableSpacing>
                  {bookResult.preview_link ? (
                    <IconButton
                      aria-label="share"
                      onClick={(event) =>
                        window.open(bookResult.preview_link, "_blank")
                      }
                    >
                      <ShareIcon />
                    </IconButton>
                  ) : null}
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
