import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const pages = [
  "Profile",
  "Explore",
  "Search",
  "Recommend",
  "Surprise",
  "Detail",
];

const handleLogout = () => {
  sessionStorage.clear();
  window.location.pathname = "/";
};

function ResponsiveAppBar() {
  return (
    <AppBar position="static" style={{ background: "#c5d700" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/explore"
            sx={{
              mr: 5,
              display: { xs: "flex", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "#1c331f",
              textDecoration: "none",
            }}
          >
            SageBook
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                href={`/${page}`}
                key={page}
                sx={{
                  my: 2,
                  color: "#1c331f",
                  display: "block",
                  fontWeight: "bold",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <IconButton>
            <LogoutIcon onClick={handleLogout} />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
