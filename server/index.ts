import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import http from 'http';
import path from 'path';
import admin from 'firebase-admin';

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set a cookie
app.use((req: Request, res: Response, next: NextFunction) => {
  const cookie = req.cookies.taskManagerUser;
  console.log(cookie);

  if (cookie === undefined) {
    //10 * 365 * 24 * 60 * 60 * 1000 === 315360000000, or 10 years in milliseconds
    const expiryDate = new Date(Number(new Date()) + 315360000000);
    res.cookie('taskManagerUser', uuidv4(), { expires: expiryDate, httpOnly: false });
  }
  next();
});

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  res.sendFile(path.join(__dirname + '/../client/build/index.html'));
  next();
});

// Production URL needs to be changed
const ioCors = process.env.NODE_ENV === 'production' ?
  'http://localhost:3000' : 'http://localhost:3000';

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: ioCors,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket: any) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});



const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`Server running on port ${ PORT }`));
