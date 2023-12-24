import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/header";
import React, { useState, useEffect } from "react";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  const getpayments = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/users/1/recentpayments"
      );
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getpayments();
  }, []);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "invoice_id",
      headerName: "invoice id",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "invoice_total",
      headerName: "invoice total",
      flex: 1,
    },
    {
      field: "payment_type",
      headerName: "payment type",
      flex: 1,
    },
    {
      field: "payment_amount",
      headerName: "payment amount",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          ${params.row.payment_amount}
        </Typography>
      ),
    },
    {
      field: "payment_date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "remaining_payment",
      headerName: "remaining payment",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
  ];

  return (
    <Box m="20px">
      <Header title="payments" subtitle="List of payments recieved" />
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
          checkboxSelection
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Invoices;
