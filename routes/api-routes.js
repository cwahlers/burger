// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

    // GET route for getting all of the items
  app.get("/api/items/:devour", function(req, res) {
    // findAll returns all entries for a table when used with no options
    db.Item.findAll({where: {devoured: req.params.devour} }).then(function(dbItem) {
      // We have access to the Items as an argument inside of the callback function
      res.json(dbItem);
    });
  });


  // POST route for saving a new item
  app.post("/api/items", function(req, res) {
    // create takes an argument of an object describing the item we want to
    // insert into our table. In this case we just we pass in an object with a text
    // and complete property
    db.Item.create({
      burger_name: req.body.burger_name,
      devoured: req.body.devoured
    }).then(function(dbItem) {
      // We have access to the new todo as an argument inside of the callback function
      res.json(dbItem);
    });
  });

  // DELETE route for deleting todos. We can get the id of the todo to be deleted from
  // req.params.id
  app.delete("/api/items/:id", function(req, res) {
    // Use the sequelize destroy method to delete a record from our table with the
    // id in req.params.id. res.json the result back to the user
    db.Item.destroy({where: {id: req.params.id}}).then(function(dbItem){
      res.json(dbItem);
    });
  });

  // PUT route for updating todos. We can get the updated todo data from req.body
  app.put("/api/items", function(req, res) {
    // Use the sequelize update method to update a todo to be equal to the value of req.body
    // req.body will contain the id of the todo we need to update
    var upItem = {
      burger_name: req.body.burger_name,
      devoured: req.body.devoured
    };
    db.Item.update(upItem, {where: {id: req.body.id}}).then(function(dbItem){
      res.json(dbItem);
    });
  });
};
