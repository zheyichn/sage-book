import React from "react";
import BookFrame from "./BookFrame";
import { Grid, Box, Pagination, Stack } from "@mui/material";
import { useState } from "react";
import usePagination from "./Pagination";

export default function BookGrid(props) {
  let [page, setPage] = useState(1);
  const PER_PAGE = 9;

  const count = Math.ceil(props.books.length / PER_PAGE);
  const _DATA = usePagination(props.books, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  return (
    <div>
      <Grid ml="8%" container flexDirection="row" alignContent="space-bwtween">
        {_DATA.currentData().map((book) => {
          return (
            <BookFrame
              isbn={book.isbn}
              title={book.title}
              year_published={book.yearPublished}
              img_url={book.imgUrl}
              author={book.author}
              preview_link={book.previewLink}
              key={book.isbn}
            ></BookFrame>
          );
        })}
        <Box margin="auto" mt={1} />
      </Grid>
      <Stack alignItems="center">
        <Pagination count={count} page={page} onChange={handleChange} />
      </Stack>
    </div>
  );
}
