// server.js
import express from "express";
import passport from "passport";
import morgan from "morgan";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import indexRoutes from "./routes/routes.js";
import bodyParser from "body-parser"; // Asegúrate de haberlo instalado previamente
import cookieParser from "cookie-parser";
import session from "express-session";
import { Strategy as PassportLocalStrategy } from "passport-local";
import dotenv from "dotenv";
dotenv.config();

// Initialize express
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cookieParser("mi ultra secreto"));

// settings
app.set("port", process.env.PORT || 3001);
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

//firebase
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

app.get("/firebase-config", (req, res) => {
  res.json(firebaseConfig);
});

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Agregamos el middleware para analizar el cuerpo JSON

// static files
app.use(express.static(join(__dirname, "public")));

// listening the Server
app.listen(app.get("port"));
console.log("Server on port", app.get("port"));

app.use(
  session({
    secret: "mi ultra secreto",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 20 * 60 * 1000, // 20 minutos (en milisegundos)
    },
  })
);

// Configurar Passport
app.use(passport.initialize());
app.use(passport.session());

const users = [
  {
    id: 1,
    username: "usuario1",
    password: "1234",
    name: "invitado",
  },
  // Agrega más usuarios aquí...
];

passport.use(
  new PassportLocalStrategy(function (username, password, done) {
    // Buscar el usuario en la lista de usuarios
    const user = users.find((user) => user.username === username);

    // Si el usuario no se encuentra, retornar mensaje de error para el usuario
    if (!user) {
      return done(null, false, { message: "Nombre de usuario incorrecto" });
    }

    // Si la contraseña es incorrecta, retornar mensaje de error para la contraseña
    if (user.password !== password) {
      return done(null, false, { message: "Contraseña incorrecta" });
    }

    // Si las credenciales son válidas, retornar el usuario
    return done(null, user);
  })
);

// Configurar serialización y deserialización de usuario (sustituye por tus propias funciones)
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  // Buscar el usuario por su ID en la lista de usuarios
  const user = users.find((user) => user.id === id);

  // Si el usuario no se encuentra, retornar un error
  if (!user) {
    return done(new Error("Usuario no encontrado"));
  }

  // Si el usuario se encuentra, retornar el usuario
  done(null, user);
});

app.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/", // Mantén la redirección en caso de fallo
  }),
  function (req, res) {
    // Esta función se ejecutará solo si la autenticación tiene éxito
    res.redirect("/index"); // Redirige al usuario a la página de inicio después del éxito
  }
);

// routes
app.use(indexRoutes);
