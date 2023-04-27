import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Paper, Button } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import "./table.css";
import {lastDisplayIndex} from "../../constants";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    fontSize: 15,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const getlastValueIndex = (index) => {
  return index < lastDisplayIndex ? index + 1 : lastDisplayIndex + 1;
};

const getValueDiff = (row, data, index, key) => {
  return row[key] - data[getlastValueIndex(index, data.length - 1)][key];
}
export default function CustomizedTables(props) {
  // const
  const [data, setlastValue] = React.useState(props.values);
  const displayData = [...data];
  displayData.pop();
  return (
    <TableContainer sx={{ width: "100%", margin: "auto" }} component={Paper}>
      <Table sx={{}} aria-label="customized table">
        <TableHead sx={{ marginLeft: 2 }}>
          <TableRow minWidth={200} maxWidth={500}>
            <StyledTableCell>Price</StyledTableCell>
            <StyledTableCell>Change</StyledTableCell>
            <StyledTableCell>Change (%)</StyledTableCell>
            <StyledTableCell>Volume</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayData.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>
                {" "}
                <strong>
                  <b>$ </b>
                </strong>
                {row.Close.toFixed(5)}
              </StyledTableCell>

              <StyledTableCell
                className={
                  getValueDiff(row, data, index, 'Close') >= 0
                    ? "green"
                    : "red"
                }
              >
                <Button
                  className={
                    getValueDiff(row, data, index, 'Close') >= 0
                      ? "percentGreen"
                      : "percentRed"
                  }
                  sx={{ width: 100, height: 40 }}
                  variant="contained"
                >
                  {getValueDiff(row, data, index, 'Close') >= 0 ? (
                    <ArrowUpwardIcon sx={{ fontSize: "medium" }} />
                  ) : (
                    <ArrowDownwardIcon sx={{ fontSize: "medium" }} />
                  )}

                  {`${Math.abs(
                    getValueDiff(row, data, index, 'Close')
                  ).toFixed(5)}`}
                </Button>
              </StyledTableCell>
              <StyledTableCell
                className={
                  getValueDiff(row, data, index, 'Close') >= 0
                    ? "green"
                    : "red"
                }
              >
                <Button
                  className={
                    getValueDiff(row, data, index, 'Close') >= 0
                      ? "percentGreen"
                      : "percentRed"
                  }
                  sx={{ width: 100, height: 40 }}
                  variant="contained"
                >
                  {getValueDiff(row, data, index, 'Close') >= 0 ? (
                    <ArrowUpwardIcon sx={{ fontSize: "medium" }} />
                  ) : (
                    <ArrowDownwardIcon sx={{ fontSize: "medium" }} />
                  )}

                  {`${(
                    (Math.abs(
                      getValueDiff(row, data, index, 'Close')
                    ) /
                      row.Close) *
                    100
                  ).toFixed(3)}%`}
                </Button>
              </StyledTableCell>

              <StyledTableCell
                className={
                  getValueDiff(row, data, index, 'Volume') >= 0
                    ? "green"
                    : "red"
                }
              >
                {row.Volume}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
