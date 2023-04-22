const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const multer = require("multer");
const path = require("path");

dotenv.config();

//Connecting to database
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
   console.log("Connected to MongoDB");
});
mongoose.set("strictQuery", false);
//middleware
app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
   res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
   );
   res.header(
      "Access-Control-Allow-Methods",
      "GET, HEAD, POST, PUT, DELETE, OPTIONS"
   );
   res.header("Cross-Origin-Resource-Policy", "cross-origin");
   next();
});

app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json());
app.use(helmet());
helmet({
   crossOriginResourcePolicy: false,
});
app.use(morgan("common"));

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "public/images");
   },
   filename: (req, file, cb) => {
      cb(null, req.body.name);
   },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
   try {
      return res.status(200).json("File uploaded successfully.");
   } catch (err) {
      console.log(err);
   }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

const server = app.listen(8800, () => {
   console.log("Backend server is running on port 8800.");
});

const io = require("socket.io")(server, {
   cors: {
      origin: "http://localhost:3000",
   },
});

let users = [];

const addUser = (userId, socketId) => {
   !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
};

const removeUser = (socketId) => {
   users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
   return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
   //when connect
   console.log("a user connected");

   //take userId and socketId from user
   socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
   });

   //send and get message
   socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);

      // Check if the receiver is online
      if (user && user.socketId) {
         io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
         });
      } else {
         // The receiver is not online
         console.log(`User with ID ${receiverId} is not online.`);
      }
   });

   //when disconnect
   socket.on("disconnect", () => {
      console.log("a user disconnected.");
      removeUser(socket.id);
      io.emit("getUsers", users);
   });
});
