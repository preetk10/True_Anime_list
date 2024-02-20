const mongoose = require('./app')
const animeModel = require('./routes/animeModel');


//Seed Data
// Title
// Description,Type,Status,Rating,Episodes,Duration


const main = async () => {
    const db = mongoose.connection;
    let data = new animeModel({title_name:"Naruto",
    anime_description:"Naruto Uzumaki, a hyperactive and knuckle-headed ninja, lives in Konohagakure, the Hidden Leaf village. Moments prior to his birth, a huge demon known as the Kyuubi, the Nine-tailed Fox, attacked Konohagakure and wreaked havoc. In order to put an end to the Kyuubi's rampage, the leader of the village, the 4th Hokage, sacrificed his life and sealed the monstrous beast inside the newborn Naruto.",
    anime_type:"Action",
    anime_status:"Completed",
    rating:5,
    episodes:220,
    duration:23});
    let saveAnime = await data.save();

};

main();
