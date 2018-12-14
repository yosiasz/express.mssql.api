module.exports = function(app) {

    var apivirtualmachines = require('./virtualmachines/index')(app); 
    var apiassts = require('./assets/index')(app); 
};
