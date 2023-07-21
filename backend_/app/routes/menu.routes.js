module.exports = app => {
    const menu = require("../controllers/menu.controller.js");

    let router = require("express").Router();

    // Retrieve all menus
    router.get("/", menu.findAll);

    // Retrieve single menu
    router.get("/:id", menu.findOneById);

    // Create a new menu
    router.post("/", menu.create);

    // Update menu
    router.put("/:id", menu.update);

    // Delete single menu
    router.delete("/:id", menu.delete);

    app.use("/api/menu", router);
}