import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/header";

const Pay = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log("values", values);
    addpayment(values.invoiceid, values.paymenttype, values.amount);
  };

  const addpayment = async (invoiceid, paymenttype, amount) => {
    try {
      const body = { invoiceid, paymenttype, amount };
      const response = await fetch("http://localhost:5000/users/1/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      window.location = "/products";
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Box m="20px">
      <Header title="PAY" subtitle="PAY for invoice" />

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
                label="invoice id"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.invoiceid}
                name="invoiceid"
                error={!!touched.invoiceid && !!errors.invoiceid}
                helperText={touched.invoiceid && errors.invoiceid}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="payment type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.paymenttype}
                name="paymenttype"
                error={!!touched.paymenttype && !!errors.paymenttype}
                helperText={touched.paymenttype && errors.paymenttype}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="amount"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.amount}
                name="amount"
                error={!!touched.amount && !!errors.amount}
                helperText={touched.amount && errors.amount}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Pay
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const initialValues = {
  invoiceid: "",
  paymenttype: "",
  amount: "",
};
const checkoutSchema = yup.object().shape({
  paymenttype: yup.string().required("required"),
  invoiceid: yup
    .number("must be a number")
    .required("required")
    .integer("must be an integer")
    .positive("must be positive"),

  amount: yup
    .number("must be a number")
    .required("required")
    .integer("must be an integer")
    .positive("must be positive"),
});

export default Pay;
