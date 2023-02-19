const express = require("express");
const cors = require("cors");
const routerApi = require("./routes");

const {
  logErrors,
  errorHandler,
  boomErrorHandler,
} = require("./middlewares/errorHandler");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const allowedOrigin = process.env.ALLOWED_ORIGIN
const options = {
    origin: (origin, callback) => {
        if(origin === allowedOrigin || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Acceso denegado"))
        }
    }
}
app.use(cors(options))

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log("App running, listening on port " + port);
});
