const express=require('express');
const app=express();
const port=8000;
const hostname='localhost';
const server=require('http').createServer().listen(8001,hostname);
const soc=require("socket.io")({
cors:{
origin:[`http://${hostname}:${port}`,"https://f8ed-205-254-172-205.ngrok.io/"]
}
}).listen(server);
app.get('/',(req,res)=>{
res.sendFile(`${__dirname}/Chat.html`);	
});
const users={};
soc.on("connection",socket=>{
//User joined
  socket.on("new-user-joined",name=>{
    users[socket.id]=name;
    console.log("new user "+name);
    socket.broadcast.emit("user-joined",name,socket.id);
    soc.emit("online",users,socket.id);
  });
//Massage sending reciving
  socket.on("send",massage=>{
    socket.broadcast.emit("recive",{name:users[socket.id],massage:massage});
  });
//User left
  socket.on("disconnect",massage=>{
    socket.broadcast.emit("leave",users[socket.id]);
   delete users[socket.id];
   soc.emit("online",users,socket.id);
  });
});
app.listen(port,hostname,()=>{
console.log(`Connected to ${hostname}:${port}`);
});
