import { Typography, Stack, Box } from "@mui/material";
import { useEffect, useState } from "react";
import ResponsiveAppBar from "../component/common/Header";
import { getSurprisedBooksByUserName } from "../api/surpriseAPI";
import CircularProgress from "@mui/material/CircularProgress";
import BookGrid from "../component/common/BookGrid";

export default function SurprisePage() {
  const [surprisedBooks, setSurprisedBooks] = useState([]);

  useEffect(() => {
    const fetchSurprisedBooks = async () => {
      const res = await getSurprisedBooksByUserName(sessionStorage.userName);
      setSurprisedBooks(res);
    };

    fetchSurprisedBooks();
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
          SURPRISED BOOKS
        </Typography>

        {surprisedBooks.length > 0 ? (
          <BookGrid books={surprisedBooks}></BookGrid>
        ) : (
          <Box margin="auto" mt={5}>
            <CircularProgress color="success" />
          </Box>
        )}
      </Stack>
    </>
  );
}
