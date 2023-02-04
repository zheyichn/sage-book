import React from "react";
import { Typography, CardContent, CardMedia, Grid } from "@mui/material";
import { bookFontStyle } from "../../styles/bookFontStyle";
import Button from "@mui/material/Button";
import SearchInput from "../../component/common/SearchInput";

export default function Detail() {
  const img_url =
    "https://drupal.nypl.org/sites-drupal/default/files/blogs/J5LVHEL.jpg";
  const isbn = "B000GQG7D2";
  const title = "Book Example";
  const year_published = 2022;
  const author = "sample author";

  return (
    <Grid container justifyContent="space-around" alignItems="center">
      <Grid container width="30%" alignItems="center">
        <Grid item ml={10}>
          <SearchInput inputLabel="ISBN" />
        </Grid>
        <Grid item ml={5}>
          <Button color="success" variant="contained">
            {" "}
            search
          </Button>
        </Grid>
      </Grid>

      <Grid
        item
        container
        borderRadius={2}
        borderColor="#EFF5F5"
        boxShadow={4}
        m={2}
        mr={10}
        width="30%"
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
                Publihsed in {year_published}{" "}
              </Typography>
            ) : null}
          </CardContent>
        </Grid>
      </Grid>
    </Grid>
  );
}
