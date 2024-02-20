const rte = require('./mainRoutes');
const adrte = require('./adrte');
  const constructorMethod = (app) => {
    app.use('/admin', adrte);
    
    app.use('/', rte);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
