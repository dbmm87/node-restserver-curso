const express = require('express');
let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');
let Category = require('../models/categoria');
//===================================
// Busqueda de Productos 
//===================================

app.get('/producto/buscar/:termino', verificaToken, (req, res)=>{

    let termino =  req.params.termino;
    let regex = new RegExp(termino, 'i')

    Producto.find({nombre:regex})
    .populate('categoria', 'description')
    .exec((err, producto)=>{
        if (err) {
            return res.status(500).json({
                err: err,
                ok: false
            })
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La lista se encuentra vacia'
                }
            })
        }
        res.json({
            ok:true,
            producto
        })
    })

})

//=========================
// Consulta todos los Productos
//=========================
app.get('/producto', verificaToken,(req , res)=>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible:false})
    .skip(desde)
    .limit(5)
    .populate('categoria', 'id description')
    .exec( (err, listado)=>{
            if(err){
                return res.status(500).json({
                    err:err,
                    ok:false
                })
            }
            if(!listado){
                return res.status(400).json({
                    ok:true,
                   err:{
                        message:'La lista se encuentra vacia'
                   }
                })
            }
            res.status(200).json({
                ok: true,
                productos: listado
            })
        })
});

//=========================
// Producto por Id
//=========================
app.get('/producto/:id', verificaToken,(req, res) => {

    let _id = req.params.id;

    Producto.findById(_id)
    .populate('categoria', 'id description')
    .populate('usuario', 'id name')
    .exec( (err, productodb)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if (!productodb) {
            return res.status(400).json({
                ok:false,
                err:{
                    message:'El ID no exixte'
                }
            })
        }
        res.json({
            ok:true,
            productodb
        })
    })


});

//=========================
// Crea producto Producto
// nombre: { type: String, required: [true, 'El nombre es necesario'] },
// precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
// descripcion: { type: String, required: false },
// disponible: { type: Boolean, required: true, default: true },
// categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
// usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
//=========================
app.post('/producto', verificaToken, async (req, res) => {

    let producto = req.body;
    let id = req.usuario._id;
    
    let idCategory = await Category.findOne({ description: producto.categoria }).populate('categoria', 'id description');
    if(!idCategory){
        return res.status(500).json({
            ok:false,
            message:'No existe la categoria'
        })
    }
    let addProducto =  new Producto({
        nombre: producto.nombre,
        precioUni: producto.precioUni,
        descripcion: producto.descripcion,
        disponible: true,
        categoria: idCategory.id,
        usuario: id
    })
    addProducto.save((err, productoDB) => {
        if (err) {
            return res
                .status(500)
                .json({
                    ok: false,
                    err
                });
        }
        console.log(productoDB);
        if (!productoDB) {
            return res
                .status(400)
                .json({
                    ok: false,
                    err
                });
        }
        res.json({ ok: true, category: productoDB });
    });
});

//=========================
// Actualiza Producto
//=========================
app.put('/producto/:id', verificaToken, async (req, res) => {
    let _id = req.params.id;
    console.log(_id);
    let dataUpdate = req.body;
    if (req.body.categoria){
        let idCategory = await Category.findOne({ description: req.body.categoria },{ new: true, runValidators: true }).populate('categoria', 'id description');
        if (!idCategory) {
            return res.status(500).json({
                ok: false,
                message: 'No existe la categoria'
            })
        }
        dataUpdate.categoria = idCategory;
    }
    Producto.findByIdAndUpdate({_id:_id }, dataUpdate  , { new: true, runValidators: true },(err,productoUbdate)=>{
        //console.debug(err);
        if(err){
            return res.status(500).json({
                ok:false,
                err:'El numero id no existe'
            })
        }
        if (!productoUbdate){
         return res.status(400).json({
             ok:false,
             message: 'producto no encontrado'
         })
        }
        res.json({
            ok:true,
           producto:productoUbdate
        })
    });
});

//=========================
// Elimina Producto
//=========================
app.delete('/producto/:id', verificaToken, (req, res) => {
    let _id =  req.params.id;

    Producto.findByIdAndUpdate(_id, { disponible: false }, { new: true, runValidators: true })
    .populate('categoria','id description')
    .exec((err,dproducto)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            if(!dproducto){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:'El Id no se encontro'
                    }
                })
            }

            res.json({
                ok:true,
                dproducto
            })
    })
});

module.exports = app;