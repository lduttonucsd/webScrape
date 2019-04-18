module.exports = app => {
    app.get("/", (req, res) => res.render("/main"));






    app.get("*", (req, res) => res.render("404"));
};