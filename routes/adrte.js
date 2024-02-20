const express = require('express');
const router = express.Router();
const animeController = require('./animeController');
const animeModel = require('./animeModel');
const commentModel = require('./commentModel');
const adminControllers = require('./adminController');
const xss = require('xss')

const isAdminLogin = function (req) {
    return 	!req.session.admin;
};

router.get('/', async (req,res) => {
	if(!!isAdminLogin(req)){return res.redirect('/admin/login')}
	let foundAnime = await animeModel.find();
	let ams= [];
	for(let i=0; i<foundAnime.length; i++){
		ams.push(foundAnime[i].title_name)
	}
	return res.render("admin/index", {ams:ams, admin:'navbar'});
})
router.get('/delete/:title', async (req,res) => {
	if(!!isAdminLogin(req)){return res.redirect('/admin/login')}
    let found = await animeModel.deleteOne({name:req.params.title})
	if(!found || found.length==0){
		res.status(400).render('admin/index',{'message':'Could not delete data'});
	}
	res.status(200).render('admin/index', {admin:'navbar', message:'Sucessfully Deleted'})

})

router.get('/find/:title', async (req,res) => {
	if(!!isUserlogin(req)){return res.redirect('/login')}
	let ans = await animeModel.findOne({title_name:req.params.title})
	let ser = [];
	if(ans.comments.length<0 || !ans){
		return res.render('admin/find', {'admin':"fo" , message:'There is no Title'})
	}
	for(let i=0; i<ans.comments.length; i++){
		let result = await commentModel.findOne({_id: ans.comments[i]})
		let andis = {id: result.propertyid, review: result.text}
		ser.push(andis)
	}
	if(!ans || ans.length<0){
		return res.render('admin/find', {message:'There is no Title', admin:"fgh"})
	}
	let navbar='not empty';
	return res.render("admin/find", {title_name: ans.title_name, anime_description: ans.anime_description, anime_status: ans.anime_status, rating: ans.rating, episodes: ans.episodes, duration: ans.duration, result: ser, admin: navbar});
});

router.get('/createAnime', animeController.createAnimeGet);
router.post('/createAnime', animeController.createAnimePost);
router.get('/create',  adminControllers.createUserGet);
router.post('/create', adminControllers.createUserPost);
router.get('/login',  adminControllers.loginGet);
router.post('/login', adminControllers.loginPost);
router.get('/logout', adminControllers.logout);

module.exports = router;