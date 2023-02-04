import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SageBookLogo from "../../photo/sageBookLogo.png";
import { createUserAPI } from "../../api/registrationAndLoginAPI.js";
import { useState } from "react";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  typography: {
    fontFamily: "sans-serif",
  },
});

export default function SignUp() {
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [errMsg, setErrorMsg] = useState("");

  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get("userName")) {
      setErrorMsg("Missing username");
      setFailure(true);
      return;
    }
    if (data.get("userName").length > 10) {
      setErrorMsg("UserName cannot exceed 10 characters");
      setFailure(true);
      return;
    }
    if (!data.get("password")) {
      setErrorMsg("Missing password");
      setFailure(true);
      return;
    }
    if (data.get("password").length > 10) {
      setErrorMsg("Password cannot exceed 10 characters");
      setFailure(true);
      return;
    }
    if (!data.get("age")) {
      setErrorMsg("Missing age");
      setFailure(true);
      return;
    }
    if (!data.get("gender")) {
      setErrorMsg("Missing gender");
      setFailure(true);
      return;
    }
    if (!["male", "female", "other"].includes(data.get("gender"))) {
      setErrorMsg("Please choose gender from male, female or other");
      setFailure(true);
      return;
    }
    if (data.get("age") < 0 || data.get("age") > 100) {
      setErrorMsg("Please enter a valid age");
      setFailure(true);
      return;
    }

    const newUser = {
      userName: data.get("userName"),
      password: data.get("password"),
      age: data.get("age"),
      gender: data.get("gender"),
    };
    setFailure(false);
    setSuccess(false);
    setErrorMsg("");
    try {
      const res = await createUserAPI(newUser);
      if (!res || res.status === 404) {
        setErrorMsg(
          "User already exist. Please login or choose another username."
        );
        setFailure(true);
        return;
      }
      setSuccess(true);
      const navigation = () => {
        navigate("/");
      };
      setTimeout(navigation, 3000);
    } catch (e) {
      return e;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            sx={{
              marginBottom: 4,
            }}
            src={SageBookLogo}
            alt="SageBook Logo"
          />
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontFamily: "sans-serif" }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="userName"
                  required
                  fullWidth
                  id="userName"
                  label="User Name"
                  helperText="User Name cannot exceed 10 characters."
                  autoFocus
                  color="success"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  color="success"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  name="age"
                  label="Age"
                  type="age"
                  id="age"
                  color="success"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  name="gender"
                  label="Gender"
                  type="gender"
                  id="gender"
                  helperText="Input male, female or other"
                  color="success"
                />
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#85be00",
                ":hover": {
                  bgcolor: "#1c331f",
                },
              }}
            >
              Sign Up
            </Button>
            {success && (
              <Alert severity="success">
                Successfullly sign Up. Redirecting to login page...
              </Alert>
            )}
            {failure && <Alert severity="error">{errMsg}</Alert>}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
