"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceAccount = require('./serviceAccountKey.json');
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount)
});
const app = express_1.default();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// set a cookie
app.use((req, res, next) => {
    const cookie = req.cookies.taskManagerUser;
    console.log(cookie);
    if (cookie === undefined) {
        //10 * 365 * 24 * 60 * 60 * 1000 === 315360000000, or 10 years in milliseconds
        const expiryDate = new Date(Number(new Date()) + 315360000000);
        res.cookie('taskManagerUser', uuid_1.v4(), { expires: expiryDate, httpOnly: false });
    }
    next();
});
app.get('*', (req, res, next) => {
    res.sendFile(path_1.default.join(__dirname + '/../client/build/index.html'));
    next();
});
// Production URL needs to be changed
const ioCors = process.env.NODE_ENV === 'production' ?
    'http://localhost:3000' : 'http://localhost:3000';
const server = http_1.default.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: ioCors,
        methods: ['GET', 'POST']
    }
});
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
