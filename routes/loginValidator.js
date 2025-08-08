const express = require("express");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};
const router = express.Router();

const SHEET_ID = process.env.GOOGLE_SHEET_ID; // Tu sheet real

router.post("/verificar-suscripcion", async (req, res) => {
  const { id_suscripcion } = req.body;

  if (!id_suscripcion) {
    return res.status(400).json({ success: false, message: "⚠️ ID requerido" });
  }

  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth(creds);

    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["Clientes"];
    const rows = await sheet.getRows();

    const cliente = rows.find(row =>
      row.ID_Suscripcion === id_suscripcion &&
      row.Estado.toLowerCase() === "approved"
    );

    if (cliente) {
      return res.status(200).json({
        success: true,
        cliente: {
          nombre: cliente.Nombre,
          correo: cliente.Correo,
          plan: cliente.Plan
        }
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "❌ ID inválido o suscripción no activa."
      });
    }
  } catch (error) {
    console.error("🔴 Error verificando suscripción:", error.message);
    return res.status(500).json({
      success: false,
      message: "⛔ Error del servidor al verificar suscripción."
    });
  }
});

module.exports = router;
