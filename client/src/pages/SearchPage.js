import {
  Grid,
  Typography,
  Stack,
  Button,
  Divider,
  LinearProgress,
} from "@mui/material";
import { useState } from "react";
import { searchBooks } from "../api/exploreAndSearchAPI";
import BookGrid from "../component/common/BookGrid";
import ResponsiveAppBar from "../component/common/Header";
import SearchInput from "../component/common/SearchInput";
import AmznRatingSlider from "../component/search/AmznRatingSlider";
import BxRatingSlider from "../component/search/BxRatingSlider";
import RangeSlider from "../component/search/YearRangeSlider";

export default function SearchPage() {
  const [authorInput, setAuthorInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [publisherInput, setPublisherInput] = useState("");
  const [publishYearInput, setPublishYearInput] = useState([0, 2022]);
  const [bxRatingInput, setBxRatingInput] = useState([0, 10]);
  const [amznRatingInput, setAmznRatingInput] = useState([0, 5]);
  const [bookList, setBookList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthorChange = (newVal) => {
    setAuthorInput(newVal);
  };

  const handleTitleChange = (newVal) => {
    setTitleInput(newVal);
  };
  const handleGenreChange = (newVal) => {
    setGenreInput(newVal);
  };

  const handlePublisherChange = (newVal) => {
    setPublisherInput(newVal);
  };

  const handlePublishYearChange = (newVal) => {
    setPublishYearInput(newVal);
  };

  const handleBxRatingChange = (newVal) => {
    setBxRatingInput(newVal);
  };

  const handleAmznRatingChange = (newVal) => {
    setAmznRatingInput(newVal);
  };

  const handleSearchClick = async () => {
    setIsLoading(true);
    try {
      const books = await searchBooks(
        authorInput,
        titleInput,
        genreInput,
        publisherInput,
        publishYearInput[0],
        publishYearInput[1],
        bxRatingInput[0],
        bxRatingInput[1],
        amznRatingInput[0],
        amznRatingInput[1]
      );
      setBookList(books);
      setIsLoading(false);
    } catch (err) {
      return err;
    }
  };

  return (
    <Stack mb={5}>
      <ResponsiveAppBar />
      <Grid container id="searchArea" justifyContent="center">
        <Grid container item justifyContent="space-between" m={2} width="80%">
          <Grid item mt={1}>
            <SearchInput inputLabel="Book Title" saveText={handleTitleChange} />
          </Grid>
          <Grid item mt={1}>
            <SearchInput
              inputLabel="Book Author"
              saveText={handleAuthorChange}
            />
          </Grid>
          <Grid item mt={1}>
            <SearchInput inputLabel="Book Genre" saveText={handleGenreChange} />
          </Grid>
          <Grid item mt={1}>
            <SearchInput
              inputLabel="Book Publisher"
              saveText={handlePublisherChange}
            />
          </Grid>
        </Grid>
        <Grid
          container
          item
          justifyContent="space-between"
          m={1}
          width="80%"
          direction="row"
        >
          <Grid item mt={1}>
            <RangeSlider saveYear={handlePublishYearChange}></RangeSlider>
          </Grid>
          <Grid item mt={1}>
            <BxRatingSlider
              saveBxRating={handleBxRatingChange}
            ></BxRatingSlider>
          </Grid>
          <Grid item mt={1}>
            <AmznRatingSlider
              saveAmznRating={handleAmznRatingChange}
            ></AmznRatingSlider>
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" width="80%">
          <Grid item mr={2} mt={2} mb={4}>
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
      </Grid>
      <Divider mb={3}></Divider>
      {isLoading ? (
        <Grid
          item
          width="60%"
          alignSelf="center"
          mt={2}
          fontStyle="italic"
          color="#a6a69c"
        >
          <Typography textAlign="center" mb={1}>
            Searching
          </Typography>
          <LinearProgress color="success" />
        </Grid>
      ) : (
        <Grid mt={4}>
          <BookGrid books={bookList}></BookGrid>
        </Grid>
      )}
    </Stack>
  );
}
