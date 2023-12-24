const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken"); // Import the JWT library
const session = require("express-session");

//middleware
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "your secret key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set to true if your app is on https
  })
);

app.listen(5000, () => {
  console.log("server has started on port 5000");
});

//ROUTES//
//get user id from password and email
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query(
      "SELECT user_id FROM users WHERE user_email = $1 AND user_password = $2",
      [email, password]
    );
    req.session.userId = user.rows[0].user_id;
    console.log("here1" + user.rows[0].user_id);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const allProducts = await pool.query(
      "SELECT product_id AS id, * FROM product"
    );
    res.json(allProducts.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get all products by a specific user
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await pool.query(
      "SELECT p.product_id as id,p.product_description as name,ROUND(AVG(p.product_price), 2) AS avg_product_price, ROUND(AVG(ps.product_supply_price), 2) AS avg_product_supply_price, SUM(ps.product_supply_quant) AS sum_product_supply_quant FROM product p JOIN product_supply ps ON p.product_id = ps.product_id WHERE ps.user_id = $1 GROUP BY p.product_id",
      [id]
    );
    res.json(products.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

//        dashboard aggregations for vendor         //

{
  // Get the sum of sales for a specific vendor
  app.get("/users/:userId/sales", async (req, res) => {
    try {
      const { userId } = req.params;
      const sumSales = await pool.query(
        "SELECT SUM(p.product_price * im.invoice_map_quantity) AS total_sales FROM invoice_map im JOIN product p ON im.product_id = p.product_id JOIN product_supply ps ON p.product_id = ps.product_id WHERE ps.user_id = $1 ",
        [userId]
      );
      res.json(sumSales.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Failed to fetch sum of sales" });
    }
  });

  // Get the avg of sales for a specific vendor
  app.get("/users/:userId/avg", async (req, res) => {
    try {
      const { userId } = req.params;
      const avgSales = await pool.query(
        "SELECT AVG(p.product_price * im.invoice_map_quantity) AS avg_sales FROM invoice_map im JOIN product p ON im.product_id = p.product_id JOIN product_supply ps ON p.product_id = ps.product_id WHERE ps.user_id = $1 ",
        [userId]
      );
      res.json(avgSales.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Failed to fetch avg of sales" });
    }
  });

  // get the net profit of all sales for a specific vendor
  app.get("/users/:userId/net", async (req, res) => {
    try {
      const { userId } = req.params;
      const netProfit = await pool.query(
        "SELECT SUM((p.product_price - ps.product_supply_price) * im.invoice_map_quantity) AS net_profit FROM invoice_map im JOIN product p ON im.product_id = p.product_id JOIN product_supply ps ON p.product_id = ps.product_id WHERE ps.user_id = $1 ",
        [userId]
      );
      res.json(netProfit.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Failed to fetch net profit" });
    }
  });

  // get the total number of sales for a specific vendor
  app.get("/users/:userId/count", async (req, res) => {
    try {
      const { userId } = req.params;
      const countSales = await pool.query(
        "SELECT COUNT(*) AS total_sales FROM invoice_map im JOIN product p ON im.product_id = p.product_id JOIN product_supply ps ON p.product_id = ps.product_id WHERE ps.user_id = $1 ",
        [userId]
      );
      res.json(countSales.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Failed to fetch total sales" });
    }
  });
}

//    dashboard aggregations for client         //

{
  // Get the sum of purchases for a specific client
  app.get("/users/:userId/purchases", async (req, res) => {
    try {
      const { userId } = req.params;
      const sumPurchases = await pool.query(
        "SELECT SUM(p.product_price * im.invoice_map_quantity) AS total_purchases FROM invoice_map im JOIN product p ON im.product_id = p.product_id JOIN invoice i ON im.invoice_id = i.invoice_id WHERE i.client_id = $1 ",
        [userId]
      );
      res.json(sumPurchases.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Failed to fetch sum of purchases" });
    }
  });

  // Get the avg of purchases for a specific client
  app.get("/users/:userId/avgpurchases", async (req, res) => {
    try {
      const { userId } = req.params;
      const avgPurchases = await pool.query(
        "SELECT AVG(p.product_price * im.invoice_map_quantity) AS avg_purchases FROM invoice_map im JOIN product p ON im.product_id = p.product_id JOIN invoice i ON im.invoice_id = i.invoice_id WHERE i.client_id = $1 ",
        [userId]
      );
      res.json(avgPurchases.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Failed to fetch avg of purchases" });
    }
  });

  // get the total number of purchases for a specific client
  app.get("/users/:userId/countpurchases", async (req, res) => {
    try {
      const { userId } = req.params;
      const countPurchases = await pool.query(
        "SELECT COUNT(*) AS total_purchases FROM invoice_map im JOIN product p ON im.product_id = p.product_id JOIN invoice i ON im.invoice_id = i.invoice_id WHERE i.client_id = $1 ",
        [userId]
      );
      res.json(countPurchases.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Failed to fetch total purchases" });
    }
  });

  // Get the balance of a specific client
  app.get("/users/:userId/balance", async (req, res) => {
    try {
      const { userId } = req.params;
      const balance = await pool.query(
        "SELECT balance FROM users WHERE user_id = $1",
        [userId]
      );
      res.json(balance.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Failed to fetch balance" });
    }
  });
}

//     invoice tables  client   //

{
  // Get allinvoices of a specific client
  app.get("/users/:userId/invoices", async (req, res) => {
    try {
      const { userId } = req.params;
      const invoices = await pool.query(
        "SELECT invoice_id as id,* FROM invoice WHERE client_id = $1",
        [userId]
      );
      res.json(invoices.rows);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });
}

//     sold products tables  vendor   //

{
  // get all sold products of a specific seller with their quantity and profit
  app.get("/users/:userId/soldproducts", async (req, res) => {
    try {
      const { userId } = req.params;
      const soldProducts = await pool.query(
        "SELECT p.product_id as id, p.product_description, p.product_price, SUM(im.invoice_map_quantity) AS total_sold, (p.product_price - ps.product_supply_price) AS profit, p.product_quant AS quantity_left FROM invoice_map im JOIN product p ON im.product_id = p.product_id JOIN product_supply ps ON p.product_id = ps.product_id WHERE ps.user_id = $1 GROUP BY p.product_id, ps.product_supply_price",
        [userId]
      );
      res.json(soldProducts.rows);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Failed to fetch sold products" });
    }
  });
}

//     purchased products tables  client   //

{
  //get all purchased products of a specific client with cost of purchase and date that purchase was made and quantity of that product
  app.get("/users/:userId/purchasedproducts", async (req, res) => {
    try {
      const { userId } = req.params;
      const purchasedProducts = await pool.query(
        "SELECT p.product_id, p.product_name, p.product_price, im.invoice_map_quantity AS quantity_purchased, i.invoice_date FROM invoice_map im JOIN product p ON im.product_id = p.product_id JOIN invoice i ON im.invoice_id = i.invoice_id WHERE i.client_id = $1",
        [userId]
      );
      res.json(purchasedProducts.rows);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Failed to fetch purchased products" });
    }
  });
}

// supply a product
app.post("/supply/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { productid, supplyprice, supplyquantity } = req.body;
    const supply = await pool.query(
      "INSERT INTO product_supply (user_id, product_id, product_supply_price, product_supply_quant) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, productid, supplyprice, supplyquantity]
    );
    res.json(supply.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// add a product
app.post("/addproduct", async (req, res) => {
  try {
    const { productid, description, sellingprice } = req.body;
    const product = await pool.query(
      "INSERT INTO product (product_id, product_description, product_price) VALUES ($1, $2, $3) RETURNING *",
      [productid, description, sellingprice]
    );
    res.json(product.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// get recent payments that a vendor received
app.get("/users/:userId/recentpayments", async (req, res) => {
  try {
    const { userId } = req.params;
    const recentPayments = await pool.query(
      "SELECT pd.payment_id AS id, i.invoice_id, pd.payment_amount, pd.payment_type, pd.payment_date, i.invoice_total, (i.invoice_total - COALESCE(SUM(pd.payment_amount), 0)) AS remaining_payment FROM payment_details pd JOIN invoice i ON pd.invoice_id = i.invoice_id JOIN invoice_map im ON i.invoice_id = im.invoice_id JOIN product_supply ps ON im.product_id = ps.product_id WHERE ps.user_id = $1 GROUP BY pd.payment_id, i.invoice_id, pd.payment_amount, pd.payment_type, pd.payment_date, i.invoice_total",
      [userId]
    );
    res.json(recentPayments.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch recent payments" });
  }
});

// add to cart
app.post("/cart/:basket_id", async (req, res) => {
  try {
    const basket_id = req.params.basket_id;
    const product_ids = req.body.ids;

    for (let id of product_ids) {
      try {
        await pool.query("SELECT add_to_basket($1, $2)", [basket_id, id]);
      } catch (err) {
        console.error(`Failed to add product ${id} to basket: ${err.message}`);
        // You can decide what to do here. For example, you could send a response to the client with an error message.
        res.status(500).json({
          error: `Failed to add product ${id} to basket: ${err.message}`,
        });
        return;
      }
    }

    res.json({ message: "Products added to cart successfully" });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while adding products to the cart" });
  }
});

//get all products in cart
app.get("/users/cart/:user", async (req, res) => {
  try {
    const user_id = req.params.user;
    //const basket_id = req.params.basket_id;
    const products = await pool.query(
      `
      SELECT p.product_id as id, p.product_description, SUM(p.product_price) AS total_price, SUM(bm.basket_map_quant) AS total_quantity
      FROM basket_map bm
      JOIN product p ON bm.product_id = p.product_id
      WHERE bm.basket_id = $1
      GROUP BY p.product_id, p.product_description
    `,
      [user_id]
    );
    res.json(products.rows);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products in the cart" });
  }
});

// cereate invoice for list selected products by looping throught body that contains product ids
app.post("/users/:userId/invoice", async (req, res) => {
  try {
    const userId = req.params.userId;
    const ids = req.body.ids;
    console.log(ids);
    const invoice = await pool.query(
      "INSERT INTO invoice (client_id) VALUES ($1) RETURNING *",
      [userId]
    );
    console.log(invoice.rows[0].invoice_id);
    for (let product of ids) {
      try {
        await pool.query(
          "INSERT INTO invoice_map (invoice_id, product_id, invoice_map_quantity) VALUES ($1, $2, $3)",
          [invoice.rows[0].invoice_id, product, 1]
        );
      } catch (err) {
        console.error(`Failed to add product ${id} to basket: ${err.message}`);
        // You can decide what to do here. For example, you could send a response to the client with an error message.
        res.status(500).json({
          error: `Failed to add product ${id} to basket: ${err.message}`,
        });
        return;
      }
    }

    res.json({ message: "Products added to cart successfully" });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while adding products to the cart" });
  }
});

// create a payment
app.post("/users/:userId/payment", async (req, res) => {
  try {
    const { userId } = req.params;
    const { invoiceid, paymenttype, amount } = req.body;
    console.log(invoiceid);
    // Create the payment
    const payment = await pool.query(
      "INSERT INTO payment_details (invoice_id, payment_amount, payment_type) VALUES ($1, $2, $3) RETURNING *",
      [invoiceid, amount, paymenttype]
    );

    res.json({ message: "Payment created successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to create payment" });
  }
});
