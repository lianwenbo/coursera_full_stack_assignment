var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(Verify.verifyOrdinaryUser, function(req,res,next){
        Favorites.find({'postedBy': req.decoded._doc._id})
       .populate('postedBy')
       .populate('dishes')
        .exec(function (err, favorite) {
        if (err) throw err;
        res.json(favorite);
    });
})

.post(Verify.verifyOrdinaryUser, function(req, res, next){
    Favorites.find({'postedBy': req.decoded._doc._id})
        .exec(function (err, favorites) {
        if (err) throw err;
        req.body.postedBy = req.decoded._doc._id;
        if (favorites.length){
            var favorite_exists = false;
            if (favorites[0].dishes.length) {
                for (var i = (favorites[0].dishes.length - 1); i >= 0; i--) {
                            favorite_exists = favorites[0].dishes[i] == req.body._id;
                            if (favorite_exists) break;
                        }
            }
            if (!favorite_exists) {
                favorites[0].dishes.push(req.body._id);
                favorites[0].save(function (err, favorite) {
                    if (err) throw err;
                    console.log('setting success!');
                    res.json(favorite);
                });
            } else {
                console.log('dish exists!');
                res.json(favorites);
            }
        } else{
            Favorites.create({postedBy: req.body.postedBy}, function (err, favorite) {
                if (err) throw err;
                favorite.dishes.push(req.body._id);
                favorite.save(function (err, favorite) {
                    if (err) throw err;
                    console.log('setting success!');
                    res.json(favorite);
                });
            });
        }
    });
})

.delete(Verify.verifyOrdinaryUser, function(req, res, next){
        Favorites.remove({'postedBy': req.decoded._doc._id}, function (err, resp) {
            if (err) throw err;
            console.log('deleted all favorites')
            res.json(resp);
        });
});

favoriteRouter.route('/:dishId')
    .all(Verify.verifyOrdinaryUser)
    .delete(function (req, res, next) {
        Favorites.find({'postedBy': req.decoded._doc._id}, function (err, favorites) {
            if (err) return err;
            var favorite = favorites ? favorites[0] : null;
            deleted = false;
            if (favorite) {
                for (var i = (favorite.dishes.length - 1); i >= 0; i--) {
                    if (favorite.dishes[i] == req.params.dishId) {
                        favorite.dishes.remove(req.params.dishId);
                        deleted = true;
                    }
                }
                favorite.save(function (err, favorite) {
                    if (err) throw err;
                    if (deleted){
                        console.log('delete the ' + req.params.dishId + '!');
                    } else {
                        console.log('the dish ' + req.params.dishId + ' not exists!');
                    }
                    res.json(favorite);
                });
            } else {
                console.log('No favourites for user' + req.decoded._doc._id + '!');
                res.json(favorite);
            }
        })
    });

module.exports = favoriteRouter;