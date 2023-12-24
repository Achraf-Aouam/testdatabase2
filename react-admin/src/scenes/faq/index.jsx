import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/header";

const FAQ = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log("values", values);
    addproduct(values.productid, values.description, values.sellingprice);
  };

  const addproduct = async (productid, description, sellingprice) => {
    try {
      const body = { productid, description, sellingprice };
      const response = await fetch("http://localhost:5000/addproduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      window.location = "/form";
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Box m="20px">
      <Header title="create product" subtitle="add a product" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="product id"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.productid}
                name="productid"
                error={!!touched.productid && !!errors.productid}
                helperText={touched.productid && errors.productid}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="selling price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.sellingprice}
                name="sellingprice"
                error={!!touched.sellingprice && !!errors.sellingprice}
                helperText={touched.sellingprice && errors.sellingprice}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                supply product
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const initialValues = {
  productid: "",
  description: "",
  sellingprice: "",
};
const checkoutSchema = yup.object().shape({
  description: yup.string().required("required"),
  productid: yup
    .number("must be a number")
    .required("required")
    .integer("must be an integer")
    .positive("must be positive"),

  sellingprice: yup
    .number("must be a number")
    .required("required")
    .integer("must be an integer")
    .positive("must be positive"),
});

export default FAQ;
