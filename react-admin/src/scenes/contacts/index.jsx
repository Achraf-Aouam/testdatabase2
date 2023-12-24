import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/header";
import { useTheme } from "@mui/material";
import React, { useState, useEffect } from "react";

const Contacts = () => {
  const [data, setData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const getsoldproducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/users/1/soldproducts"
      );
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getsoldproducts();
  }, []);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "product_description",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "product_price",
      headerName: "PRICE",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "total_sold",
      headerName: "TOTAL SOLD",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "profit",
      headerName: "PROFIT/pcs",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "quantity_left",
      headerName: "QUANTITY LEFT",
      flex: 0.5,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
  ];

  return (
    <Box m="20px">
      <Header title="sales" subtitle="List of sales" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
