import { Grid, Typography, Stack, Box, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import ResponsiveAppBar from "../component/common/Header";
import { fetchRecByGenre, fetchRecByBooks } from "../api/recommendAPI";
import CircularProgress from "@mui/material/CircularProgress";
import BookGrid from "../component/common/BookGrid";

export default function RecommendPage(props) {
  const [recByGenre, setRecByGenre] = useState([]);
  const [recByBooks, setRecByBooks] = useState([]);
  const [isGenreLoading, setIsGenreLoading] = useState(true);
  const [isBookLoading, setIsBookLoading] = useState(true);

  useEffect(() => {
    const fetchByGenre = async () => {
      const res = await fetchRecByGenre(sessionStorage.userName);
      setRecByGenre(res);
      setIsGenreLoading(false);
    };
    const fetchByBooks = async () => {
      const res = await fetchRecByBooks(sessionStorage.userName);
      setRecByBooks(res);
      setIsBookLoading(false);
    };

    fetchByGenre();
    fetchByBooks();
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
          RECOMMENDATION BY YOUR FAVORITE GENRE
        </Typography>
        {isGenreLoading ? (
          <Box margin="auto" mt={1}>
            <CircularProgress color="success" />
          </Box>
        ) : recByGenre.length > 0 ? (
          <BookGrid books={recByGenre}></BookGrid>
        ) : recByGenre.length > 0 ? (
          <Box margin="auto">
            <CircularProgress color="success" />
          </Box>
        ) : (
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            mt={1}
            mb={1}
          >
            <Alert
              variant="outlined"
              severity="info"
              style={{ width: "80vh", textAlign: "center" }}
            >
              You are very mysterious! We haven't found books for you, please
              visit our explore page!
            </Alert>
          </Grid>
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
          RECOMMENDATION BY YOUR SAVED BOOKS
        </Typography>

        {isBookLoading ? (
          <Box margin="auto" mt={1}>
            <CircularProgress color="success" />
          </Box>
        ) : recByBooks.length > 0 ? (
          <BookGrid books={recByBooks}></BookGrid>
        ) : recByBooks.length > 0 ? (
          <Box margin="auto" mt={1}>
            <CircularProgress color="success" />
          </Box>
        ) : (
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            mt={1}
            mb={1}
          >
            {" "}
            <Alert
              variant="outlined"
              severity="info"
              style={{ width: "80vh", textAlign: "center" }}
            >
              You are very mysterious! We haven't found books for you, please
              visit our explore page!
            </Alert>
          </Grid>
        )}
      </Stack>
    </>
  );
}
