const express = require('express');
let { verificaToken , verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Category = require('../models/categoria');

//=================================
// Muestra un listado de categoria
//=================================

app.get("/categoria", verificaToken, (req, res) => {
  Category.find({}, "description user")
  .populate('user','name')
  .exec((err, categoryDB) => {
    if (err) {
      return res
        .status(500)
        .json({ ok: false, err });
    }
    if (!categoryDB) {
      return res
        .status(400)
        .json({ ok: false, err: { message: "No se encontro la categorias" } });
    }
 
      res.json({
        ok: true,
        category: categoryDB
      });
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
        .json({ ok: false, err });
    }
    if (!categoryDB) {
      return res
        .status(400)
        .json({ ok: false, err: { message: "No se encontro la categorias" } });
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
      user: id
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
      console.log( categoryDB );
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
  // Categiria.findById(...);
  Category.findOneAndUpdate({ _id: id }, { description:description },{ new:true,runValidators:true },(err,categoryDB)=>{
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
  Category.findOneAndDelete({ _id: _id }, [verificaToken, verificaAdminRole], (err, deleteCategory) => {
    if (err) {
      return res
        .status(500)
        .json({ ok: false, err: err });
    }
    if (!deleteCategory) {
      return res
        .status(400)
        .json({ ok: false, err: { message: "No se encontro el ID" } });
    }

    res.json({ ok: true, message: "Categoria eliminada" });
  });
});

module.exports = app;