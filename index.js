
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");
const app = express();
const { GoogleSpreadsheet } = require("google-spreadsheet");

// Usa tu dominio real de Netlify aquí
const corsOptions = {
  origin: "https://facturafacilpymes.netlify.app", // tu dominio frontend
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Configurar MercadoPago con token desde .env
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// Rutas
const createpreferenceRoutes = require("./routes/create_preference");
const webhookRoutes = require("./routes/webhook");
const loginValidatorRoutes = require("./routes/loginValidator");

app.use("/", createpreferenceRoutes);
app.use("/", webhookRoutes);
app.use("/", loginValidatorRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

console.log("Token MercadoPago:", process.env.MERCADOPAGO_ACCESS_TOKEN);
