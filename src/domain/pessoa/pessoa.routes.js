var express = require('express');
var router = express.Router();
var pessoaController =  require('./pessoa.controller');


router.post('/print', function (req, res) {
    pessoaController.print(req, res);
});

router.get('', function (req, res) {
    console.log('teste')
});


module.exports = router;
