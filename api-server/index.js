const express = require('express');
const {minNumber, maxNumber, avgValue, sortArray, searchNumber} = require('./util');

const app = new express();
const port = 3000;
const greeting = {message : "Hello Node" };

app.get('/number/min', (req, res) => {
    const minNum = minNumber(req, res);
});

app.get('/number/max', (req, res) => {
   const maxNum = maxNumber(req, res);
})

app.get('/number/avg' , (req,res) =>{
    const avg = avgValue (req,res);
})

app.get('/number/sort', (req, res) => {
    const sortedArray = sortArray(req, res);
});

app.get('/number/count', (req, res) => {
    const searchResult = searchNumber(req, res);
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})