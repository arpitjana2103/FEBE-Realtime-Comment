const express = require('express');
const mongoose = require('mongoose');
const {connection} = require('./db.js');
require('dotenv').config();
const app = express();
const port = process.env.PORT;
const {CommentModel} = require('./Model/comment.model.js');

app.use(express.static('public'));
app.use(express.json());

// Routes
app.post('/api/comments', async function (req, res) {
    try {
        req.body.time = Date();
        const comment = new CommentModel(req.body);
        await comment.save();
        return res.status(200).json({
            status: 'ok',
            message: 'Message Posted Successfully',
            comment: comment,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
});

app.get('/api/comments', async function(req, res){
    try {
        const comments = await CommentModel.find();
        res.status(200).json({
            status: 'ok',
            comments: comments
        })

    }catch(err){
        return res.status(400).json({
            status: 'fail',
            error: err.message
        })
    }
})

// Server
const server = app.listen(port, async function () {
    console.log('Connecting with Database...');
    await connection;
    console.log(`Server URL: http://localhost:${port}`);
});

const io = require('socket.io')(server);

io.on('connection', function (socket) {
    socket.on('comment', function (data) {
        data.time = Date();
        socket.broadcast.emit('comment', data);
    });

    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
    });
});
