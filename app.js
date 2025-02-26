// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const commentsRoutes = require('./routes/commentsRoutes.js');
// const { SitemapStream, streamToPromise } = require('sitemap');

// const app = express();

// app.use(bodyParser.json());

// app.use(cors());
// app.use('/api', commentsRoutes);

// //********************************** */


// app.get('/sitemap.xml', async (req, res) => {
//     res.header('Content-Type', 'application/xml');

//     const hostname = 'https://www.murodemontana.com'; // Cambia esto por tu dominio real
//     const sitemap = new SitemapStream({ hostname });

//     // Rutas del sitio
//     const pages = [
//         { url: '/', changefreq: 'daily', priority: 1.0 },
//         { url: '/alquiler', changefreq: 'weekly', priority: 0.8 },
//         { url: '/excursionDetail1', changefreq: 'weekly', priority: 0.6 },
//         { url: '/excursionDetail2', changefreq: 'weekly', priority: 0.6 },
//         { url: '/excursionDetail3', changefreq: 'weekly', priority: 0.6 },
//         { url: '/excursionDetail4', changefreq: 'weekly', priority: 0.6 },
//         { url: '/excursionDetail7', changefreq: 'weekly', priority: 0.6 },
//         { url: '/excursionDetail8', changefreq: 'weekly', priority: 0.6 },
//         { url: '/excursionDetail10', changefreq: 'weekly', priority: 0.6 },
//         { url: '/contactForm', changefreq: 'weekly', priority: 0.6 },
//         { url: '/about', changefreq: 'weekly', priority: 0.6 }
//     ];

//     pages.forEach(page => sitemap.write(page));
//     sitemap.end();

//     const xml = await streamToPromise(sitemap);
//     res.send(xml.toString());      
// });



// //************************************************* */

// module.exports = { app }









const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const commentsRoutes = require('./routes/commentsRoutes.js');
const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');  // Importar fs para escribir en el sistema de archivos
const path = require('path');  // Importar path para manejar rutas correctamente

const app = express();

const corsOptions = {
    origin: 'https://murodemontana.com',
    methods: 'GET',
    allowedHeaders: 'Content-Type'
};

app.use(bodyParser.json());
//app.use(cors());
app.use(cors(corsOptions));
app.use('/api', commentsRoutes);

// Servir el sitemap antes de servir React
app.get('/sitemap.xml', async (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.header('Content-Type', 'application/xml');

    const hostname = 'https://murodemontana.com';  // Cambia esto por tu dominio real
    const sitemap = new SitemapStream({ hostname });

    // Rutas del sitio
    const pages = [
        { url: '/', changefreq: 'daily', priority: 1.0 },
        { url: '/alquiler', changefreq: 'weekly', priority: 0.8 },
        { url: '/excursionDetail1', changefreq: 'weekly', priority: 0.6 },
        { url: '/excursionDetail2', changefreq: 'weekly', priority: 0.6 },
        { url: '/excursionDetail3', changefreq: 'weekly', priority: 0.6 },
        { url: '/excursionDetail4', changefreq: 'weekly', priority: 0.6 },
        { url: '/excursionDetail7', changefreq: 'weekly', priority: 0.6 },
        { url: '/excursionDetail8', changefreq: 'weekly', priority: 0.6 },
        { url: '/excursionDetail10', changefreq: 'weekly', priority: 0.6 },
        { url: '/contactForm', changefreq: 'weekly', priority: 0.6 },
        { url: '/about', changefreq: 'weekly', priority: 0.6 }
    ];

    pages.forEach(page => sitemap.write(page));
    sitemap.end();

    // Generar el sitemap en un archivo
    const sitemapFilePath = path.join(__dirname, 'build', 'sitemap.xml');
    const xml = await streamToPromise(sitemap);
    
    // Escribir el sitemap en el archivo
    fs.writeFile(sitemapFilePath, xml, (err) => {
        if (err) {
            console.error("Error al escribir el archivo sitemap.xml:", err);
            res.status(500).send("Error al generar el sitemap.");
        } else {
            console.log("sitemap.xml generado y guardado correctamente.");
        }
    });

    // Enviar el archivo como respuesta HTTP
    res.send(xml.toString());
});

// Servir el contenido de React después de que el sitemap se haya manejado
app.use(express.static(path.join(__dirname, 'build')));

// Para todas las demás rutas, servir el archivo index.html de React
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
// });

module.exports = { app };   

    