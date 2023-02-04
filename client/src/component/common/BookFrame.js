import React from "react";
import {
  Typography,
  CardContent,
  CardMedia,
  Grid,
  CardActions,
  IconButton,
} from "@mui/material";
import { bookFontStyle } from "../../styles/bookFontStyle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import { useState, useEffect } from "react";
import {
  getBookByUserNameAndIsbn,
  favoriteABook,
  UnFavoriteABook,
} from "../../api/booframeAPI";
import { modifyUserAPI } from "../../api/registrationAndLoginAPI";

export default function BookFrame(props) {
  const { isbn, title, year_published, img_url, author, preview_link } = props;
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const fetchBookByUserNameAndIsbn = async () => {
      const res = await getBookByUserNameAndIsbn(sessionStorage.userName, isbn);
      setIsFav(res.length > 0);
    };
    fetchBookByUserNameAndIsbn();
  }, [isbn]);

  const handleUnfavClick = async () => {
    setIsFav(false);
    await UnFavoriteABook(sessionStorage.userName, isbn);
    await modifyUserAPI(sessionStorage.userName);
  };

  const handleFavClick = async () => {
    setIsFav(true);
    await favoriteABook(sessionStorage.userName, isbn);
    await modifyUserAPI(sessionStorage.userName);
  };

  return (
    <Grid
      item
      container
      width="25%"
      borderRadius={2}
      borderColor="#EFF5F5"
      boxShadow={4}
      m={2}
    >
      <Grid width="100%">
        <CardMedia
          pb={0}
          image={img_url}
          component="img"
          sx={{ objectFit: "contain" }}
          height="200px"
          width="100%"
          onError={(e) =>
            (e.target.src =
              "https://drupal.nypl.org/sites-drupal/default/files/blogs/J5LVHEL.jpg")
          }
        />
        <CardContent mt={0} pb={0} width="100%">
          {isbn ? (
            <Typography component="h1" sx={bookFontStyle}>
              ISBN {isbn}
            </Typography>
          ) : null}
          {title ? (
            <Typography component="h1" sx={bookFontStyle} fontSize={22}>
              {title}
            </Typography>
          ) : null}
          {author ? (
            <Typography
              component="h2"
              sx={bookFontStyle}
              fontSize={20}
              fontStyle="italic"
            >
              by {author}
            </Typography>
          ) : null}
          {year_published ? (
            <Typography
              variant="body1"
              color="textSecondary"
              component="p"
              sx={bookFontStyle}
            >
              Published in {year_published}{" "}
            </Typography>
          ) : null}
        </CardContent>
      </Grid>
      <Grid item alignSelf="flex-end">
        <CardActions disableSpacing>
          {isFav ? (
            <IconButton
              aria-label="favorite border icon"
              onClick={handleUnfavClick}
            >
              <FavoriteIcon />
            </IconButton>
          ) : (
            <IconButton aria-label="favorite icon" onClick={handleFavClick}>
              <FavoriteBorderIcon />
            </IconButton>
          )}
          {preview_link !== "Unknown" ? (
            <IconButton
              aria-label="share"
              onClick={(event) => window.open(preview_link, "_blank")}
            >
              <ShareIcon />
            </IconButton>
          ) : null}
        </CardActions>
      </Grid>
    </Grid>
  );
}
