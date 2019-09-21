const test = require('tape')
const validacao = require('./../../service/validacao')
const validarCpf = require('validar-cpf');

test('Validar Nome', (t) => {
    t.assert(validacao.validaNome('João') === true, "Nome Validado")
    t.end()
})

test('Validar CPF', (t) => {
    t.assert(validarCpf('83907432053') === true, "CPF Validado")
    t.end()
})


test('Validar Telefone', (t) => {
    t.assert(validacao.validaTelefone('01234567') === true, "Telefone Validado")
    t.end()
})

test('Validar Celular', (t) => {
    t.assert(validacao.validaCelular('0123456789') === true, "Celular Validado")
    t.end()
})

