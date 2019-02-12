const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Category = require('../models/categoria');

//=================================
// Muestra un listado de categoria
//=================================

app.get("/categoria", verificaToken, (req, res) => {
  Category.find({}, "description userId").exec((err, categoryDB) => {
    if (err) {
      return res
        .status(400)
        .json({ ok: false, err: { message: "No hay categorias" } });
    }
    if (categoryDB) {
      res.json({
        ok: true,
        category: categoryDB
      });
    }
  });
});

//================================
// Muestra una categoria por ID
//================================
app.get("/categoria/:id", verificaToken, (req, res) => {
  //Categiria.findById(...);
  let id = req.params.id;
  Category.findById({ _id: id }, (err, categoryDB) => {
    if (err) {
      return res
        .status(500)
        .json({ ok: false, err: { message: "No se encomtro la categorias" } });
    }
    res.json({
      ok: true,
      category: categoryDB
    });
  });
});
//===========================
// Crea categoria 
//===========================
app.post("/categoria", verificaToken, (req, res)=>{
    // regresa nueva categoria
    // req.usuario._id
    let category = req.body;
    let id = req.usuario._id;

    let addCategory = new Category({
      description: category.description,
      userId: id
    });
    addCategory.save((err, categoryDB) => {
      if (err) {
        return res
          .status(500)
          .json({
            ok: false,
            err
          });
      }
        if (!categoryDB) {
            return res
                .status(400)
                .json({
                    ok: false,
                    err
                });
        }
      res.json({ ok: true, category: categoryDB });
    });
  }
);
//================================
// Actualiza una categoria por ID
//================================
app.put("/categoria/:id", verificaToken, (req, res) =>{
    
    let id = req.params.id;
    let description = req.body.description;
    console.log(id);
  // Categiria.findById(...);
    Category.findOneAndUpdate({ _id:id }, { description }, { new: true, runValidators: true },(err,categoryDB)=>{
        if (err) {
            return res.status(500).json({ ok: false, err:{message:'No se encontro el ID'} });
        }
        if (!categoryDB) {
            return res.status(400).json({ ok: false, err });
        }
        res.json({
            ok:true,
            category: categoryDB
        })
    })
});
//================================
// Borrar una categoria por ID
//================================
app.delete("/categoria/:id", verificaToken, (req, res) => {
  let _id = req.params.id;
  // Categoria.findById(...);
  Category.findOneAndDelete({ _id: _id }, (err, deleteCategory) => {
    if (err) {
      return res
        .status(400)
        .json({ ok: false, err: { message: "No se encontro el ID" } });
    }

    res.json({ ok: true, category: deleteCategory });
  });
});

module.exports = app;