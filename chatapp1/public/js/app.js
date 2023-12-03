const socket = io('ws://localhost:3000')

//Khai bao cac Selector
const inputName = document.querySelector('#name')
const inputMess = document.querySelector('#message')
const roomName = document.querySelector('#room')

const usersList = document.querySelector('.user-list')
const roomList  = document.querySelector('.room-list')
const activity  = document.querySelector('.activity')
const chatArea  = document.querySelector('.chat_area')


function joinRoom(e){
    e.preventDefault()
    if(inputName.value && roomName.value){
        socket.emit('joinRoom',{
            name: inputName.value,
            room: roomName.value
        })
    }
}

function sendMess(e){
    e.preventDefault()
    if (inputName.value && inputMess.value && roomName.value){
        socket.emit('message',{
            name: inputName.value,
            text: inputMess.value
        })

        inputMess.value = ""
    }
    inputMess.focus()
}

//Tham gia vao room chat
document.querySelector('.form-join').addEventListener('submit', joinRoom)
//Gui tin nhan
document.querySelector('.form-msg').addEventListener('submit', sendMess)
//Hien thi trang thai hoat dong cua User
document.addEventListener('keypress',()=>{
    socket.emit('activity', inputName.value)
})

// Doc messages
socket.on("message", (data) =>{
    activity.textContent =""
    const {name, text, time} = data
    const li = document.createElement('li')
    li.className = 'post'
    if(name === inputName.value) li.className = 'post post--right'
    if(name !== inputName.value && name !== 'Admin') li.className = 'post post--left'
    if (name !== 'Admin'){
        li.innerHTML = `<div class="post__header ${name === inputName.value
            ? 'post__header--user'
            : 'post__header--reply'
            }">
        <span class="post__header--name">${name}</span> 
        <span class="post__header--time">${time}</span> 
        </div>
        <div class="post__text">${text}</div>`
    } else {
        li.innerHTML = `<div class="post__text">${text}</div>`
    }
    document.querySelector('.chat-display').appendChild(li)

    chatArea.scrollTop = chatArea.scrollHeight
})


let activityTimer
socket.on("activity", (name) => {
    activity.textContent = `${name} is typing...`

    // Clear after 3 seconds 
    clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
        activity.textContent = ""
    }, 3000)
})

socket.on('userList', ({ users }) => {
    showUsers(users)
})

socket.on('roomList', ({ rooms }) => {
    showRooms(rooms)
})

function showUsers(users) {
    usersList.textContent = ''
    if (users) {
        usersList.innerHTML = `<em>Users in Room ${roomName.value}:</em>`
        users.forEach((user, i) => {
            usersList.textContent += ` ${user.name}`
            if (users.length > 1 && i !== users.length - 1) {
                usersList.textContent += ","
            }
        })
    }
}

function showRooms(rooms) {
    roomList.textContent = ''
    if (rooms) { 
        roomList.innerHTML = '<em> Active Rooms:</em>'
        rooms.forEach((room, i) => {
            roomList.textContent += ` ${room}`
            if (rooms.length > 1 && i !== rooms.length - 1) {
                roomList.textContent += ","
            }
        })
    }
}