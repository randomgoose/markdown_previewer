const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Host static files
app.use(express.static(__dirname));

// Initialise body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect('mongodb+srv://ced:ced123@cluster0-lzbcg.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    console.log('Database connected.')
});

const Document = mongoose.model('Message', {
    content: String,
    // time: Date,
    author: String
});




app.post('/save', (req, res) => {
    let document = new Document(req.body);
    console.log(document);
    document.save();
    res.sendStatus(200);
});

app.listen(3000, ()=>{
    console.log('The application is listening on port 3000.')
});


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://ced:<password>@cluster0-lzbcg.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });
