const express = require("express");
const db = require("./db");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const razorpay = new Razorpay({
  key_id: "rzp_test_ppRLRXvuDouWug", // Your Razorpay Key ID (replace with your own)
  key_secret: "FXEg8qDiMrO6fG1IqdxWbFTV", // Your Razorpay Key Secret (replace with your own)
});
const PORT = 3000;
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "donation.html"));
});
app.post("/create-order", (req, res) => {
  const { amount } = req.body; // Amount should be sent in paise (1 INR = 100 paise)

  // Prepare order options
  const recId=`order_receipt_${new Date().getTime()}`;
  const options = {
    amount: amount * 100, // Convert to paise (e.g., 500 INR = 50000 paise)
    currency: "INR", // Currency type
    receipt: recId, // Generate unique receipt ID
    notes: {
      description: "Donation for a good cause",
    },
  };

  // Create order via Razorpay API
  razorpay.orders.create(options, (err, order) => {
    res.json({
      order_id: order.id,
      amount: options.amount / 100, // Convert back to INR for the client,
      receipt_id:recId
    });
  });
});
app.post("/save-order", (req, res) => {
  const { amount,order_id,recId } = req.body; // Amount should be sent in paise (1 INR = 100 paise)
  db.query(
    "INSERT INTO orders (order_id, recId, amount) VALUES (?, ?, ?)",
    [order_id, recId, amount],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      console.log("Data inserted successfully:", results);
    }
  );
  return res.json({"success":"true"});
});
app.use((req, res) => {
  res
    .status(404)
    .send(
      "<h1>404 Not Found</h1><p>The page you are looking for does not exist.</p>"
    );
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});