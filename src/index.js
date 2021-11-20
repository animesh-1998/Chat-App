const express = require('express');
const path = require('path');
const http = require('http');
const {Server} = require('socket.io');
const {generateMessage,generateLocationMessage} = require('./utils/message')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users');

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static(path.join(__dirname,'../public')));

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'../public/index.html');
})

let msg;
io.on('connection',(socket)=>{
    console.log("New websocket connection");
    
    socket.on('join',({username,room}, callback)=>{
        const {error,user}= addUser({id:socket.id,username,room});
        if(error){
            return callback(error);
        }
        socket.join(user.room);
        socket.emit('message',generateMessage("Admin","Welcome!"));
        socket.broadcast.to(user.room).emit('message',generateMessage("Admin",user.username+' has joined!'));
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
    })
    socket.on('sending',(enteredtext,callback)=>{
        const user = getUser(socket.id);
        msg=enteredtext;
        if(user){
            io.to(user.room).emit('message',generateMessage(user.username,msg));
            callback("Delivered");
        }
        
    })
    socket.on('sendlocation',(location,callback)=>{
        const user = getUser(socket.id);
        if(user){
            io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`));
            callback();
        }
        
    })
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message',generateMessage(user.username,user.username+' has disconnected!'));
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
        
    })
    
})

server.listen(port,()=>{
    console.log("Server is running on port "+port);
});