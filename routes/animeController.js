const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const animeModel = require('./animeModel');
const commentModel = require('./commentModel');
const xss = require('xss');


module.exports = {
	createAnimeGet:(req,res) => {
		res.status(200).render('animeform', {navbar: 'navbar' });
	},
	

	createAnimePost:async(req,res)=>{
		// console.log(req.body.title_name)
		let newAnime = new animeModel(req.body);
		let saveAnime = await newAnime.save();
		res.render('animeform', {'message':"Anime Created Successfully", navbar:'dgycuhi'});

	},
	getAllAnime:async(req,res)=>{
		let foundAnime = await animeModel.find();
		if(!foundAnime || foundAnime.trim().length==0){
			res.status(400).render('index',{message:'there is no data to show'});
		}
		res.send(foundAnime)
	},
	find: async(req,res) => {
		let found = await animeModel.findOne({title_name:req.params.title})
		if(!found || found.trim().length==0){
			res.status(400).render('find',{'message':'Could not find any data'});
		}
		res.send(found)
	},
	deletePost:async(req,res)=>{
		let found = await animeModel.deleteOne({title_name:req.params.title})
		if(!found || found.trim().length==0){
			res.status(400).render('index',{'message':'Could not delete data'});
		}
		res.status(200).message('Done').redirect('/')
	},

	// add this thing to the anime table.
	commentGet:(req,res)=>{
		res.status(200).render("find");
	},
	
	createComment:async(req,res)=>{
		if(!req.body.title || req.body.title.trim().length==0 || !req.body.review || req.body.review.trim().length==0){
			res.status(400).render('find',{message:"Empty Data is not Valid"})
		}
		// let newcomment = await commentModel(req.body);
		let a2 = await commentModel({ propertyid: xss(req.body.title), text: xss(req.body.review)});
		await a2.save();
		let more = await animeModel.findOneAndUpdate({title_name:req.params.title},{$push:{comments:a2}});
		if(!more || more.length==0){
			res.status(400).render('find',{message:"Could not add Data"})}
		res.status(200).redirect('/find/'+req.body.title)
	}

}




