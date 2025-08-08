
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");
const app = express();
const { GoogleSpreadsheet } = require("google-spreadsheet");

app.use(express.json());
app.use(cors());
app.use(express.json());

// Configurar MercadoPago con token desde .env
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// Rutas
const createPreference = require("./routes/create_preference");
const webhookRoute = require("./routes/webhook");
app.use("/", createPreferenceRoutes);
app.use("/", require("./routes/webhook"));
app.use("/", require("./routes/loginValidator"));

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

console.log("Token MercadoPago:", process.env.MERCADOPAGO_ACCESS_TOKEN);
