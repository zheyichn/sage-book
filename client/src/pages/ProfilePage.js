import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import ResponsiveAppBar from "../component/common/Header";
import BookGrid from "../component/common/BookGrid";
import { getUser, getUserFavBooks } from "../api/profileAPI";
import { useState, useEffect } from "react";

export default function ProfilePage(props) {
  const userName = sessionStorage.userName;
  const [user, setUser] = useState({});
  const [favBooks, setFavBooks] = useState([]);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isBooksLoaded, setIsBooksLoaded] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUser(userName);
      setUser(res[0]);
      setIsUserLoaded(true);
    };
    const fetchFavBooks = async () => {
      const res = await getUserFavBooks(userName);
      setFavBooks(res);
      setIsBooksLoaded(true);
    };
    fetchUser();
    fetchFavBooks();
  }, [userName]);

  return (
    <>
      <Stack mb={2}>
        <ResponsiveAppBar />
        {isUserLoaded && isBooksLoaded ? (
          <Grid container>
            <Grid item xs={3}>
              <Typography ml={12} mt={3} mb={2} variant="h5">
                Welcome, {user.user_name}!
              </Typography>
              <Box ml={5}>
                <Card
                  sx={{ minWidth: 275 }}
                  style={{ backgroundColor: "#85be0066" }}
                >
                  <CardContent>
                    <Typography ml={5}>User Name: {user.user_name}</Typography>
                    <Typography ml={5}>Age: {user.age}</Typography>
                    <Typography ml={5}>Gender: {user.gender}</Typography>
                    <Typography ml={5}>
                      Favorite Genre: {user.fav_genre}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            <Grid item xs={9}>
              <Typography ml={15} mt={3} variant="h5">
                My Favorite Books
              </Typography>
              {favBooks.length > 0 ? (
                <div>
                  <BookGrid books={favBooks} />
                </div>
              ) : (
                <div></div>
              )}
            </Grid>
          </Grid>
        ) : null}
      </Stack>
    </>
  );
}
