const { engine } = require("express-handlebars");

module.exports = function (app, path) {
  app.set("views", "./views/hbs");
  app.engine(
    "hbs",
    engine({
      layoutsDir: path.join(__dirname, "../views/hbs/layouts"),
      extname: "hbs",
      defaultLayout: "index",
    })
  );
  app.set("view engine", "hbs");
};
