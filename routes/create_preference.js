require("dotenv").config();
const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");

router.post("/create_preference", async (req, res) => {
  try {
    const { title, unit_price, description, buyer_name, buyer_lastname } = req.body;

    if (!title || !unit_price || isNaN(unit_price)) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    const internal_id = "FFP-" + Date.now();

    const preference = {
      items: [
        {
          title: title,
          description: description || "Servicio adquirido desde FacturaFácilPyme",
          quantity: 1,
          unit_price: parseInt(unit_price, 10),
          currency_id: "COP"
        }
      ],
      payer: {
      name: buyer_name || "Cliente",
      surname: buyer_lastname || ""
      },
      back_urls: {
        success: "https://facturafacilpymes.netlify.app/gracias",
        failure: "https://facturafacilpymes.netlify.app/error",
        pending: "https://facturafacilpymes.netlify.app/pendiente"
      },
      auto_return: "approved",
      notification_url: "https://backend-mercadopago-uvmn.onrender.com/webhook",
      external_reference: internal_id
    };

    const response = await mercadopago.preferences.create(preference);

    res.json({
      id: response.body.id,
      external_reference: internal_id
    });
              
  } catch (error) {
    console.error("Error creando preferencia:", error);
    res.status(500).json({ error: "No se pudo crear la preferencia" });
  }
});

module.exports = router;
