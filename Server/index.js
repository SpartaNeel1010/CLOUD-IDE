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
    origin: '*', 
  }));

app.get("/health",(req,res)=>{
    res.status(200).send("Server Listening at port 9000")
})


const fileRoutes=require('./router/files')
app.use("/files",fileRoutes);
const completionRoutes=require('./router/completion')
app.use("/completion",completionRoutes);

const aws_ecs=require('./router/aws-ecs')
app.use("/aws",aws_ecs);

// const completionRoutes=require('./router/completion')
// app.use("/completion",completionRoutes)


console.log(__dirname)
let shell='bash'
const dir =  __dirname + '/home/sessions/username';
// path+='/home/sessions/username'
var ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: dir,
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
        origin:"*"
    }
})
io.on('connection',(socket)=>{
    // console.log(socket.id)

    const projID=socket.handshake.query.projID;
    const userID=socket.handshake.query.userID;


    console.log(projID)
    console.log(userID)

    

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