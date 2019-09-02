// import express from 'express' //ES2015 Modules
const express = require("express");

//import the hubs-model file
const Hubs = require("./data/hubs-model"); // we'll use hubs to get access to the DataBase
// Hubs has a find(), findById(), add(), remove(), and update() methods

const server = express();

server.use(express.json()); //add this line to teach express to parse JSON

server.get("/", (request, response) => {
  response.send("hello web 21");
});

//see a list of Hubs (channel on slack)
server.get("/hubs", (request, response) => {
  Hubs.find()
    //Hubs.find() returns a promise so we need .then() and .catch()
    .then(hubs => {
      response.status(200).json(hubs);
    })
    .catch(error => {
      response.status(500).json({ message: "error getting list of hubs" });
    });
});
//create a Hub
server.post("/hubs", (request, response) => {
  //axios.post('/hubs, hubData).then().catch()
  //http message is an object with headers and body => { headers: {}, body: { //data sent by client }}
  const hubInformation = request.body;

  console.log("Hub info from body", hubInformation);

  Hubs.add(hubInformation)
    .then(hub => {
      response.status(201).json(hub);
    })
    .catch(error => {
      response.status(500).json({ message: "error handling the hub" });
    });
});
//delete a Hub /hubs/6
server.delete("/hubs/:id", (request, response) => {
  const hubId = request.params.id;

  Hubs.remove(hubId)
    .then(hub => {
      response.status(201).json({ message: "hub deleted successfully" });
    })
    .catch(error => {
      response.status(500).json({ message: "error removing the hub" });
    });
});
//update a Hub
server.put("/hubs/:id", (request, response) => {
  const { id } = request.params;
  const changes = request.body;

  Hubs.update(id, changes)
    .then(updated => {
      if (updated) {
        response.status(200).json(updated);
      } else {
        response.status(404).json({ message: "hub not found" });
      }
    })
    .catch(error => {
      response.status(500).json({ message: "error updating hub" });
    });
});

const port = 8000;
server.listen(port, () => console.log("api running"));
