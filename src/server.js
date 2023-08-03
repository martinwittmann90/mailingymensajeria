/* -------IMPORTS-------*/
import MongoStore from 'connect-mongo';
import express from 'express'
import exphbs from "express-handlebars";
import session from 'express-session';
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import viewsRouter from "./routes/view.routes.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import chatRouter from "./routes/chat.routes.js"
import sessionsRouter from "./routes/sessions.routes.js";
import websockets from "./config/sockets.config.js";
import { connectMongo } from "./config/configMongoDB.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import initPassport from "./config/passport.config.js";
import "./config/passport.config.js";
import { __dirname } from "./config.js"; //HAY QUE CAMBIAR EL NOMBRE DEL ARCHIVO ESTO
import config from "./config/config.js";
import { initFactory, factoryStore } from "./DAO/factory.js";

/*-------CONFIG BASICAS Y CONEXION A BD-------*/
const app = express();
const port = config.port;
connectMongo();

/*-------SETTING MIDDLEWARES-------*/
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

/*-------SETTING HANDLEBARS-------*/
app.engine ('handlebars', exphbs.engine());
app.set('views',__dirname + "/views");
app.set("view engine", "handlebars");

/*-------SERVIDORES-------*/
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer);
websockets(io);
const server = httpServer.listen(port, () =>
  console.log(
    `Server started on port ${port}. at ${new Date().toLocaleString()}`
  )
);
server.on("error", (err) => console.log(err));

/*-------SESSION-------------*/
app.use(cookieParser("mySecret"));
initFactory();
app.use(session({
  ...factoryStore,
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));
/*-------PASSPORT-------------*/
initPassport();
app.use(passport.initialize());
app.use(passport.session());


/*-------PLANTILLAS-------*/
app.use('/', viewsRouter); 
app.use('/products', viewsRouter);
app.use("/chat", chatRouter);
app.use("/auth/profile", sessionsRouter);


//--------------------NODEMAILER------------------------
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASS,
  },
});

app.get("/mail", async (req, res) => {
  const result = await transport.sendMail({
    from: process.env.GOOGLE_EMAIL,
    to: "martinwittmann90@gmail.com",
    subject: "Mensaje para el usuario",
    html: `
              <div>
                  <h1>Hola usuario</h1>
              </div>
          `,
    /* attachments: [
      {
        filename: "image1.gif",
        path: __dirname + "/images/image1.gif",
        cid: "image1",
      },
    ], */
  });

  console.log(result);
  res.send("Email sent");
});

//--------------------TWILIO----------------------------
import twilio from "twilio";
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.get("/sms", async (req, res) => {
  const result = await client.messages.create({
    body: "Hola usuario!",
    from: process.env.TWILIO_PHONE_NUMBER,
    to: "+5491136228024",
  });

  console.log(result);

  res.send("SMS sent");
});

/* app.get("/whatsaap", async (req, res) => {
  const result = await client.messages.create({
    body: "Hola usuario!",
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+5491136228024',
  });

  console.log(result);

  res.send("Whatsaap sent");
}); */

/*-------END POINTS-------*/
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.get('/*', async (req, res) => {
  res.render("notfound");
})