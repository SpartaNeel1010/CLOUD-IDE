const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors');
var pty = require('node-pty');
var os = require('os');
const fs = require('fs');
const dotenv = require('dotenv')
dotenv.config()
const { saveToS3 } = require("./AWS/aws")

// const ansiRegex = require('ansi-regex');



const app = express()
app.use(express.json());
app.use(cors({
    origin: '*',
}));

app.get("/health", (req, res) => {
    res.status(200).send("Server Listening at port 9000")
})


const fileRoutes = require('./router/files')
app.use("/files", fileRoutes);
const completionRoutes = require('./router/completion')
app.use("/completion", completionRoutes);


const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*"
    }
})



console.log(__dirname)
let shell = 'bash'
const dir = __dirname + '/home/sessions/username';
// path+='/home/sessions/username'
var ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: dir,
    env: { ...process.env }
});
ptyProcess.write("cd home/session/username\n")
ptyProcess.write('cd() { builtin cd "$@"; if [[ $PWD != /usr/src/app/home/sessions/username* ]]; then builtin cd /usr/src/app/home/sessions/username; echo "You cannot navigate outside /usr/src/app/home/sessions/username"; fi; }')

ptyProcess.onData(async (data) => {
    io.emit('terminal:data', data)
})


function isValidCdCommand(command) {
    // Remove extra spaces and get the command parts
    const parts = command.trim().split(/\s+/);

    // If it's not a cd command, allow it
    if (parts[0] !== 'cd') return true;

    // If it's just 'cd' with no args, allow it (goes to home)
    if (parts.length === 1) return true;

    const targetPath = parts[1];

    // Prevent any command containing '..'
    if (targetPath.includes('..')) return false;

    // Get the absolute path that would result from this cd command
    const absolutePath = path.resolve(baseDir, targetPath);

    // Check if the resulting path would still be within the base directory
    return absolutePath.startsWith(baseDir);
}


io.on('connection', async (socket) => {
    // console.log(socket.id)

    const projID = socket.handshake.query.projID;
    const userID = socket.handshake.query.userID;

    // console.log(userID)
    // console.log(projID)


    let commandBuffer = '';
    socket.on('terminal:write', (data) => {
       ptyProcess.write(data)
    });

socket.on('code:write', (data) => {
    socket.broadcast.emit('code:data', data)
});

socket.on('active-file:change', (activeFile) => {
    socket.broadcast.emit('active-file:change-received', activeFile);
})

socket.on('open-files:change', (openFiles) => {
    socket.broadcast.emit('open-file:change-recieved', openFiles);
})

socket.on('open-paths:change', (openPaths) => {
    socket.broadcast.emit('open-paths:change-received', openPaths);
});

socket.on('active-path:change', (activePath) => {
    socket.broadcast.emit('active-path:change-received', activePath);
});

socket.on('save:code', async ({ path, code }) => {
    const dir = __dirname + '/home/sessions/username';
    await saveToS3(`code/${userID}/${projID}`, path, code)
    fs.writeFileSync(dir + path, code)


})
})

server.listen(3000, () => { console.log("server listening at port 3000") })