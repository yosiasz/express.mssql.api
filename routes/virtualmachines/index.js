module.exports = function(app) {
    
        const sql = require('mssql'),
              js2xmlparser = require("js2xmlparser");
    
        var express = require( "express" ), 
		    router = express.Router()

        var api = '/api/';
        var four0four = require('../../utils/404')();
        var config = require('../../config/db');
		
        /* List of API */
		//POST
        router.post(api + 'vms', getVirtualMachine);   		
        router.get(api + 'virtualmachines', getVirtualMachines);
    
        function getVirtualMachine(req, res, next) {
    
            for (var key in req.body) {
                if(req.body[key] === '' ) {
                    req.body[key] = null;
                    }
            }
    
            var vmname = req.body.vmname;
            var ipaddress = req.body.ipaddress;
            var vmowner = req.body.vmowner;
    
            const pool2 = new sql.ConnectionPool(config, err => {
                // ... error checks
                pool2.on('error', err => {
                    console.log('ConnectionPool', err);
                })
    
                // Stored Procedure
    
                pool2.request() // or: new sql.Request(pool2)
                .input('vmname', sql.VarChar(50), vmname)
                .input('ipaddress', sql.VarChar(50), ipaddress)
                .input('vmowner', sql.VarChar(50), vmowner)
                .execute('dbo.virtualmachines_sp', (err, result) => {
                    // ... error checks
                    console.log('ConnectionPool', err);
                    //console.dir(result)
                    res.send(result.recordsets[0])
                })
            })
        }
    
        function getVirtualMachines(req, res, next) {
            for (var key in req.body) {
                if(req.body[key] === '' ) {
                    req.body[key] = null;
                    }
            }
    
            var vmname = req.body.vmname;
            var ipaddress = req.body.ipaddress;
            var vmowner = req.body.vmowner;
    
            const pool2 = new sql.ConnectionPool(config, err => {
                if (err) console.log(err)
                // ... error checks
                pool2.on('error', err => {
                    console.log('ConnectionPool', err);
                })
    
                // Stored Procedure
    
                pool2.request() // or: new sql.Request(pool2)
                .input('vmname', sql.VarChar(50), vmname)
                .input('ipaddress', sql.VarChar(50), ipaddress)
                .input('vmowner', sql.VarChar(50), vmowner)
                .execute('dbo.virtualmachines_sp', (err, result) => {
                    // ... error checks
                    console.log('ConnectionPool', err);
                    //console.dir(result)
                    res.send(result.recordsets[0])
                })
            })
        }
		
        app.use( '/', router );
    };
    