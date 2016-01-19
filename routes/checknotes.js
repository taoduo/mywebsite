var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Note = require(__dirname + '/../public/javascripts/note_model.js');
//to show all notes
router.get('/', function(req, res, next) {
	mongoose.connect('mongodb://localhost/test');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function(callback) {
		Note.find({}, function(err, notes) {
			if(err) {
				console.log('error in query:' + err);
				return;
			}
			mongoose.connection.close();
			notes = notes.reverse();
			res.render('checknotes', {notes:notes});
		}).sort('date');
	});
});
//to update a note
router.post('/', function(req, res, next) {
	var details = req.body.details;
	var title = req.body.title;
	var keywords = req.body.keywords;
	var tag = req.body.tag;
	var date = new Date();
	var regex = new RegExp('[，,] ?');
	var regex1 = new RegExp('\(#([^)]+)\)');
	var matches = regex1.exec(req.body.id);
	var id = matches[2];
	mongoose.connect('mongodb://localhost/test');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function(callback) {
		Note.findById(id, function (err, note) {
			if (err) {
				mongoose.connection.close();
				console.log(err);
				return;
			} else {
				note.date = date;
				note.details = details;
				note.keywords = keywords.split(regex);
				note.tag = tag;
				note.title = title;
				note.save(function(err){
					if(err){
						mongoose.connection.close();
						console.log(err);
						return;
					} else {
						mongoose.connection.close();
						res.send(note);
					}
				});
			}
		});
	});
});
//to delete a note
router.delete('/', function(req, res, next) {
	mongoose.connect('mongodb://localhost/test');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
		Note.remove({'_id': req.body.id}, function(err) {
			if(err) {
				console.log(err);
				res.send('err');
				return;
			}
			mongoose.connection.close();
			res.send('deleted');
		});
	});
});
module.exports = router;
