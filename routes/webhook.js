const express = require("express");
const router = express.Router();
const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

const mercadopago = require("mercadopago");

// ID de tu hoja de cálculo de Google Sheets
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Ruta del webhook
router.post("/webhook", async (req, res) => {
  const payment = req.body;

  // Validar tipo de notificación
  if (payment.type !== "payment") return res.sendStatus(200);

  try {
    const data = await mercadopago.payment.findById(payment.data.id);
    const info = data.body;

    if (info.status === "approved") {
      const doc = new GoogleSpreadsheet(SHEET_ID);
      await doc.useServiceAccountAuth(creds);

      await doc.loadInfo();
      const sheet = doc.sheetsByTitle["Clientes"];
      if (!sheet) throw new Error("Hoja 'Clientes' no encontrada.");

      await sheet.loadHeaderRow();
      const rows = await sheet.getRows();

      // Generar ID único secuencial tipo FFP-0001
      const lastRow = rows[rows.length - 1];
      let nextId = 1;
      if (lastRow && lastRow.ID_Suscripcion) {
        const lastId = parseInt(lastRow.ID_Suscripcion.replace("FFP-", ""));
        nextId = isNaN(lastId) ? 1 : lastId + 1;
      }

      const newID = "FFP-" + String(nextId).padStart(4, "0");

      // Insertar fila en la hoja
      await sheet.addRow({
        ID_Suscripcion: newID,
        Nombre: `${info.payer.first_name} ${info.payer.last_name || ""}`.trim(),
        Correo: info.payer.email,
        Fecha: new Date().toLocaleDateString("es-CO"),
        Plan: info.description || "Plan no definido",
        Monto: info.transaction_amount,
        Estado: info.status
      });

      console.log(`✅ Suscripción registrada con ID: ${newID}`);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error procesando webhook:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
