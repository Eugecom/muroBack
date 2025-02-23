const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const commentsRoutes = require('./routes/commentsRoutes.js');
const { SitemapStream, streamToPromise } = require('sitemap');

const app = express();

app.use(bodyParser.json());

app.use(cors());
app.use('/api', commentsRoutes);

//********************************** */


app.get('/sitemap.xml', async (req, res) => {
    res.header('Content-Type', 'application/xml');

    const hostname = 'https://www.murodemontana.com'; // Cambia esto por tu dominio real
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

    const xml = await streamToPromise(sitemap);
    res.send(xml.toString());      
});



//************************************************* */

module.exports = { app }