/* ===============================
 *  PUERTO
 * ===============================
 */

 process.env.PORT = process.env.PORT || 3000;

/* ===============================
 *  SEED
 * ===============================
 */
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

/* ===============================
 *  Vencimiento de token 
 * ===============================
 */
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


/* ===============================
 * Conexion a base de datos 
 * ===============================
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB
if (process.env.NODE_ENV === 'dev'){
    urlDB ='mongodb://localhost:27017/cafe';
}else{
    urlDB =process.env.MONGO_URI;
}
process.env.URLDB=urlDB;


//========================
// Google Client ID
//========================

process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "565455560791-7tjobrt2mhghmvbsqs27krjdoiembnib.apps.googleusercontent.com";