var Pessoa = require('./pessoa');
const validarCpf = require('validar-cpf');
const validacao = require('./../../service/validacao')
const impressao = require('./../../service/impressao')

exports.print = async (req, res) => {
    let response = {
        sucesso: 0,
        erros: 0
    }
    for (let body of req.body) {

        var pessoa = new Pessoa(body);

        // Validação de CPF
        if (!validarCpf(pessoa.cpf)) {
            console.log('Erro ao validar o CPF')
            response.erros++
            continue
        }

        // Validação do Celular 
        if (!validacao.validaCelular(pessoa.celular)) {
            console.log('Erro ao validar o celular')
            response.erros++
            continue
        }

        // validação de telefone fixo
        if (!validacao.validaTelefone(pessoa.telefone)) {
            console.log('Erro ao validar o Telefone')
            response.erros++
            continue
        }

        // validação de nome
        if (!validacao.validaNome(pessoa.nome)) {
            console.log('Erro ao validar o Nome')
            response.erros++
            continue
        }


        // validação de Sobre nome
        if (!validacao.validaNome(pessoa.sobrenome)) {
            console.log('Erro ao validar o Sobrenome')
            response.erros++
            continue
        }

        impressao.impressaoPessoa(pessoa)

        response.sucesso++
    }

    res.json(response);

}





