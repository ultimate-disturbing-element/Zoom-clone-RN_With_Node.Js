const express = require("express");
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server)

const port = 3000
let users = []

app.get('/',(req,res)=>{
    res.send("hello World")
});

const addUsers = (userName,roomId) => {
    users.push({
        userName:userName,
        roomId:roomId
    })
}
const userLeave = (userName) => {
    users = users.filter((user)=>user.userName != userName)
}

const getAllUsers = (roomId) => {
    return users.filter(user =>(user.roomId == roomId))
}



io.on("connection",socket => {
    console.log("Someone Connected")
    socket.on("join-room",({roomId,userName})=>{
        console.log("User Joined Room")
        console.log(roomId)
        console.log(userName)
        if(roomId && userName){
        socket.join(roomId)
        addUsers(userName,roomId)
        socket.to(roomId).emit('user-connected',userName)

        io.to(roomId).emit("all-users",getAllUsers(roomId))
        }
        socket.on("disconnect",()=>{
            console.log("disconnected");
            socket.leave(roomId);
            userLeave(userName)
            io.to(roomId).emit("all-users",getAllUsers(roomId))
        })
    })
})

server.listen(port,()=>{
    console.log(`Zoom-clone Api listening on localhost ${port}`);
});