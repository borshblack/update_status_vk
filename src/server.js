const express = require('express');
const app = express();

app.listen(3000, () => {
    console.log('Server has been listened');
});

app.get('/', (res, rej) => {
    res.send('ok');
});