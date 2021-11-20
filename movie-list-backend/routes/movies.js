const fs = require('fs');
const express = require("express");
const router = express.Router();
const axios = require('axios');

let movies = require("../movies.json");
let users = require("../users.json");

router.get("/list/:title", async (req, res) => {
    let { title } = req.params;
    title = String(title).trim().split(' ').join('%20');
    axios.get('https://www.omdbapi.com/?s='+title+'&apikey=bff39d8f')
    .then(response => {
        // console.log('yooo',response.data.status);
        // console.log(response.data);
        // console.log('yo man',response);
        var ratings = [];
        if(response.data.Response !== 'False'){
            response.data.Search.forEach(e => {
                let m = movies.find(movie => movie.id === e.imdbID);
                if(!m){
                    m = {"id":e.imdbID,"upvote":0,"downvote":0};
                    let temp = movies;
                    temp.push(m);
                    fs.writeFileSync("movies.json", JSON.stringify(temp));
                }
                ratings.push(m)
            });
            response.data["Rating"] = ratings;
            res.send(response.data);       
        }
        else{
            res.send(response.data);
        }
    })
    .catch(error => {
        console.log(error);
    });
  });
router.get("/userID", async (req, res) => {
    try {
        let temp = users;
        let newUser = {id: users[users.length-1].id+1, upvote:[], downvote:[]}
        res.status(200).json({
        data: newUser.id
        });
        temp.push(newUser); 
        fs.writeFileSync("users.json", JSON.stringify(temp));
    } catch (err) {
        res.status(400).json({
        message: "Some error occured",
        err
        });
    }
});

router.get("/:id", async (req, res) => {
    let { id } = req.params;
    id = String(id);
    try {
      let movie = movies.find(movie => movie.id === id);
      if(!movie){
          movie = {"id":id,"upvote":0,"downvote":0};
      }
      res.status(200).json({
        data: movie
      });
    } catch (err) {
      res.status(400).json({
        message: "Some error occured",
        err
      });
    }
  });

router.get("/user/:id", async (req, res) => {
    let { id } = req.params;
    id = Number(id);
    let upvotes = [];
    let downvotes = [];
    let promises = [];
    let user = users.find(user => user.id === id);
    for(let i = 0; i < user.upvote.length; i++){
        promises.push(
            axios.get('https://www.omdbapi.com/?i='+user.upvote[i].movieId+'&apikey=bff39d8f')
            .then(response => {
                let movie = movies.find(movie => movie.id === user.upvote[i].movieId);
                let temp = response.data
                temp['upvote'] = movie.upvote;
                temp['downvote'] = movie.downvote;
                upvotes.push(temp)
            })    
            .catch(error => {
                console.log(error);
            })
        )
    }
    for(let i = 0; i < user.downvote.length; i++){
        promises.push(
            axios.get('https://www.omdbapi.com/?i='+user.downvote[i].movieId+'&apikey=bff39d8f')
            .then(response => {
                let movie = movies.find(movie => movie.id === user.downvote[i].movieId);
                let temp = response.data 
                temp['upvote'] = movie.upvote;
                temp['downvote'] = movie.downvote;
                downvotes.push(temp)
            })    
            .catch(error => {
                console.log(error);
            })
        )
    }
    Promise.all(promises).then(() => {
        res.send({upvotes, downvotes});
    });
    // try {
    // //   let user = users.find(user => user.id === id);
    //   res.status(200).json({
    //     data: {upvotes,downvotes}
    //   });
    // } catch (err) {
    //   res.status(400).json({
    //     message: "Some error occured",
    //     err
    //   });
    // }
  });

router.post("/post",(req,res) => {
    if(req.body.type === "upvote"){
        let tempUsers = users;
        let tempMovies = movies;
        tempUsers.forEach(e => {
            if(e.id === req.body.user){
                var exists = false;
                for(let i = 0; i < e.upvote.length; i++){
                    if(e.upvote[i].movieId === req.body.movie){
                        e.upvote.splice(i,1);
                        exists = true;
                    }
                }
                if(!exists){
                    e.upvote.push({movieId: req.body.movie})
                    let votedOtherSide = false;
                    for(let i = 0; i < e.downvote.length; i++){
                        if(e.downvote[i].movieId === req.body.movie){
                            e.downvote.splice(i,1);
                            votedOtherSide = true;
                            tempMovies.forEach(e => {
                                if(e.id === req.body.movie){
                                    e.downvote = e.downvote - 1;
                                    e.upvote = e.upvote + 1;
                                }
                            });
                            break;
                        }
                    }
                    if(!votedOtherSide){
                        tempMovies.forEach(e => {
                            if(e.id === req.body.movie){
                                e.upvote = e.upvote + 1;
                            }
                        })
                    }
                }
                else{
                    tempMovies.forEach(e => {
                        if(e.id === req.body.movie){
                            e.upvote = e.upvote - 1;
                        }
                    });
                }
            }
        });
        fs.writeFileSync("users.json", JSON.stringify(tempUsers));
        fs.writeFileSync("movies.json", JSON.stringify(tempMovies));
    }
    else if(req.body.type === "downvote"){
        let tempUsers = users;
        let tempMovies = movies;
        tempUsers.forEach(e => {
            if(e.id === req.body.user){
                var exists = false;
                for(let i = 0; i < e.downvote.length; i++){
                    if(e.downvote[i].movieId === req.body.movie){
                        e.downvote.splice(i,1);
                        exists = true;
                    }
                }
                if(!exists){
                    e.downvote.push({movieId: req.body.movie})
                    let votedOtherSide = false;
                    for(let i = 0; i < e.upvote.length; i++){
                        if(e.upvote[i].movieId === req.body.movie){
                            e.upvote.splice(i,1);
                            votedOtherSide = true;
                            tempMovies.forEach(e => {
                                if(e.id === req.body.movie){
                                    e.upvote = e.upvote - 1;
                                    e.downvote = e.downvote + 1;
                                }
                            });
                            break;
                        }
                    }
                    if(!votedOtherSide){
                        tempMovies.forEach(e => {
                            if(e.id === req.body.movie){
                                e.downvote = e.downvote + 1;
                            }
                        })
                    }
                }
                else{
                    tempMovies.forEach(e => {
                        if(e.id === req.body.movie){
                            e.downvote = e.downvote - 1;
                        }
                    });
                }
            }
        });
        fs.writeFileSync("users.json", JSON.stringify(tempUsers));
        fs.writeFileSync("movies.json", JSON.stringify(tempMovies));
    }
    // res.end("yes");
    res.status(200).json({
        message: "Vote Processed."

    });
});
module.exports = router;