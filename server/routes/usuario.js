const express = require("express");
const Usuario = require('../models/users');
const {
  verificaToken,
  verificaAdminRole
} = require("../middlewares/autenticacion");
 const app = express();

const bcrypt = require("bcrypt");
const _ = require('underscore');
const saltRounds = 10;

app.get('/usuario', verificaToken, function (req, res) {
    //res.json('get usuario')

    return res.json({
        usuario:req.usuario,
        name:req.usuario.name,
        email:req.usuario.email
    });

    let page = Number(req.query.page || 0);
    let limit = Number(req.query.limit || 5);
    let status = {
        status:true
    }
    Usuario.find(status,'name email')
            .skip(page)
            .limit(limit)
            .exec((err,usuarios)=>{
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                Usuario.count(status,(err,count)=>{
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok:true,
                        count,
                        usuarios
                    })
                });
            })
});

app.post("/usuario", [verificaToken, verificaAdminRole], function(req, res) {
  let body = req.body;
  let salt = bcrypt.genSaltSync(saltRounds);
  let hash = bcrypt.hashSync(body.password, salt);
  let usuario = new Usuario({
    name: body.name,
    email: body.email,
    password: hash,
    role: body.role
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });
});

app.put("/usuario/:id", [verificaToken, verificaAdminRole], function(req, res) {
  let id = req.params.id;
  let fields = ["name", "email", "role", "status", "img"];
  let body = _.pick(req.body, fields);

  Usuario.findOneAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({ ok: false, err });
      }

      res.json({ ok: true, usuario: usuarioDB });
    }
  );
});
app.delete("/usuario/:id", [verificaToken, verificaAdminRole], function(req, res) {
  let id = req.params.id;

  Usuario.findByIdAndUpdate(id, { status: false }, (err, userDelete) => {
    if (err) {
      return res.status(400).json({ ok: false, err });
    }
    console.log(userDelete.status);
    if (userDelete !== false) {
      return res.status(400).json({
        ok: false,
        err: {
          message: `El usuario con id:${id} ya se encuentra dado de baja`
        }
      });
    }
    res.json({ ok: true, usuario: userDelete });
  });
});

module.exports = app;
