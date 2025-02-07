const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://eugenio:hLk6nqJdERW5ub16ptp8dbHxL265Wku7@dpg-cuiijphu0jms738pk8p0-a.oregon-postgres.render.com/murodemontana',
    ssl: { rejectUnauthorized: false }
});

const createTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        comment TEXT NOT NULL,
        detail TEXT NOT NULL,
        urlPicture TEXT NOT NULL
    );`;

    try {
        await pool.query(query);
        console.log('✅ Tabla creada exitosamente.');
    } catch (err) {
        console.error('❌ Error al crear la tabla:', err);
    } finally {
        pool.end();
    }
};

createTable();
