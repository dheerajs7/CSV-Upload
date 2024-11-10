import express from "express";
import dotenv from "dotenv";
import ejsLayouts from "express-ejs-layouts";
import connectDb from "./config/db.js";
import cors from "cors";
import studentRouter from "./routes/student.routes.js";
import flash from 'connect-flash';
import session from 'express-session';
// import {setFlash} from "./middleware/flashMiddleware.js";
import methodOverride from 'method-override';

dotenv.config();

const app = express();

const PORT = process.env.PORT;
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(ejsLayouts);
app.set('layout', 'layout');

app.use(methodOverride('_method'));

app.use(session({
    secret: process.env.KEY, // replace with a secure key in production
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: false } // set secure: true if using https
  }));

app.use(flash());
// app.use(setFlash);

app.use('/api',studentRouter)
// Connect to the database and start the server
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to connect to the database:", error);
});
