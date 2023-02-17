import React, { useState, useEffect, useRef, CSSProperties } from "react";
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
  styled,
  AppBar,
  Container,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
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
            <MenuIcon />
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

  useInterval(
    () => {
      if (count < steps.length + 1) {
        setCount(count + 1);
      }
    },
    count === 5 ? 1000 : 8000
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
      <Div variant="h1">
        Calculating Leg Length {displayFor && "For"}{" "}
        {seriesUID && `Series UID:${seriesUID}, `}
        {studyUID && `Study UID:${studyUID}, `}
        {userID && `User ID:${userID} `}
      </Div>

      <Box sx={{ width: "100%", marginTop: "2rem" }}>
        <Stepper activeStep={count} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
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

        {count >= 4 && <div className="curtain-up"></div>}

        <div
          className={
            count === 0
              ? "curtain-down"
              : count >= 1 && count <= 4
              ? "screen"
              : "screen-fade-out"
          }
        >
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
