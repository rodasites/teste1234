module.exports = class Pessoa {

    constructor(pessoa) {
        this.nome = pessoa.nome;
        this.sobrenome = pessoa.sobrenome;
        this.telefone = pessoa.telefone;
        this.celular = pessoa.celular;
        this.cpf = pessoa.cpf;
    }
}