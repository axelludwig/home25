require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Route de test
app.get('/', (req, res) => {
    res.send(`Hello, World! 🌍 (clé API : ${process.env.API_KEY || 'Non définie'})`);
});

app.get('/weather', (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Veuillez fournir lat et lon' });
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            res.json(data);
            // res.json({ message: `Données météo pour lat: ${lat}, lon: ${lon} 🌤️` });
        })
        .catch(error => {
            res.status(500).json({ error: 'Erreur lors de la récupération des données météo' });
        });
});


app.get('/api/data', (req, res) => {
    res.json({ message: 'Voici des données JSON 🚀' });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});