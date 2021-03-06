var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var morgan = require('morgan');
var logger = require('./src/service/logger.js');
var customLogger = require('./src/middleware/middleware.logger');

const ExpressOAuthServer = require('express-oauth-server');
const cors = require('cors');
const accesscontrol = require('./src/security/accesscontrol');

module.exports = ()=>{
  var app = express();

  app.oauth = new ExpressOAuthServer({
    model: require('./src/security/oauth_model'),
    accessTokenLifetime: 31536000
  });

  app.accesscontrol = accesscontrol;
  //app.use(cors());

  //Middleware do Morgan para Log
  app.use(morgan("common", {
    stream: {
      write: function(mensagem){
          logger.info(mensagem);
      }
    }
  }))

  //app.set('view engine','ejs') //set EJS module as a PAGE DYNAMIC ENGINE
  //app.set('views','./static') //set onde estao as VIEWS - O default é sempre /views
  //mantive o default

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.use(expressValidator());

  //o modulo consign vai INJETAR a variavel APP para os arquivos desses diretorios, nao sendo necessario o
  // var rota = require('./app/controllers/rota')(app) para usar CADA arquivo de rota
  //antes era usado o express-load, evitando-se assim tanto require na pagina inicial do app


  consign({cwd: 'src'})
   //.include('api-old')
   .include('api')
   .then('database')
   .then('persistence')
   //.then('models')
   .then('service')
   //.then('util')
   .into(app);
   //a ordem do consign deve seguir a ordem de 'dependencia'

  //app.use(customLogger({ option1: '1', option2: '2' }));

  //app.use(function(req, res, next){
  //  res.status(404).render("erros/404");
  //})

  //app.use(function(error, req, res, next){
  //  if(process.env.NODE_ENV == 'production') {
  //    res.status(500).render('erros/500');
  //    return
  //  }
  //  next(error);
  //})
  //tem que colocar na ordem, caso contrário ele passa pelo middleware e 
  //ainda não vai ter acontecido nenhum erro.

  app.database.connectionFactoryMongoDb()
  
  return app;
}
