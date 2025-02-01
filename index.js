const { app } = require('./app');

const PORT = process.env.PORT || 3222;

app.listen(PORT, () =>{
    console.log(`Server running on ${PORT}`);
});