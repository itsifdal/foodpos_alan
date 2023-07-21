module.exports = (sequelize, Sequelize) => {
    const Menu = sequelize.define("menu", {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nama_menu: {
            type: Sequelize.STRING(50),
        },
        harga: {
            type: Sequelize.STRING(50),
        },
        gambar: {
            type: Sequelize.TEXT,
        },
        url: {
            type: Sequelize.STRING(100),
        }
    },{
        timestamps: false, // Disable automatic timestamps for this model
    });

    return Menu;
}