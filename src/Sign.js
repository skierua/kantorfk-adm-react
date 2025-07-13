import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { publish } from "./events";

function Copyright(props) {
  return (
    <Typography
      component="div"
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      {/* <Link color="inherit" href="https://kantorfk.com/">
        kantorfk.com
      </Link>{" "} */}
      {new Date().getFullYear()}.
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

// const defaultTheme = createTheme();

export function Sign() {
  function generateBrowserSalt(lengthBytes = 16, encoding = "base64") {
    if (!window.crypto || !window.crypto.getRandomValues) {
      console.error(
        "Web Crypto API not available. Cannot generate secure salt."
      );
      return null;
    }

    const saltArray = new Uint8Array(lengthBytes);
    window.crypto.getRandomValues(saltArray);

    if (encoding === "hex") {
      return Array.from(saltArray)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } else if (encoding === "base64") {
      // Converting Uint8Array to Base64 in browser requires some manipulation
      // or using TextEncoder/btoa for ASCII string conversion.
      // For general binary data, a more robust way is DataView or custom logic.
      // Here's a common trick using btoa for simplicity (works for most byte ranges)
      return btoa(String.fromCharCode.apply(null, saltArray));
    } else {
      // console.warn("Unsupported encoding. Returning raw Uint8Array.");
      return saltArray;
    }
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // console.log({
    //   user: data.get("login"),
    //   password: data.get("password"),
    // });
    // publish("userChanged", {
    //   usr: data.get("login"),
    //   psw: data.get("password"),
    // });
    const vstr = JSON.stringify({
      usr: data.get("login"),
      psw: data.get("password"),
      // salt: generateBrowserSalt(),
    });
    // console.log("#92ib Sign " + vstr);
    publish("userChanged", window.btoa(vstr));
  };

  return (
    // <ThemeProvider theme={defaultTheme}>
    <Container component="main" maxWidth="xs">
      {/* <CssBaseline /> */}
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Авторизація
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="login"
            label="Login"
            name="login"
            // autoComplete="email"
            autoFocus
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
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Вхід
          </Button>
          {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
    // </ThemeProvider>
  );
}
