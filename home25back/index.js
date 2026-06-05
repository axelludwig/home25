require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Test route
app.get('/', (req, res) => {
    res.send(`hello, world 🌍 (api key: ${process.env.API_KEY || 'not defined'})`);
});

app.get('/weather', (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'please provide lat and lon' });
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            res.json(data);
            // res.json({ message: `Weather data for lat: ${lat}, lon: ${lon} 🌤️` });
        })
        .catch(error => {
            res.status(500).json({ error: 'error retrieving weather data' });
        });
});


app.get('/api/data', (req, res) => {
    res.json({ message: 'here\'s json data 🚀' });
});

// Starting the server
app.listen(PORT, () => {
    console.log(`✅ server started on http://localhost:${PORT}`);
});
