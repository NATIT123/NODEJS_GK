const express = require("express");
const app  = express();
const db=require("./config/mongodb");
require('dotenv').config();

const index=require("./routes/index");
const user=require("./routes/users");

const PORT = process.env.PORT 
const { Server } = require("socket.io");
const path = require("path");

const ADMIN = process.env.Role

const NODE_ENV=process.env.NODE_ENV

const URL=process.env.URL;
db.connect(URL);
const configViewEngine=require("./config/viewEngine");
configViewEngine(app);
app.use("/",index);
app.use("/users",user);


const expressServer = app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})


app.use((err, req, res, next) => {
    console.error('** SERVER ERROR: ' + err.message)
    res.status(500).render('500', { message:err.message })
    })

app.use((req,res) =>{
    res.status(404).render("404",{title:"Something went wrong",message:"Page not found",layout:false});
  });

// Trang thai Users
const UsersState = {
    users:[],
    setUsers: function(newUserList){
        this.users = newUserList 
    }
}
const io = new Server(expressServer,{
    cors:{
        origin: NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
})

io.on('connection', socket =>{
    console.log(`User ${socket.id} connected`)

    //Thong bao khi co User ket noi
    socket.emit('message',messBlock(ADMIN,"Welcom to chat application"))

    socket.on('joinRoom', ({name, room})=>{
        const preRoom = getUser(socket.id)?.room
        if(preRoom){
            socket.leave(preRoom)
            io.to(preRoom).emit('message', messBlock
            (ADMIN, `${name} has left the room`))
        }
        const user = activateUser(socket.id, name, room)
        
        //Kiem tra su ton tai cua phong va gui trang thai phong toi tat ca nguoi dung
        if (preRoom) {
            io.to(preRoom).emit('userList', {
                users: getUsersInRoom(preRoom)
            })
        }

        // Tham gia phong 
        socket.join(user.room)

        // Thong bao tham gia thanh cong cho user 
        socket.emit('message', messBlock(ADMIN, `You have joined the ${user.room} chat room`))

        // Thong bao co nguoi thm gia cho cac users khac 
        socket.broadcast.to(user.room).emit('message', messBlock(ADMIN, `${user.name} has joined the room`))

        // cap nhat danh sach user 
        io.to(user.room).emit('userList', {
            users: getUsersInRoom(user.room)
        })

        //Cap nhat danh sach phong dang hoat dong 
        io.emit('roomList', {
            rooms: getAllActiveRooms()
        })
    })

    //Khi co nguoi room
    socket.on('disconnect', () => {
        const user = getUser(socket.id)
        userleaves(socket.id)

        if (user) {
            //Thong bao user roi phong
            io.to(user.room).emit('message', messBlock(ADMIN, `${user.name} has left the room`))

            io.to(user.room).emit('userList', {
                users: getUsersInRoom(user.room)
            })

            io.emit('roomList', {
                rooms: getAllActiveRooms()
            })
        }

        console.log(`User ${socket.id} disconnected`)
    })

    socket.on('message', ({ name, text }) => {
        const room = getUser(socket.id)?.room
        if (room) {
            io.to(room).emit('message', messBlock(name, text))
        }
    })

    // Listen for activity 
    socket.on('activity', (name) => {
        const room = getUser(socket.id)?.room
        if (room) {
            socket.broadcast.to(room).emit('activity', name)
        }
    })

})
function messBlock(name, text){
    return{
        name,
        text, 
        time: new Intl.DateTimeFormat('default', {
            hour:'numeric',
            minute: "numeric",
            second:'numeric'
        }).format(new Date())
    }
}

////Cac Users function
//Kich hoat user
function activateUser(id, name, room) {
    const user = { id, name, room }
    UsersState.setUsers([
        ...UsersState.users.filter(user => user.id !== id),
        user
    ])
    return user
}

//User functions
function userleaves(id){
    UsersState.setUsers(
        UsersState.users.filter(user => user.id !== id)
    )
}

//Ham tim user
function getUser(id) {
    return UsersState.users.find(user => user.id === id)
}

//Ham tim User bang ten phong
function getUsersInRoom(room) {
    return UsersState.users.filter(user => user.room === room)
}

//Ham tim cac phong dang hoat dong
function getAllActiveRooms() {
    return Array.from(new Set(UsersState.users.map(user => user.room)))
}