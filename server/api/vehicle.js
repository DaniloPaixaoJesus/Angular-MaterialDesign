module.exports = (app)=>{

  app.get('/api2/vehicles', (req, res)=>{
    return app.service.vehicleService(req, res);
  });

  app.get('/api/vehicles', (req, res)=>{
    let service = new app.service.vehicleServiceImpl(app);
    let posts = service.findAll();
    res.status(200).send(posts);
    return 
  });
  
  app.get('/api/vehicles/:id', (req, res)=>{
    let service = new app.service.vehicleServiceImpl(app);
    service.findById(
              req.params.id, 
              function (erro, result){
                if(erro){
                  console.log('api-vehicle-> service error=>', erro)
                  res.status(500).send(erro)
                  return
                }
                res.status(200).send(result);
                return;
              }
            );
    return;
  });

}