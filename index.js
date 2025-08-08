
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
const createPreferenceRoutes = require("./routes/create_preference");
const webhookRoutes = require("./routes/webhook");
const loginValidatorRoutes = require("./routes/loginValidator");

app.use("/", createPreferenceRoutes);
app.use("/", webhookRoutes);
app.use("/", loginValidatorRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

console.log("Token MercadoPago:", process.env.MERCADOPAGO_ACCESS_TOKEN);
