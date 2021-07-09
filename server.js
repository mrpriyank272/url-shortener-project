const express = require("express");
const mongoose = require("mongoose")
const shorturl = require('./models/shorturl')
const app = express();

mongoose.connect('mongodb://localhost/urlshortener', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async(req,res) =>{
    const shorturls = await shorturl.find()
    res.render('index', { shorturls: shorturls})
})

app.post('/shorturls', async(req,res) =>{
   await shorturl.create({full: req.body.fullurl })
   res.redirect('/')
})

app.get('/:shorturl', async(req,res) =>{
    const shortyurl = await shorturl.findOne({ short: req.params.shorturl })
    if (shortyurl == null) return res.sendStatus(404)

    shortyurl.clicks++
    shortyurl.save()

    res.redirect(shortyurl.full)
})

app.listen(5000,() =>{
    console.log("Server started")
})