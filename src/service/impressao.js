exports.impressaoPessoa = (pessoa) => {

    console.log(`Nome: ${pessoa.nome} ${pessoa.sobrenome} `)
    
    // Se o celular for informado imprime o telefone
    if (pessoa.celular) {
        console.log(`Fone: ${pessoa.celular}`)
    }
    console.log(`CPF: ${pessoa.cpf}`)
    
}
