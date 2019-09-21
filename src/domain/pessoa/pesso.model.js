
var knex = require('../../shared/db/db').connect();
var Utils = require('../../shared/utils/utils');
var config = require('../../shared/config/config');
var networkHandler = require('../../shared/network/response-handle');
var CODE = require('../../shared/codes/code');
var userModel = require('../user/user.model');

exports.savePartialAnuncio = async (anuncio) => {
    try {
        let user = await userModel.getUserById(anuncio.id_usuario);
        let data_criacao = new Date();
        anuncio.data_criacao = data_criacao;
        var anuncioParsed = Utils.parseToKnex(anuncio);
        var result = await knex('anuncio')
            .insert(anuncioParsed)
            .returning('id');
        sendEmailConfimation(user)
        return result;
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.saveFacilidades = async (body) => {
    try {

        var del = await knex('anuncio_facilidade')
            .where('id_anuncio', body.idAnuncio)
            .del()

        if (del >= 0) {
            let query = [];
            for (let facilidade of body.facilidades) {
                query.push({ id_anuncio: body.idAnuncio, id_facilidade: facilidade.id })
            }
            var result = await knex('anuncio_facilidade')
                .insert(query)
                .returning('id');
            return result;
        }

    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.newFacilidade = async (body) => {
    try {
        var result = await knex('facilidade')
            .insert(body)
            .returning('id');
        return result;
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.updateFacilidade = async (body) => {
    try {
        var result = await knex('facilidade')
            .where({ id: body.id })
            .update({
                nome: body.nome,
                tipo: body.tipo,
                situacao: body.situacao,
            })
            .returning('id');
        return result;
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.updateUrlTour = async (body) => {
    try {
        var result = await knex('anuncio')
            .where({ id: body.id })
            .update({
                url_tour: body.url_tour,
            })
            .returning('id');
        return result;
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.updateImagemCapa = async (body) => {
    try {
        var result = await knex('imagem')
            .where({ id: body.id })
            .update({
                capa: body.capa,
            })
            .returning('id');

        var result2 = await knex('imagem')
            .where({ id: body.idCapaAtual })
            .update({
                capa: 'N',
            })
            .returning('id');
        return result;
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.updateAnuncio = async (anuncio) => {

    let data_atualizacao = new Date();
    anuncio.data_atualizacao = data_atualizacao;
    var anuncioParsed = Utils.parseToKnex(anuncio);

    try {
        var novoAnuncio = await knex('anuncio')
            .where({ id: anuncioParsed.id })
            .update({
                tipo_anuncio: anuncioParsed.tipo_anuncio,
                id_tipo_imovel: anuncioParsed.id_tipo_imovel,
                descricao: anuncioParsed.descricao,
                vagas: anuncioParsed.vagas,
                area: anuncioParsed.area,
                banheiros: anuncioParsed.banheiros,
                quartos: anuncioParsed.quartos,
                preco: anuncioParsed.preco,
                cep: anuncioParsed.cep,
                logradouro: anuncioParsed.logradouro,
                numero: anuncioParsed.numero,
                complemento: anuncioParsed.complemento,
                bairro: anuncioParsed.bairro,
                cidade: anuncioParsed.cidade,
                uf: anuncioParsed.uf,
                situacao: anuncioParsed.situacao,
                tipo_pagamento: anuncioParsed.tipo_pagamentos,
                data_criacao: anuncioParsed.data_criacao,
                data_atualizacao: anuncioParsed.data_atualizacao,
                data_desativacao: anuncioParsed.data_desativacao,
                slug: anuncioParsed.slug,
                id_usuario: anuncioParsed.id_usuario,
                passo_cadastro: anuncioParsed.passo_cadastro,
                data_publicacao: anuncioParsed.data_publicacao,
                url_tour: anuncioParsed.url_tour,
            })
            .returning('id');
        return novoAnuncio;
    } catch (err) {
        console.log('erro->', err);
        return null;
    }
}

exports.updateSituacao = async (body) => {

    let data_atualizacao = new Date();

    try {
        var novoAnuncio = await knex('anuncio')
            .where({ id: body.id })
            .update({
                situacao: body.situacao,
                data_atualizacao: data_atualizacao,
            })
            .returning('id');
        return novoAnuncio;
    } catch (err) {
        console.log('erro->', err);
        return null;
    }
}

exports.updatePagamento = async (anuncio) => {

    try {
        var novoAnuncio = await knex('anuncio')
            .where({ id: anuncio.id })
            .update({
                tipo_pagamento: anuncio.tipo_pagamento,
                passo_cadastro: anuncio.passo_cadastro,
                situacao: anuncio.situacao
            })
            .returning('id');
        return novoAnuncio;
    } catch (err) {
        console.log('erro->', err);
        return null;
    }
}

sendEmailConfimation = (user) => {
    // Load the AWS SDK for Node.js
    var AWS = require('aws-sdk');

    // Set the region 
    AWS.config.update({
        region: config.ses.region,
        accessKeyId: config.ses.accessKeyId,
        secretAccessKey: config.ses.secretAccessKey,
    });

    // Create sendEmail params 
    var params = {
        Destination: { /* required */
            CcAddresses: [
                config.ses.emailCc,
            ],
            ToAddresses: [
                user.email,
                /* more items */
            ]
        },
        Message: { /* required */
            Body: { /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: `<p>Olá ${user.nome}, seu cadastro está parcialmente concluído! Enquanto seus dados estão sendo processados, nossa equipe irá entrar em contato para agendarmos a realização do tour virtual e das fotos! Aguarde!`

                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Imovel Cadastrado'
            }
        },
        Source: config.ses.emailSource, /* required */

    };

    // Create the promise and SES service object
    var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

    // Handle promise's fulfilled/rejected states
    sendPromise.then(
        function (data) {
            console.log(data.MessageId);
        }).catch(
            function (err) {
                if (err) {
                    console.error(err, err.stack);
                }
            });

}

exports.getAllAnunciosFromUser = async (idUsuario) => {
    try {
        var result = await knex('anuncio')
            .where({ id_usuario: idUsuario })

        for (let index = 0; index < result.length; index++) {
            let imagem = await knex('imagem')
                .where({ 'id_anuncio': result[index].id, 'capa': 's' })
            result[index].imagem = imagem[0];
        }

        for (let index = 0; index < result.length; index++) {
            let facilidades = await knex('facilidade')
                .join('anuncio_facilidade', 'facilidade.id', '=', 'anuncio_facilidade.id_facilidade')
                .where({ 'anuncio_facilidade.id_anuncio': result[index].id })
            result[index].facilidades = facilidades;
        }
        return result;
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.getContatos = async (idAnuncio) => {
    try {
        var result = await knex('anuncio_contato')
            .where({ id_anuncio: idAnuncio })
            .orderBy('nome', 'asc')

        return result;
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.getAllAnuncios = async () => {
    try {
        var result = await knex('anuncio')
            .where({ 'situacao': 'AP' })

        for (let index = 0; index < result.length; index++) {
            let imagem = await knex('imagem')
                .where({ 'id_anuncio': result[index].id, 'capa': 's' })
            result[index].imagem = imagem[0];
        }

        for (let index = 0; index < result.length; index++) {
            let facilidades = await knex('facilidade')
                .join('anuncio_facilidade', 'facilidade.id', '=', 'anuncio_facilidade.id_facilidade')
                .where({ 'anuncio_facilidade.id_anuncio': result[index].id })
            result[index].facilidades = facilidades;
        }

        return result;
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.getAnuncios = async (body) => {

    let filter = {}
    if (body.id)
        filter.id = body.id

    if (body.situacao)
        filter.situacao = body.situacao

    if (body.bairro || body.uf || body.cidade || body.logradouro || body.cep) {
        try {
            var result = await knex.column('anuncio.id',
                'anuncio.descricao',
                'anuncio.area',
                'anuncio.vagas',
                'anuncio.quartos',
                'anuncio.banheiros',
                'anuncio.logradouro',
                'anuncio.bairro',
                'anuncio.cidade',
                'anuncio.uf',
                'anuncio.preco',
                'anuncio.cep',
                'anuncio.id_usuario',
                'usuario.sobrenome',
                'usuario.nome',
                'usuario.email',
                'anuncio.complemento')
                .select()
                .from('anuncio')
                .join('usuario', 'usuario.id', '=', 'anuncio.id_usuario')
                .where(filter)
                .andWhere('bairro', 'ilike', `%${body.bairro}%`)
                .andWhere('uf', 'ilike', `%${body.uf}%`)
                .andWhere('cidade', 'ilike', `%${body.cidade}%`)
                .andWhere('logradouro', 'ilike', `%${body.logradouro}%`)
                .andWhere('cep', 'ilike', `%${body.cep}%`)

            return result;
        } catch (err) {
            console.log('ERR=> ', err.stack);
            return null;
        }
    } else {
        try {
            var result = await knex.column('anuncio.id',
                'anuncio.descricao',
                'anuncio.area',
                'anuncio.vagas',
                'anuncio.quartos',
                'anuncio.banheiros',
                'anuncio.logradouro',
                'anuncio.bairro',
                'anuncio.cidade',
                'anuncio.uf',
                'anuncio.preco',
                'anuncio.cep',
                'anuncio.situacao',
                'anuncio.id_usuario',
                'usuario.nome',
                'usuario.sobrenome',
                'usuario.email',
                'anuncio.complemento')
                .select()
                .from('anuncio')
                .join('usuario', 'usuario.id', '=', 'anuncio.id_usuario')
                .where(filter)

            return result;
        } catch (err) {
            console.log('ERR=> ', err.stack);
            return null;
        }
    }
}

exports.getComprasAnuncios = async (body) => {
    try {
        if (body.filtros.area.max == 450) {
            body.filtros.area.max = 100000000
        }
        if (body.filtros.banheiros.max == 4) {
            body.filtros.banheiros.max = 1000
        }
        if (body.filtros.preco.max == 300000000) {
            body.filtros.preco.max = 30000000000
        }
        if (body.filtros.quartos.max == 4) {
            body.filtros.quartos.max = 1000
        }
        if (body.filtros.vagas.max == 4) {
            body.filtros.vagas.max = 1000
        }

        if (body.filtros.facilidades.length > 0) {
            if (body.filtros.tipo == '') {
                var result = await knex.column('anuncio.id',
                    'anuncio.descricao',
                    'anuncio.area',
                    'anuncio.vagas',
                    'anuncio.quartos',
                    'anuncio.banheiros',
                    'anuncio.logradouro',
                    'anuncio.bairro',
                    'anuncio.cidade',
                    'anuncio.uf',
                    'anuncio.preco',
                    'anuncio.lat',
                    'anuncio.lng',
                    'tipo_imovel.nome_tipo')
                    .select()
                    .from('anuncio')
                    .join('anuncio_facilidade', 'anuncio_facilidade.id_anuncio', '=', 'anuncio.id')
                    .join('tipo_imovel', 'tipo_imovel.id', '=', 'anuncio.id_tipo_imovel')
                    .where({ 'tipo_anuncio': body.tipo_anuncio, 'anuncio.situacao': 'AP' })
                    .andWhere('anuncio.lng', '>=', body.viewport.west)
                    .andWhere('anuncio.lng', '<=', body.viewport.east)
                    .andWhere('anuncio.lat', '>=', body.viewport.south)
                    .andWhere('anuncio.lat', '<=', body.viewport.north)
                    .andWhere('anuncio.area', '>=', body.filtros.area.min)
                    .andWhere('anuncio.area', '<=', body.filtros.area.max)
                    .andWhere('anuncio.banheiros', '>=', body.filtros.banheiros.min)
                    .andWhere('anuncio.banheiros', '<=', body.filtros.banheiros.max)
                    .andWhere('anuncio.preco', '>=', body.filtros.preco.min)
                    .andWhere('anuncio.preco', '<=', body.filtros.preco.max)
                    .andWhere('anuncio.quartos', '>=', body.filtros.quartos.min)
                    .andWhere('anuncio.quartos', '<=', body.filtros.quartos.max)
                    .andWhere('anuncio.vagas', '>=', body.filtros.vagas.min)
                    .andWhere('anuncio.vagas', '<=', body.filtros.vagas.max)
                    .whereIn('anuncio_facilidade.id_facilidade', body.filtros.facilidades)
                    .groupBy('anuncio.id')
                    .limit(50)
            } else {
                var result = await knex.column('anuncio.id',
                    'anuncio.descricao',
                    'anuncio.area',
                    'anuncio.vagas',
                    'anuncio.quartos',
                    'anuncio.banheiros',
                    'anuncio.logradouro',
                    'anuncio.bairro',
                    'anuncio.cidade',
                    'anuncio.uf',
                    'anuncio.preco',
                    'anuncio.lat',
                    'anuncio.lng',
                    'tipo_imovel.nome_tipo')
                    .select()
                    .from('anuncio')
                    .join('anuncio_facilidade', 'anuncio_facilidade.id_anuncio', '=', 'anuncio.id')
                    .join('tipo_imovel', 'tipo_imovel.id', '=', 'anuncio.id_tipo_imovel')
                    .where({ 'tipo_anuncio': body.tipo_anuncio, 'anuncio.situacao': 'AP' })
                    .andWhere('anuncio.lng', '>=', body.viewport.west)
                    .andWhere('anuncio.lng', '<=', body.viewport.east)
                    .andWhere('anuncio.lat', '>=', body.viewport.south)
                    .andWhere('anuncio.lat', '<=', body.viewport.north)
                    .andWhere('anuncio.area', '>=', body.filtros.area.min)
                    .andWhere('anuncio.area', '<=', body.filtros.area.max)
                    .andWhere('anuncio.banheiros', '>=', body.filtros.banheiros.min)
                    .andWhere('anuncio.banheiros', '<=', body.filtros.banheiros.max)
                    .andWhere('anuncio.preco', '>=', body.filtros.preco.min)
                    .andWhere('anuncio.preco', '<=', body.filtros.preco.max)
                    .andWhere('anuncio.quartos', '>=', body.filtros.quartos.min)
                    .andWhere('anuncio.quartos', '<=', body.filtros.quartos.max)
                    .andWhere('anuncio.vagas', '>=', body.filtros.vagas.min)
                    .andWhere('anuncio.vagas', '<=', body.filtros.vagas.max)
                    .andWhere({ 'anuncio.id_tipo_imovel': body.filtros.tipo })
                    .whereIn('anuncio_facilidade.id_facilidade', body.filtros.facilidades)
                    .groupBy('anuncio.id')
                    .limit(50)
            }
        } else {
            if (body.filtros.tipo == '') {
                var result = await knex.column('anuncio.id',
                    'anuncio.descricao',
                    'anuncio.area',
                    'anuncio.vagas',
                    'anuncio.quartos',
                    'anuncio.banheiros',
                    'anuncio.logradouro',
                    'anuncio.bairro',
                    'anuncio.cidade',
                    'anuncio.uf',
                    'anuncio.preco',
                    'anuncio.lat',
                    'anuncio.lng',
                    'tipo_imovel.nome_tipo')
                    .select()
                    .from('anuncio')
                    .join('tipo_imovel', 'tipo_imovel.id', '=', 'anuncio.id_tipo_imovel')
                    .where({ 'tipo_anuncio': body.tipo_anuncio, 'anuncio.situacao': 'AP' })
                    .andWhere('anuncio.lng', '>=', body.viewport.west)
                    .andWhere('anuncio.lng', '<=', body.viewport.east)
                    .andWhere('anuncio.lat', '>=', body.viewport.south)
                    .andWhere('anuncio.lat', '<=', body.viewport.north)
                    .andWhere('anuncio.area', '>=', body.filtros.area.min)
                    .andWhere('anuncio.area', '<=', body.filtros.area.max)
                    .andWhere('anuncio.banheiros', '>=', body.filtros.banheiros.min)
                    .andWhere('anuncio.banheiros', '<=', body.filtros.banheiros.max)
                    .andWhere('anuncio.preco', '>=', body.filtros.preco.min)
                    .andWhere('anuncio.preco', '<=', body.filtros.preco.max)
                    .andWhere('anuncio.quartos', '>=', body.filtros.quartos.min)
                    .andWhere('anuncio.quartos', '<=', body.filtros.quartos.max)
                    .andWhere('anuncio.vagas', '>=', body.filtros.vagas.min)
                    .andWhere('anuncio.vagas', '<=', body.filtros.vagas.max)
                    .limit(50)
            } else {
                var result = await knex.column('anuncio.id',
                    'anuncio.descricao',
                    'anuncio.area',
                    'anuncio.vagas',
                    'anuncio.quartos',
                    'anuncio.banheiros',
                    'anuncio.logradouro',
                    'anuncio.bairro',
                    'anuncio.cidade',
                    'anuncio.uf',
                    'anuncio.preco',
                    'anuncio.lat',
                    'anuncio.lng',
                    'tipo_imovel.nome_tipo')
                    .select()
                    .from('anuncio')
                    .join('tipo_imovel', 'tipo_imovel.id', '=', 'anuncio.id_tipo_imovel')
                    .where({ 'tipo_anuncio': body.tipo_anuncio, 'anuncio.situacao': 'AP' })
                    .andWhere('anuncio.lng', '>=', body.viewport.west)
                    .andWhere('anuncio.lng', '<=', body.viewport.east)
                    .andWhere('anuncio.lat', '>=', body.viewport.south)
                    .andWhere('anuncio.lat', '<=', body.viewport.north)
                    .andWhere('anuncio.area', '>=', body.filtros.area.min)
                    .andWhere('anuncio.area', '<=', body.filtros.area.max)
                    .andWhere('anuncio.banheiros', '>=', body.filtros.banheiros.min)
                    .andWhere('anuncio.banheiros', '<=', body.filtros.banheiros.max)
                    .andWhere('anuncio.preco', '>=', body.filtros.preco.min)
                    .andWhere('anuncio.preco', '<=', body.filtros.preco.max)
                    .andWhere('anuncio.quartos', '>=', body.filtros.quartos.min)
                    .andWhere('anuncio.quartos', '<=', body.filtros.quartos.max)
                    .andWhere('anuncio.vagas', '>=', body.filtros.vagas.min)
                    .andWhere('anuncio.vagas', '<=', body.filtros.vagas.max)
                    .andWhere({ 'anuncio.id_tipo_imovel': body.filtros.tipo })
                    .limit(50)
            }
        }

        for (let anuncio of result) {
            // carrega as imagens

            let imagem = await knex('imagem')
                .select('url')
                .where({ 'id_anuncio': anuncio.id, 'capa': 'S' })
            if (imagem.length == 0) {
                let imagem = await knex('imagem')
                    .select('url')
                    .where({ 'id_anuncio': anuncio.id, 'capa': 'N' })
                anuncio.imagem = imagem[0];
            } else {
                anuncio.imagem = imagem[0];
            }

            // Carrega as facilidades
            let facilidades = await knex('facilidade')
                .join('anuncio_facilidade', 'facilidade.id', '=', 'anuncio_facilidade.id_facilidade')
                .where({ 'anuncio_facilidade.id_anuncio': anuncio.id })
            anuncio.facilidades = facilidades;

            anuncio.lat = Number(anuncio.lat)
            anuncio.lng = Number(anuncio.lng)

            // Configura label para marker
            if (anuncio.preco <= 999999) {
                anuncio.label = String(anuncio.preco.substring(0, 3)) + ' K'
            }
            if (anuncio.preco > 999999 && anuncio.preco <= 9999999) {
                anuncio.label = String(anuncio.preco.substring(0, 1)) + ',' + String(anuncio.preco.substring(1, 2)) + ' M'
            }
            if (anuncio.preco > 9999999 && anuncio.preco <= 99999999) {
                anuncio.label = String(anuncio.preco.substring(0, 2)) + ',' + String(anuncio.preco.substring(1, 2)) + ' M'
            }
            if (anuncio.preco > 99999999 && anuncio.preco <= 999999999) {
                anuncio.label = String(anuncio.preco.substring(0, 3)) + ',' + String(anuncio.preco.substring(1, 2)) + ' M'
            }
        }

        return result;
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.getAlugueisAnuncios = async () => {
    try {
        var result = await knex('anuncio')
            .where({ 'tipo_anuncio': 'a' })
        for (let index = 0; index < result.length; index++) {
            let imagem = await knex('imagem')
                .where({ 'id_anuncio': result[index].id, 'capa': 's' })
            result[index].imagem = imagem[0];
        }
        return result;
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.getAllAnunciosDestaque = async () => {
    try {
        var result = await knex('anuncio')
            .where({ 'situacao': 'AP' })
            .limit('8')
        for (let anuncio of result) {

            let imagem = await knex('imagem')
                .select('url')
                .where({ 'id_anuncio': anuncio.id, 'capa': 'S' })
            if (imagem.length == 0) {
                let imagem = await knex('imagem')
                    .select('url')
                    .where({ 'id_anuncio': anuncio.id, 'capa': 'N' })
                anuncio.imagem = imagem[0];
            } else {
                anuncio.imagem = imagem[0];
            }
        }
        return result;
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.getTipoImovel = async () => {
    try {
        var result = await knex('tipo_imovel')

        return result;
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.getFacilidades = async () => {
    try {
        var result = await knex('facilidade')
            .where({ 'situacao': 'A' })

        return result;
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.getAllFacilidades = async () => {
    try {
        var result = await knex('facilidade')

        return result;
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.getFacilidadeById = async (id) => {
    try {
        var result = await knex('facilidade')
            .where({ 'id': id })

        return result[0];
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.getAnuncioById = async (id) => {
    try {
        var result = await knex.column('anuncio.id',
            'anuncio.descricao',
            'anuncio.area',
            'anuncio.vagas',
            'anuncio.quartos',
            'anuncio.banheiros',
            'anuncio.logradouro',
            'anuncio.bairro',
            'anuncio.cidade',
            'anuncio.uf',
            'anuncio.preco',
            'anuncio.cep',
            'anuncio.complemento',
            'anuncio.id_usuario',
            'anuncio.id_tipo_imovel',
            'anuncio.tipo_anuncio',
            'anuncio.situacao',
            'anuncio.tipo_pagamento',
            'anuncio.passo_cadastro',
            'anuncio.url_tour',
            'anuncio.lat',
            'anuncio.lng',
            'usuario.sobrenome',
            'usuario.nome',
            'usuario.email',
            'tipo_imovel.nome_tipo')
            .select()
            .from('anuncio')
            .join('usuario', 'usuario.id', '=', 'anuncio.id_usuario')
            .join('tipo_imovel', 'tipo_imovel.id', '=', 'anuncio.id_tipo_imovel')
            .where({ 'anuncio.id': id })
        for (let index = 0; index < result.length; index++) {
            let imagem = await knex('imagem')
                .where({ 'id_anuncio': result[index].id })
            result[index].imagem = imagem;
        }
        for (let index = 0; index < result.length; index++) {
            let facilidades = await knex('facilidade')
                .join('anuncio_facilidade', 'facilidade.id', '=', 'anuncio_facilidade.id_facilidade')
                .where({ 'anuncio_facilidade.id_anuncio': result[index].id })
            result[index].facilidades = facilidades;
        }
        return result[0];
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.saveImagens = async (body, params) => {
    try {
        let data_criacao = new Date();
        let imagem = {
            id_anuncio: params.id_anuncio,
            descricao: undefined,
            capa: params.capa,
            url: body.location,
            data_criacao: data_criacao,
            ordem: undefined,
            aws_key: body.key.toString()
        }
        var imagemParsed = Utils.parseToKnex(imagem);
        var result = await knex('imagem')
            .insert(imagemParsed)
            .returning('id');
        return result;
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}

exports.deleteImagens = async (body) => {
    try {
        let deletados = []
        for (let key of body) {
            var result = await knex('imagem')
                .where({ 'aws_key': key.Key })
                .del()

            deletados.push(result);
        }
        return deletados
    } catch (err) {
        console.log('ERR=> ', err.stack);
        return null;
    }
}