const express=require('express')
const http = require('http')
const {Server}=require('socket.io')
const cors = require('cors');
var pty = require('node-pty');
var os = require('os');
const fs = require('fs');

// const ansiRegex = require('ansi-regex');



const app=express()
app.use(express.json()); 
app.use(cors({
    origin: 'http://localhost:5173', 
  }));

app.get("/health",(req,res)=>{
    res.status(200).send("Server Listening at port 9000")
})


const fileRoutes=require('./router/files')
app.use("/files",fileRoutes);

const completionRoutes=require('./router/completion')
app.use("/completion",completionRoutes)


var shell = 'bash';
var path=process.env.PWD
path+='/home/sessions/username'
var ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: path,
    env: {...process.env}
  });
// console.log(process.env)

ptyProcess.write("cd home/session/username\n")
const server = http.createServer(app)




ptyProcess.onData(async (data)=>{
    io.emit('terminal:data',data)
})
const io= new Server(server,{
    cors:{
        origin:"http://localhost:5173"
    }
})
io.on('connection',(socket)=>{
    console.log(socket.id)
    socket.on('terminal:write', (data) => {
        // console.log(data)
        if (!data.includes("cd ..")) { 
            ptyProcess.write(data);
        } else {
            socket.emit('terminal:data', 'Access denied.\n');
        }
    });
    socket.on('code:write',(data)=>{
        socket.broadcast.emit('code:data',data)
    })

    socket.on('active-file:change',(activeFile)=>{
        socket.broadcast.emit('active-file:change-received',activeFile);
    })

    socket.on('open-files:change',(openFiles)=>{
        socket.broadcast.emit('open-file:change-recieved',openFiles);
    })

    socket.on('open-paths:change', (openPaths) => {
        socket.broadcast.emit('open-paths:change-received', openPaths);
    });

    socket.on('active-path:change', (activePath) => {
        socket.broadcast.emit('active-path:change-received', activePath);
    });

    socket.on('save:code',({path,code})=>{
        const dir = __dirname+'/home/sessions/username';
        
        fs.writeFileSync(dir+path,code)

    })
})

server.listen(3000,()=>{console.log("server listening at port 3000")})