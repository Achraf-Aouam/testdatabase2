import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/header";
import React, { useState, useEffect } from "react";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const Products = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [products, setProducts] = useState([]); //initial state is an empty array
  const [ids, setIds] = useState([]);
  const getprducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/products");
      const jsonData = await response.json();

      setProducts(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleClick = async () => {
    // add the selected products to the cart
    try {
      const body = { ids };
      const response = await fetch("http://localhost:5000/cart/1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      window.location = "/cart";
    } catch (error) {
      console.error(error.message);
      alert("the product is not stocked");
    }
  };

  useEffect(() => {
    getprducts();
  }, []);
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },

    {
      field: "product_price",
      headerName: "PRICE",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "product_quant",
      headerName: " QUANTITY",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="PRODUCTS" subtitle="Managing your products" />
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
          rows={products}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          onRowSelectionModelChange={(e) => {
            setIds(e);
          }}
        />
        {/* button to delete selected products using mui styling */}
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          m="20px 0 0 0"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="10px"
            sx={{
              "& .MuiSvgIcon-root": {
                fontSize: "30px",
                color: colors.grey[100],
              },
            }}
          >
            <Typography
              variant="h6"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ m: "10px 0 0 0" }}
            >
              {ids.length} selected
            </Typography>
            <IconButton onClick={handleClick}>
              <AddShoppingCartIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Products;
