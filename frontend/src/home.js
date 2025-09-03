// frontend/src/home.js (Corrected to match your new TF-Serving backend)

import { useState, useEffect, useCallback } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@material-ui/core";
import cblogo from "./cblogo.PNG";
import image from "./bg.png";
import { DropzoneArea } from 'material-ui-dropzone';
import { common } from '@material-ui/core/colors';
import Clear from '@material-ui/icons/Clear';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import axios from "axios";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(common.white),
    backgroundColor: common.white,
    '&:hover': {
      backgroundColor: '#ffffff7a',
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  clearButton: {
    width: "-webkit-fill-available",
    borderRadius: "15px",
    padding: "15px 22px",
    color: "#000000a6",
    fontSize: "20px",
    fontWeight: 900,
  },
  root: {
    maxWidth: 345,
    flexGrow: 1,
  },
  media: {
    height: 400,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  gridContainer: {
    justifyContent: "center",
    padding: "4em 1em 0 1em",
  },
  mainContainer: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: "auto",
    minHeight: "93vh",
    marginTop: "8px",
    paddingBottom: "2em",
  },
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    minHeight: 500,
    height: 'auto',
    backgroundColor: 'transparent',
    boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%) !important',
    borderRadius: '15px',
  },
  imageCardEmpty: {
    height: 'auto',
  },
  input: {
    display: 'none',
  },
  uploadIcon: {
    background: 'white',
  },
  tableContainer: {
    backgroundColor: 'white',
    boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  },
  table: { backgroundColor: 'transparent !important' },
  tableHead: { backgroundColor: 'transparent !important' },
  tableRow: { backgroundColor: 'transparent !important' },
  tableCell: {
    fontSize: '22px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
  },
  tableCell1: {
    fontSize: '18px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '1px 24px 1px 16px',
  },
  tableBody: { backgroundColor: 'transparent !important' },
  buttonGrid: { maxWidth: "416px", width: "100%" },
  detail: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  appbar: { background: '#be6a77', boxShadow: 'none', color: 'white' },
  loader: { color: '#be6a77 !important' },
  infoButton: { marginTop: '10px', color: '#be6a77', fontWeight: 'bold' },
  detailsContainer: { width: '100%', marginTop: '20px', padding: '10px' },
  historyCard: { width: 200, borderRadius: '10px' },
  historyCardMedia: { height: 120 },
  historyCardContent: { padding: '12px !important' },
  historyText: { fontSize: '0.9rem', lineHeight: 1.4 },
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [history, setHistory] = useState([]);

  const sendFile = useCallback(async () => {
    if (!selectedFile) return;

    setIsloading(true);
    let formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await axios({
        method: "post",
        // Make sure your .env file points to the correct URL (e.g., http://localhost:8001/predict)
        url: process.env.REACT_APP_API_URL,
        data: formData,
      });

      if (res.status === 200) {
        const result = { ...res.data, imagePreview: preview };
        setData(result);
        setHistory(prevHistory => [result, ...prevHistory].slice(0, 3));
      }
    } catch (error) {
      console.error("Error sending file:", error);
    } finally {
      setIsloading(false);
    }
  }, [selectedFile, preview]);

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
    setShowDetails(false);
  };
  
  useEffect(() => {
    if (selectedFile && preview) {
      sendFile();
    }
  }, [preview, selectedFile, sendFile]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      clearData();
      return;
    }
    const file = files[0];
    setSelectedFile(file);
    setData(null);
    setImage(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setPreview(reader.result);
    reader.onerror = (error) => console.error("FileReader error:", error);
  };
  
  // <-- CHANGE #1: Simplified chart data logic. No need to remove "Potato___".
  const chartData = data?.all_percentages
    ? Object.entries(data.all_percentages).map(([name, percentage]) => ({ name, percentage: parseFloat(percentage).toFixed(2) }))
    : [];

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar><Typography variant="h6" noWrap>Potato Leaf Disease Classification</Typography><div className={classes.grow} /><Avatar src={cblogo} /></Toolbar>
      </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters>
        <Grid container className={classes.gridContainer} direction="row" justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
              {image && <CardActionArea><CardMedia className={classes.media} image={preview} component="img" /></CardActionArea>}
              {!image && <CardContent><DropzoneArea acceptedFiles={['image/*']} dropzoneText={"Drag and drop an image of a potato plant leaf to process"} onChange={onSelectFile} /></CardContent>}
              {data && (
                <CardContent className={classes.detail}>
                  <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table size="small">
                      <TableHead><TableRow><TableCell className={classes.tableCell1}>Label:</TableCell><TableCell align="right" className={classes.tableCell1}>Confidence:</TableCell></TableRow></TableHead>
                      <TableBody><TableRow>
                        {/* <-- CHANGE #2: Use `data.predicted_label` instead of `data.class`. */}
                        <TableCell component="th" scope="row" className={classes.tableCell}>{data.predicted_label}</TableCell>
                        
                        {/* <-- CHANGE #3: Display confidence directly. Do NOT multiply by 100. */}
                        <TableCell align="right" className={classes.tableCell}>{`${parseFloat(data.confidence).toFixed(2)}%`}</TableCell>
                      </TableRow></TableBody>
                    </Table>
                  </TableContainer>
                  <Button className={classes.infoButton} onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'Hide Details' : 'Show Full Info'}</Button>
                  {showDetails && data.all_percentages && (
                    <div className={classes.detailsContainer}>
                      <Typography variant="h6" align="center" gutterBottom>Prediction Breakdown</Typography>
                      <ResponsiveContainer width="100%" height={120}>
                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                          <YAxis type="category" dataKey="name" width={80} style={{ fontSize: '0.8rem' }} />
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Bar dataKey="percentage" fill="#be6a77"><LabelList dataKey="percentage" position="right" formatter={(value) => `${value}%`} style={{ fontSize: '0.8rem' }} /></Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              )}
              {isLoading && <CardContent className={classes.detail}><CircularProgress className={classes.loader} /><Typography variant="h6" noWrap>Processing</Typography></CardContent>}
            </Card>
          </Grid>
          {data && <Grid item className={classes.buttonGrid}><ColorButton variant="contained" className={classes.clearButton} color="primary" onClick={clearData} startIcon={<Clear />}>Clear</ColorButton></Grid>}
          
          {history.length > 0 && (
            <Grid item xs={12} style={{ marginTop: '2em' }}>
              <Typography variant="h5" align="center" style={{ color: 'white', fontWeight: 'bold', marginBottom: '1em' }}>Prediction History</Typography>
              <Grid container spacing={3} justifyContent="center">
                {history.map((item, index) => (
                  <Grid item key={index}>
                    <Card className={classes.historyCard}>
                      <CardMedia className={classes.historyCardMedia} image={item.imagePreview} component="img" />
                      <CardContent className={classes.historyCardContent}>
                        <Typography className={classes.historyText} color="textSecondary">Result #{index + 1}</Typography>
                        {/* <-- CHANGE #2 (Also in history) --> */}
                        <Typography className={classes.historyText} style={{ fontWeight: 'bold' }}>{item.predicted_label}</Typography>
                        {/* <-- CHANGE #3 (Also in history) --> */}
                        <Typography className={classes.historyText} style={{ fontWeight: 'bold' }}>{parseFloat(item.confidence).toFixed(2)}%</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default ImageUpload;