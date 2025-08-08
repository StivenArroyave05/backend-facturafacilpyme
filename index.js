
require("dotenv").config();
const express = require("express");
const app = express();
const mercadopago = require("mercadopago");
const cors = require("cors");
app.use(cors({
  origin: "https://facturafacilpymes.netlify.app",
  methods: "GET,POST",
}));



const PORT = process.env.PORT || 3000;

// Configurar MercadoPago con token desde .env
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

app.use(express.json());

// Rutas
app.use("/", require("./routes/create_preference"));
app.use("/", require("./routes/webhook"));
app.use("/", require("./routes/loginValidator"));

// Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

console.log("Token MercadoPago:", process.env.MP_ACCESS_TOKEN);
