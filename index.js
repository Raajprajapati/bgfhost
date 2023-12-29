const express = require('express');
const connectDB = require('./db/connection.js');
const cors = require('cors');
const app = express();
const Player = require('./models/playerSchema.js');
const dotenv = require('dotenv');
const path = require('path')
dotenv.config({path: './.env'})


app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname,'./client/dist')))

connectDB()


app.get('*',(req, res)=>{
  res.sendFile(path.join(__dirname, './client/dist'));
})

//  add a new player:  POST /players
app.post('/players', async (req, res) => {
  try {
    new Player(req.body).save();
    res.status(201).send({
      sucess: true,
      message: "Sucessfull",
    });
  } catch (error) {
    res.status(400).send({
      sucess: false,
      error: error.message
    });
  }
});

// Update players data: PUT /players/:id
app.put('/players/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const player = await Player.findByIdAndUpdate(id, {
      $set: {
        name: req.body.name,
        score: req.body.score
      }
    },
      { new: true }
    );
    if (!player) {
      throw new Error('Player not found');
    }
    res.status(201).send({
      success: true,
      player
    });

  } catch (error) {
    res.status(404).send({
      sucess: false,
      error: error.message
    });
  }
});

// delete a player: DELETE /players/:id
app.delete('/players/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const player = await Player.findByIdAndDelete(id);

    if (!player) {
      throw new Error('Player not found');
    }
    res.status(200).send({
      sucess: true,
      message: 'Player deleted successfully'
    });
  } catch (error) {
    res.status(404).send({
      sucess: false,
      error: error.message
    });
  }
});

// get players data:  GET /players
app.get('/players', async (req, res) => {
  try {
    const players = await Player.find().sort({ score: -1 });
    return res.send({
      success: true,
      message: "successful",
      data: players
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// get player by rank:  GET /players/rank/:val
app.get('/players/rank/:val', async (req, res) => {
  const { val } = req.params;
  try {
    const player = await Player.findOne().sort({ score: -1 }).skip(val - 1);

    if (!player) {
      throw new Error('Player not found');
    }
    res.status(200).send({
      success: true,
      player
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      error: error.message
    });
  }
});

// get a rnadom player:  GET /players/random
app.get('/players/random', async (req, res) => {
  try {
    const randomPlayer = await Player.aggregate([{ $sample: { size: 1 } }]);

    if (!randomPlayer) {
      throw new Error('Player not found');
    }

    res.status(200).send({
      success: true,
      randomPlayer
    });

  } catch (error) {
    res.status(404).send({
      success: false,
      error: error.message
    });
  }
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log("server is running");
})