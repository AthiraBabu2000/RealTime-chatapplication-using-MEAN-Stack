
const express=require('express');
 const app= express();
const PORT=process.env.PORT||8080;
const authRoute=require('./routes/auth-route');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const cors=require('cors');
const http = require('http').createServer(app);
const logger = require('morgan');
const io = require('socket.io')(http, {
    cors: {
      origins: ['http://localhost:4200']
     
    }
  });




const messageModel = require('./models/message')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(logger('dev'))


var room1 = ""
var room2 = ""
var room = ""
var data

// function for creating or finding chat rooms 
async function findRoom(user1, user2){
  console.log(user1, "-----", user2);
  room1 = `${user1}-${user2}`;
  room2 = `${user2}-${user1}`;
  data =await messageModel.findOne({ $or: [ {room : room2}, { room: room1 } ] })
  console.log("db data ",data);
  if(data == null){
    console.log("empty");
    newRoom = new messageModel({room : room1, messages:[]});
    savedRoom =await newRoom.save();
    console.log("new  "  ,savedRoom.room);
    room = savedRoom
    data = savedRoom
    console.log(room);
  }else{
    room = data
    console.log("not empty" , room);
  }
}
// for storing the incoming messages to DB
async function storeMessage(chatRoom, msg){
  try {
    updatedMsg =await messageModel.updateOne({ room : chatRoom },{ $push: { messages : msg } })
  } catch (error) {
    console.log(error);
  }
}

io.on('connection', (socket)=>{
    console.log('A user connected',socket.id);
    socket.on('register',async (userDetails) => {
     
      // Create a unique room name
      console.log(userDetails);
      await findRoom(userDetails.sender, userDetails.recipient)           // function for creating or finding chat rooms

      // Join the room
      socket.join(room.room);
      console.log("room from old msg ",room);
      await io.to(room.room).emit('old_message',data.messages)            // send the old chats to fronend
      console.log("re sending msg ", data.messages);
  }); 

  socket.on('send_message',async (msg) => {                               // receiving the messages that coming from frontend
      console.log("incoming message=> ",msg);


      // Emit the message to the specific room
      console.log("send msg ", room.room);
      await io.to(room.room).emit('new_message', msg);                    // returning the messages to frontend
      await storeMessage(room.room, msg)
  });



  // Handle disconnections
    socket.on('disconnect', () => {
      console.log('User disconnected'); 
    });
})


mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://AthiraBabu321:jud0rEqXL1n6ygz5@cluster1.it4967f.mongodb.net/chatapplication?retryWrites=true&w=majority',(err)=>{
    if(err){
        console.log("Database is not connected");
    }
    else{
        console.log("Database connected successfully");
    }
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cors())
/*app.use(logger('dev'))*/
app.use('/auth',authRoute);
app.get('/',(req,res)=>{
   
})

const chatApi = require('./routes/chatApi');
const { Socket } = require('dgram');
const user = require('./models/user');
const { userInfo } = require('os');
app.use('/user', chatApi)


console.log("test")








http.listen(PORT,()=>{
    console.log("server is connected to port ",PORT)
})

