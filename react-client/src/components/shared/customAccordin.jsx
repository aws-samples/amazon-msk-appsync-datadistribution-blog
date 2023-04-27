import * as React from "react";
import {
  Accordion,
  Grid,
  Container,
  Button,
  Box,
  TableCell,
} from "@mui/material";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CustomizedTables from "./Table_";
import "./table.css";

export default function SimpleAccordion(props) {
  const [values, setValues] = React.useState(props.data);
  const [channel, setChannel] = React.useState(props.channel);
  return (
    <div style={{ padding: "0.25rem" }}>
      {/* for now  just add static .. later on ... map through given data to render each table as accordin*/}
      <Accordion sx={{}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              minWidth: "15rem",
            }}
          >
            <Button
              className={""}
              sx={{ width: 50, height: 20, padding: 1, mr: 2 }}
              variant="contained"
            >
              <Typography>{channel.symbol}</Typography>
            </Button>
            <Typography>{channel.companyName}</Typography>
          </Typography>
          <Typography sx={{ color: "text.secondary", "margin-left": "2rem" }}>
            <Box sx={{}}>
              <TableCell colSpan={'2'} sx={{ border: "none", padding:'0rem 6rem 0rem 1rem' }}>
                {`${'$'+ Math.abs(values[0].Close).toFixed(5)}`}
              </TableCell>
              <TableCell colSpan={2}
                className={
                  values[0].Close - values[1].Close >= 0 ? "green" : "red"
                }
                sx={{ border: "none", padding:'0rem 6rem 0rem 1rem' }}
              > <Typography className={
                values[0].Close - values[1].Close >= 0
                  ? "text-success"
                  : "text-danger"
              }>{ values[0].Close - values[1].Close >= 0 ? (
                  <ArrowUpwardIcon sx={{ fontSize: "medium" }} />
                  ) : (
                    <ArrowDownwardIcon sx={{ fontSize: "medium" }} />
                  )
                }
                {`${ '$' +(Math.abs(values[0].Close - values[1].Close) ).toFixed(5)}`}
                </Typography>
              </TableCell>
              <TableCell  colSpan={2} sx={{ border: "none" }}>
                <Typography className={
                  values[0].Close - values[1].Close >= 0
                    ? "text-success"
                    : "text-danger"
                }>{
                  values[0].Close - values[1].Close >= 0 ? (
                  <ArrowUpwardIcon sx={{ fontSize: "medium" }} />
                  ) : (
                    <ArrowDownwardIcon sx={{ fontSize: "medium" }} />
                  )}
                {`${(
                  (Math.abs(
                    values[0].Close - values[1].Close
                  ) /
                    values[0].Close) *
                  100
                ).toFixed(3)}%`}</Typography>
              </TableCell>
            </Box>
          </Typography>
        </AccordionSummary>
        <Grid AccordionDetails xs={6} md={6} lg={12}>
          <AccordionDetails>
            <Container>
              <CustomizedTables values={values} />
            </Container>
          </AccordionDetails>
        </Grid>
      </Accordion>
    </div>
  );
}
