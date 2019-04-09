//require('./config/config');
const express = require("express");
const bcrypt = require("bcrypt");
const Usuario = require("../models/users");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const app = express();
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/loguin',(req,res)=>{
    let body = req.body;
    Usuario.findOne({email:body.email},(err,usuarioDB)=>{
        if (err) {
            return res.status(500).json({ ok: false, err });
        }
        if(!usuarioDB){
            return res.status(400).json({ ok: false, err:{ message:'Usuario o contraseña incorrecta'} });
        }
        if(!bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(400).json({ ok: false, err: { message: 'Usuario o contraseña incorrecta' } });
        }
        let token = jwt.sign(
          {
            usuario: usuarioDB
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        console.log(token);
        res.json({
            ok:true,
            usuario:usuarioDB,
            token
        })
    })

});

async function verify(token) {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        ok:true,
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google:true
    }

}


app.post("/google", async (req, res) => {
  let token = req.body.idtoken;

  let googleUser = await verify(token)
    .catch(e =>{
        return res.status(403).json({
            ok:false,
            err:e
        })
    });

    //console.log(googleUser);
    if (googleUser.ok){
        Usuario.findOne({email:googleUser.email},(err,usuarioDB)=>{
           // console.log(googleUser);
                if (err) {
                    return res.status(500).json({ ok: false, err });
                }
                if(usuarioDB){
                    if(usuarioDB.google === false){
                        //console.log(usuarioDB);
                        return res.status(400).json({ ok: false, err:{ message:"Usuario ya existe" } }); 
                    }else{
                        let token = jwt.sign(
                            {
                                usuario: usuarioDB
                            },
                            process.env.SEED,
                            { expiresIn: process.env.CADUCIDAD_TOKEN }
                            );
                        return res.json({
                            ok:true,
                            usuario:usuarioDB,
                            token
                        })
                    }
                }else{
                    let usuario = new Usuario();
                    usuario.name = googleUser.name;
                    usuario.email = googleUser.email;
                    usuario.img = googleUser.img;
                    usuario.google= true;
                    usuario.password=':)';
        
                    usuario.save((err,usuarioDB)=>{
                        //console.log(err);
                        if (err) {
                            return res.status(500).json({ ok: false, err });
                        }
                        let token = jwt.sign(
                            {
                                usuario: usuarioDB
                            },
                            process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }
                        );
                        return res.json({
                            ok: true,
                            usuario: usuarioDB,
                            token
                        })
                    });
        
                }
        });
    }
});
module.exports = app;
