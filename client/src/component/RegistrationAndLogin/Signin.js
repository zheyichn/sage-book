import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SageBookLogo from "../../photo/sageBookLogo.png";
import { loginAPI } from "../../api/registrationAndLoginAPI.js";
import { useState } from "react";
import { Alert } from "@mui/material";
// import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function SignInSide() {
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [errMsg, setErrorMsg] = useState("");

  // let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginUser = {
      userName: data.get("userName"),
      password: data.get("password"),
    };
    setFailure(false);
    setSuccess(false);
    setErrorMsg("");

    try {
      const res = await loginAPI(loginUser.userName, loginUser.password);
      if (!res) {
        setErrorMsg("Connection not found");
        setFailure(true);
        return;
      }
      if (res.status === 500) {
        setErrorMsg("User information not found");
        setFailure(true);
        return;
      }
      if (res.status !== 200) {
        setErrorMsg(res.data.message);
        setFailure(true);
        return;
      }
      setSuccess(true);
      const navigation = () => {
        window.location.pathname = "/explore";
      };
      setTimeout(navigation, 2000);
    } catch (e) {
      return e;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1457694587812-e8bf29a43845?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80)",
            //   "url(https://images.unsplash.com/photo-1589232779973-adb5ac21af62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
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
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="userName"
                label="User Name"
                name="userName"
                autoFocus
                color="success"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                color="success"
              />
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
                Sign In
              </Button>
              {success && (
                <Alert severity="success">Successfullly login. Welcome!</Alert>
              )}
              {failure && <Alert severity="error">{errMsg}</Alert>}
              <Grid container>
                <Grid item>
                  <Link href="/registration" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
