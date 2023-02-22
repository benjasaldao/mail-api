const express = require("express");
const cors = require("cors");
const routerApi = require("./routes");

const { config } = require("./config/config");

const MailService = require("./services/mail.service");
const mailService = new MailService();

const {
  logErrors,
  errorHandler,
  boomErrorHandler,
} = require("./middlewares/errorHandler");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const allowedOrigin = config.allowedOrigin;
const options = {
  origin: (origin, callback) => {
    if (origin === allowedOrigin || !origin) {
      callback(null, true);
    } else {
      mailService.sendMail("api", "api@gmail.com", `hubo un error de cors man porque ${origin} es distinto de ${allowedOrigin}`)
      callback(new Error("Acceso denegado"));
    }
  },
};
app.use(cors(options));

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log("App running, listening on port " + port);
});
