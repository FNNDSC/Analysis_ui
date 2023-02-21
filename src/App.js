import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  CssBaseline,
  Stepper,
  StepLabel,
  Step,
  Toolbar,
  Box,
  Button,
  IconButton,
  Typography,
  Alert,
  styled,
  AppBar,
  Container,
  CircularProgress,
  createTheme,
  ThemeProvider,
  Snackbar,
} from "@mui/material";
import { Menu } from "@mui/icons-material/";

import ImageScanner from "./ImageScanner";
import { useSearchParams } from "react-router-dom";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

export function App({ children }) {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BasicMenu />
        {children}
      </ThemeProvider>
    </div>
  );
}

function BasicMenu() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FNNDSC
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
  textAlign: "center",
  marginTop: "1rem",
}));

export function SimpleContainer({ children }) {
  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Box sx={{ height: "100vh" }}>{children}</Box>
      </Container>
    </React.Fragment>
  );
}

const steps = [
  "Retrieving from PACS",
  "Uploading to ChRIS",
  "Finding Landmarks with AI",
  "Measuring Lengths",
  "Pushing to PACS",
];

function useInterval(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export function StepperComponent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const seriesUID = searchParams.get("SeriesUID");
  const studyUID = searchParams.get("StudyUID");
  const userID = searchParams.get("UserID");

  const [count, setCount] = useState(0);
  const [processingCount, setProcessingCount] = useState(0);
  const [playing, setIsPlaying] = useState(false);
  const [snackbar, setSnackBar] = useState(false);

  useInterval(() => {
    if (snackbar === true) {
      setSnackBar(!snackbar);
    }
  }, 2500);

  useInterval(
    () => {
      if (!playing && count < steps.length) {
        setCount(count + 1);
      }
    },
    !playing ? 4000 : null
  );

  useInterval(() => {
    if (count === steps.length && processingCount < 7) {
      setProcessingCount(processingCount + 1);
    }
  }, 100);

  const displayFor = seriesUID || studyUID || userID;
  const viewImage = () => {
    navigate("/visualization");
  };

  const scan = count >= 2 && count <= 3;

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbar}
      >
        <Alert severity="info">
          {playing ? "Polling Stopped" : "Polling Resumed"}
        </Alert>
      </Snackbar>
      <Div variant="h1">
        Calculating Leg Length {displayFor && "For"}{" "}
        {seriesUID && `Series UID:${seriesUID}, `}
        {studyUID && `Study UID:${studyUID}, `}
        {userID && `User ID:${userID} `}
      </Div>

      <Box sx={{ width: "100%", marginTop: "2rem" }}>
        <Stepper activeStep={count} alternativeLabel>
          {steps.map((label, index) => (
            <Step
              onClick={() => {
                if (index === count) {
                  setIsPlaying(!playing);
                  setSnackBar(!snackbar);
                }
              }}
              key={label}
            >
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box
        sx={{
          position: "relative",
          height: "100%",
          width: "100%",
          marginTop: "3rem",
        }}
      >
        <div className={scan ? "scan" : ""}></div>
        {count >= 4 && count < 5 && <div className="pacs-push"></div>}
        <div className="screen">
          {count === 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress height="70px" width="70px" />
            </Box>
          )}
          {count >= 1 && <ImageScanner count={count} />}
          {count >= 4 && (
            <Button
              className="button"
              variant="contained"
              onClick={() => {
                viewImage();
              }}
            >
              View Side by Side
            </Button>
          )}
        </div>
      </Box>
    </>
  );
}
