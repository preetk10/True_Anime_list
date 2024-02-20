// Routes for crud manipulation with anime
const express = require('express');
const router = express.Router();
const animeController = require('./animeController');
const animeModel = require('./animeModel');
const commentModel = require('./commentModel')
const usersModel = require('./usersModel')
const xss = require('xss');
let { ObjectId } = require('mongodb');
const isUserlogin = function (req) {
    return 	!req.session.user;
};

router.get('/', async (req,res) => {
	if(!!isUserlogin(req)){return res.redirect('/login')}
	let foundAnime = await animeModel.find();
	let ams= [];
	for(let i=0; i<foundAnime.length; i++){
		ams.push(foundAnime[i].title_name)
	}
	navbar='not empty'
	return res.render("../views/index", {ams:ams, navbar:navbar});
})

router.get('/profiles', async (req,res) => {
	if(!!isUserlogin(req)){return res.redirect('/login')}
	let foundAnime = await usersModel.find();
	let amd =[];
	for(let i=0; i<foundAnime.length; i++){
		let name = foundAnime[i].first_name + foundAnime[i].last_name;
		let list = foundAnime[i].list;
		let id = foundAnime[i]._id;
		let newobj = {id:id, name: name, list:list}
		amd.push(newobj)
		
	}
	if(amd.length==0 || !amd){
		res.render('profiles', {message:'No data Available'})
	}
	return res.render("profiles", {result:amd, navbar:'navbar'});
})

router.post('/addtolist', async (req,res) => {
	if(!!isUserlogin(req)){return res.redirect('/login')}
	let ans = await animeModel.findOne({title_name:xss(req.body.title)})
	let uid = req.session.user; 
	let id = ans._id;
	let oldlist = [];
	oldlist = ans.list;
	if(!ans.list || ans.list.length<0){
		oldlist=[]
	}
	oldlist.push(id)
	console.log(oldlist)
	let more = await usersModel.findOneAndUpdate({_id: uid},{$push:{list:oldlist}});
	if(!more || more.length<0){
		return res.render('list', {message:'There is no Title'})
	}
	return res.render('list', {message:'Sucessfully added to your list', navbar:'navbar'})
});

router.get('/list', async (req,res) => {
	if(!!isUserlogin(req)){return res.redirect('/login')}
	let ans = await usersModel.findOne({_id:req.session.user})
	let list = ans.list;
	let anslist = []
	if(list.length==0 || !list.length){
		res.render('list', {message:'No data available', navbar:'dyfg'})
	}
	for(let i=0; i<list.length; i++){
		let nameoflist = await animeModel.findOne({_id:ObjectId(ans.list[i])})
		console.log(nameoflist)
		let ename = nameoflist.title_name;
		anslist.push(ename);
	}
	let oldlist = ans.list;
	if(!oldlist || oldlist.length<0){
		return res.render('list', {message:'There is no list to show'})
	}
	return res.render('list', {result: anslist, navbar:'navbar'})
});

router.get('/list/:user', async (req,res) => {
	if(!!isUserlogin(req)){return res.redirect('/login')}
	let ans = await usersModel.findOne({_id:req.params.user})
	console.log(ans.list)
	let list = ans.list;
	if(list.length==0 || !list.length || !list){
		res.render('list', {message:'No data available', navbar:'dyfg'})
	}
	let anslist = [];
	for(let i=0; i<list.length; i++){
		let nameoflist = await animeModel.findOne({_id:ObjectId(list[i])})
		console.log(nameoflist)
		let ename = nameoflist.title_name;
		anslist.push(ename);
	}
	let oldlist = ans.list;
	if(!oldlist || oldlist.length<0){
		return res.render('list', {message:'There is no list to show'})
	}

	return res.render('list', {result: anslist, navbar:'navbar'})
});

router.get('/find/:title', async (req,res) => {
	if(!!isUserlogin(req)){return res.redirect('/login')}
	let ans = await animeModel.findOne({title_name:req.params.title})
	let ser = [];
	if(ans.length<0 || !ans){
		return res.render('find', {message:'There is no Title'})
	}
	for(let i=0; i<ans.comments.length; i++){
		let result = await commentModel.findOne({_id: ans.comments[i]})
		let andis = {id: result.propertyid, review: result.text}
		ser.push(andis)
	}
	if(!ans || ans.length<0){
		return res.render('find', {message:'There is no Title'})
	}
	let navbar='not empty';
	return res.render("find", {title_name: ans.title_name, anime_description: ans.anime_description, anime_status: ans.anime_status, rating: ans.rating, episodes: ans.episodes, duration: ans.duration, result: ser, navbar: navbar});
});
router.get('/createAnime', animeController.createAnimeGet);
router.post('/createAnime', animeController.createAnimePost);
router.get('/getall', animeController.getAllAnime);
// router.get('/find/:title',animeController.find);

router.get('/comment/:title',animeController.commentGet);
router.post('/comment/:title',animeController.createComment);
const userControllers = require('./userControllers');
// User Routes
router.get('/login',  userControllers.loginGet);
router.post('/login', userControllers.loginPost);
router.get('/create',  userControllers.createUserGet);
router.post('/create', userControllers.createUserPost);
router.get('/logout',userControllers.logout);



module.exports = router;