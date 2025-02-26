const express = require('express');
const {minNumber, maxNumber} = require('./util');

const app = new express();
const port = 3000;
const greeting = {message : "Hello Node" };

app.get('/number/min', (req, res) => {
    const minNum = minNumber(req, res);
});

app.get('/number/max', (req, res) => {
   const maxNum = maxNumber(req, res);
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})