#!/usr/bin/node
const express = require('express');
const app = express();
const port = 8080;
const handlebars = require('express-handlebars');
var routeTest = require('./routes/index')
const htmlJson = require('./models/htmlToJson')

const hbs = handlebars.create({
    extname: 'hbs',
    defaultLayout: 'main',
    //Creating a custom helper
    helpers: {
        decodeUri: value =>{
            return decodeURI(value);
        },
        encodeTitle: value =>{
            return '/blog/'+value.replace(/ /g, '-');
        },
        formatTitle: value =>{
            return value.replace(/ /g, '-')
        }

    }
})
//Loads the handlebars module


//Sets our app to use the handlebars engine
//Sets handlebars configurations (we will go through them later on)
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.set('views', `${__dirname}/views`)

//var test = htmlJson();

app.use(express.static('public'))

app.use('/', routeTest)
setInterval(htmlJson.submitPost, 1000 * 60 * 60)

app.listen(port, () => console.log(`App listening to port ${port}`));
