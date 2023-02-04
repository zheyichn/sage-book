import { Typography, Stack, Box } from "@mui/material";
import { useEffect, useState } from "react";
import ResponsiveAppBar from "../component/common/Header";
import {
  fetchTopRatedBooks,
  fetchNewReleasedBooks,
} from "../api/exploreAndSearchAPI";
import CircularProgress from "@mui/material/CircularProgress";
import BookGrid from "../component/common/BookGrid";

export default function ExplorePage(props) {
  const [topBooks, setTopBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);

  useEffect(() => {
    const fetchTopBooks = async () => {
      const res = await fetchTopRatedBooks();
      setTopBooks(res);
    };
    const fetchNewBooks = async () => {
      const res = await fetchNewReleasedBooks();
      setNewBooks(res);
    };

    fetchTopBooks();
    fetchNewBooks();
  }, []);

  return (
    <>
      <Stack mb={2}>
        <ResponsiveAppBar />
        <Typography
          mt={2}
          sx={{
            fontSize: 18,
            textAlign: "center",
            fontFamily: "Fira Sans",
            backgroundColor: "#a6a69c",
            color: "#ffff",
          }}
        >
          TOP-RATED BOOKS
        </Typography>

        {topBooks.length > 0 ? (
          <BookGrid books={topBooks}></BookGrid>
        ) : (
          <Box margin="auto">
            <CircularProgress color="success" />
          </Box>
        )}

        <Typography
          mt={4}
          sx={{
            fontSize: 18,
            textAlign: "center",
            fontFamily: "Fira Sans",
            backgroundColor: "#a6a69c",
            color: "#ffff",
          }}
        >
          NEWLY RELEASED BOOKS
        </Typography>
        {newBooks.length > 0 ? (
          <BookGrid books={newBooks}></BookGrid>
        ) : (
          <Box margin="auto" mt={1}>
            <CircularProgress color="success" />
          </Box>
        )}
      </Stack>
    </>
  );
}
