const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://osamabittar2:Tet1vYFHyBF5XgAg@cluster0.ln3s2.mongodb.net/myDatabaseName?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas and the database myDatabaseName!');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
    });
