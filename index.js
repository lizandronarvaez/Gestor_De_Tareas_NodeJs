import express from "express";
import { router } from "./src/routes/index.js";
import "./src/config/dotenv.js";
import vardump from "./src/helpers/helpers.js";
import flash from "connect-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import { passport } from './src/config/passport.js'
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
// Conexion ala base de datos
import { connectionDB } from "./src/config/connectionDB.js";
connectionDB();
// Instancia de App Express
const app = express();
const port = process.env.PORT || 3000;
// Archivos estaticos donde se van a cargar
app.use('/proyecto', express.static('src'));
app.use(express.static("src"));
// Definiendo motor de plantilla
app.set("view engine", "pug");
// Definiendo la ruta de la carpeta de las vistas PUG
app.set("views", path.join(__dirname, './src/views'));
// Este middleware permite leer los datos de un formulario
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// Cookie Parser
app.use(cookieParser())
// Sesiones para mantener las sesion activas de los usuarios
app.use(session({
  secret: 'miSecreto',
  resave: false,
  saveUninitialized: false,
}))
// Passport
app.use(passport.initialize())
app.use(passport.session())
// Mensajes flash
app.use(flash())
// Vardump ala app
app.use((req, res, next) => {
  res.locals.vardump = vardump();
  res.locals.mensajes = req.flash();
  res.locals.usuarioActual = { ...req.user } || null
  next();
});
// Ruta Principal
app.use("/", router);
// Abriendo el puerto para que el servidor funcione
app.listen(port, () => {
  console.log(`Servidor funcionando en la Url http://localhost:${3000}`);
});
