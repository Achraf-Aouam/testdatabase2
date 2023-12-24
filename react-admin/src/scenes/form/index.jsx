import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/header";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    supplyproduct(values.productid, values.supplyprice, values.supplyquantity);
    console.log("values", values);
  };

  const supplyproduct = async (productid, supplyprice, supplyquantity) => {
    try {
      const body = { productid, supplyprice, supplyquantity };
      const response = await fetch("http://localhost:5000/supply/1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      window.location = "/team";
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Box m="20px">
      <Header title="supply product" subtitle="supply a product" />

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
                label="supply price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.supplyprice}
                name="supplyprice"
                error={!!touched.supplyprice && !!errors.supplyprice}
                helperText={touched.supplyprice && errors.supplyprice}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="supplyquantity"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.supplyquantity}
                name="supplyquantity"
                error={!!touched.supplyquantity && !!errors.supplyquantity}
                helperText={touched.supplyquantity && errors.supplyquantity}
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
  supplyprice: "",
  supplyquantity: "",
};
const checkoutSchema = yup.object().shape({
  productid: yup
    .number("must be a number")
    .required("required")
    .integer("must be an integer")
    .positive("must be positive"),
  supplyprice: yup
    .number("must be a number")
    .required("required")
    .integer("must be an integer")
    .positive("must be positive"),

  supplyquantity: yup
    .number("must be a number")
    .required("required")
    .integer("must be an integer")
    .positive("must be positive"),
});

export default Form;
