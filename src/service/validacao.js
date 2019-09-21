exports.validaCelular = (celular) => {

    // Verifica se for informado o celular, se não foi informado é validado
    if (!celular || celular =='')
    return true

    // verifica se a string é composta apenas de números
    if (!(!isNaN(parseFloat(celular)) && isFinite(celular)))
        return false

    // verifica se a string tem pelo menos 10 caracteres
    if (celular.length < 10)
        return false

    return true
}

exports.validaTelefone = (telefone) => {

    // verifica se a string é composta apenas de números
    if (!(!isNaN(parseFloat(telefone)) && isFinite(telefone)))
        return false

    // verifica se a string tem pelo menos 7 caracteres
    if (telefone.length < 7)
        return false

    return true
}

exports.validaNome = (nome) => {

    // verifica se existe nome ou se ele é vazio
    if ( !nome && nome == '')
        return false

    // Verifica se nome tem pelo menos 3 caracteres
    if (nome.length < 4)
        return false

    return true
}



