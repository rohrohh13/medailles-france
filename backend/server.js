const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Utiliser CORS
const cors = require("cors");
app.use(cors()); // Autorise toutes les origines (frontends) à accéder à ton backend

// Route pour récupérer les médailles
app.get("/api/medailles", async (req, res) => {
  try {
    const response = await fetch(process.env.OPEN_SHEET_URL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des médailles" });
  }
});

// Route pour récupérer les athlètes
app.get("/api/athletes", async (req, res) => {
  try {
    const response = await fetch(process.env.OPEN_SHEET_ATHLETES);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des athlètes" });
  }
});

// Démarrer le serveur
app.listen(PORT, () => console.log(`Serveur backend sur http://localhost:${PORT}`));
