// Require express to make easy
// routing on server side.
const express = require("express");

// Creating express object
const app = express();

// Require path module
const path = require('path');

// Require pug template engine
var bodyParser=require("body-parser");

// Require mongoose to use mongoDb
// in a easier way
const mongoose = require("mongoose");

const { check, validationResult } = require('express-validator');

// Define a port number
const port = 3000;

// Make a static route to use your
// static files in client side
app.use('/static', express.static('static'));

// Middleware for parsing
app.use(express.urlencoded());

// Define and use pug engine so also
// declare path on rendering
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database Connection
mongoose.connect(
	"mongodb://localhost:27017/feedback",
	{ useUnifiedTopology: true }
);
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
	console.log("connection succeeded");
})
app.post('/index', function(req,res){
	var name = req.body.name;
	var email =req.body.email;
	var pass = req.body.password;
	

	var data = {
		"name": name,
		"email":email,
		"password":pass,		
	}
db.collection('details').insertOne(data,function(err, collection){
		if (err) throw err;
		console.log("Record inserted Successfully");
			
	});
		
	return res.render('signup');
})

// Create schema
const feedSchecma = mongoose.Schema({
	name: String,
	email: String,
	Manager: String,
	q1: Number,
	q2: Number,
	q3: Number,
	q4: Number,
	q5: Number,
	q6: Number,
	q7: Number,
	feedi: String

});

// Making a modal on our already
// defined schema
const feedModal = mongoose
	.model('feeds', feedSchecma);
app.get('/', function (req, res) {
		// Rendering your form
		res.render('home_page');
	});

	app.get('/index', function (req, res) {
		// Rendering your form
		res.render('index');
	});
	
	app.get('/contents_of_frame1', function (req, res) {
		// Rendering your form
		res.render('contents_of_frame1');
	});

	app.get('/home', function (req, res) {
		// Rendering your form
		res.render('home');
	});
		

// Handling get request
app.get('/login', function (req, res) {
	// Rendering your form
	res.render('login');
});

//login check
app.post('/login', async(req, res) =>{
	try{
		const name= req.body.name;
		const email= req.body.email;
		
		//console.log($email1,'hiii');
		const useremail = await feedModal.findOne({email:email});
		//console.log('${useremail} hiiiii');
		if(useremail.name == name)
		{
			res.status(201).render("feedback_form");
		} else{
			res.send("password are ot matching");
		}

	} catch(error) {
		res.status(400).send("Invalid login details")
	}
	
});
app.get('/feedback_form', function (req, res) {
	// Rendering your form
	res.render('feedback_form');
});

// Handling data after submission of form
app.post("/feedback_form",  function (req, res) { 
	  
	const feedData = new feedModal({
		name: req.body.name,
		email: req.body.email,
		Manager: req.body.Manager,
		q1: req.body.q1,
		q2: req.body.q2,
		q3: req.body.q3,
		q4: req.body.q4,
		q5: req.body.q5,
		q6: req.body.q6,
		q7: req.body.q7,
		feedi: req.body.feedi

	});
	feedData.save()
		.then(data => {
			res.render('feedback_form',
{ msg: "Your feedback successfully saved." });
		})
		.catch(err => {
			res.render('feedback_form',
				{ msg: "Check Details." });
		});
})

// Server setup
app.listen(port, () => {
	console.log("server is runing");
});
