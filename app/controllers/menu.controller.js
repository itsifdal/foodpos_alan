const db    = require("../models");
const Menu  = db.menus;

const fs    = require('fs');
const path  = require('path');

exports.create = (req, res) => {
    
    if(req.files === null){
        const menus = {
            nama_menu : req.body.nama_menu,
            harga     : req.body.harga
        };
        // Save all menus in the database using the `insertMany` method
        Menu.create(menus)
            .then((menus) => {
                res.json({ message: 'Records Menu berhasil ditambahkan', data: menus });
            }).catch((err) => {
                res.status(500).json({ message: 'Tidak berhasil menambah data menu' });
            });
    }else{

        const nama_menu = req.body.nama_menu;
        const harga     = req.body.harga;
        
        const file      = req.files.file;
        const fileSize  = file.data.length;
        const ext       = path.extname(file.name);
        const fileName  = file.md5 + ext;
        const url       = `${req.protocol}://${req.get("host")}/images/${fileName}`;
        const allowedType = ['.png', '.jpg', '.jpeg'];
        
        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ message: "Invalid Images" });
        if (fileSize > 5000000) return res.status(422).json({ message: "Image must be less than 5 MB" });

        file.mv(path.join(__dirname, `../../images/${fileName}`), async (err) => {
            if (err) return res.status(500).json({ message: err.message });
            try {
                await Menu.create({ nama_menu: nama_menu, harga: harga, gambar: fileName, url: url });
                res.status(200).json({ message: "Menu berhasil ditambah" });
            } catch (error) {
                console.log(error.message);
            }
        });
    }
};

// Return Menu Page.
exports.findAll = (req, res) => {
    Menu.findAll()
        .then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Gagal menampilkan data menu"
            });
        });
};

// Find a single Menu with an id
exports.findOneById = (req, res) => {
    const id = req.params.id;

    Menu.findByPk(id)
        .then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send({
                message: "Error retrieving Menu with id=" + id
            });
        });
};


// Create and Save a new Payment
exports.bulkCreate = (req, res) => {

    const menus = req.body; // Assuming the payload is an array of menu items

    // Save all menus in the database using the `insertMany` method
    Menu.bulkCreate(menus)
        .then((menus) => {
            res.json({ message: 'Records Menu berhasil ditambahkan', data: menus });
        }).catch((err) => {
            res.status(500).json({ message: 'Tidak berhasil menambah data menu' });
        });

};

// Update a Menu by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Menu.update(req.body, {
        where: { id: id }
    }).then((result) => {
        if ( result == 1 ) {
            res.send({
                message: "Menu berhasil di update"
            });
        } else {
            res.send({
                message: `tidak dapat update data menu id =${id}.`
            })
        }
    }).catch((err) => {
        res.status(500).send({
            message: "Error saat update data menu id :" + id
        })
    });
};

// Delete a Menu with the specified id in the request
// exports.delete = (req, res) => {
//     const id = req.params.id;

//     Menu.destroy({
//         where: { id: id }
//     }).then((result) => {
//         if (result == 1) {
//             res.send({
//                 message: "Menu was deleted successfully"
//             })
//         } else {
//             res.send({
//                 message: `tidak dapat hapus data menu id :=${id}`
//             })
//         }
//     }).catch((err) => {
//         res.status(500).send({
//             message: "Error saat hapus data menu id : " + id
//         })
//     });
// };

exports.delete = (req, res) => {
    const menuId = req.params.id;

    const menu = Menu.findOne({
        where:{
            id : menuId
        }
    });

    if(!menu) return res.status(404).json({message: "No Data Found"});
 
    try {
        const filepath = path.join(__dirname, `../../images/${menu.gambar}`);

        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        Menu.destroy({
            where: {
                id: menuId,
            },
        });

        res.status(200).json({message: "Menu berhasil dihapus!"});
    } catch (error) {
        console.log(error.message);
    }
}