const jwt = require('jsonwebtoken');


// =================================
//  Verifica token
// =================================

let verificaToken = (req,res,next)=>{
 let token = req.get('token');
 console.log(process.env.SEED);
 console.log(token);

 jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:'Token invalido'
                }
            });
        }

        req.usuario = decoded.usuario;
        //console.log(token);
        next();
 });

};

let verificaAdminRole =(req,res,next)=>{

    let usuario =req.usuario;
    if (usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.json({
            ok: false,
            err: {
                message: 'sin Permisos'
            }
        })
    }
};
module.exports = {
    verificaToken, verificaAdminRole
}