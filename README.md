Como rodar o projeto
- npm i
- npm start
- Fazer uma requisição post para http://localhost:3000/api/pessoa/print passando um array de objeto   
[
  	{      
       "nome":  String,
       "sobrenome": String,
       "telefone": String,
       "celular": String,
       "cpf": String
  }
]

Como rodar o teste
- npm test

O que foi interpretado da tarefa e implementado.
Ao receber a requisição foi feito:
- Validação do nome, considerando que ele não pode ser nulo, vazio e tenha no mínimo 3 caracteres.
- Validação do sobrenome, considerando que ele não pode ser nulo, vazio e tenha no mínimo 3 caracteres.
- Validação do telefone, considerando que ele seja um número e tenha no mínimo 7 dígitos
- Validação do celular, considerando que ele seja um número e tenha no mínimo 10 dígitos **
- Validação de CPF
- Se todos os campos forem validados é feita a impressão no console das informações Nome, Telefone(celular), CPF


Obs** Considerando o cenário 3 do enunciado "E a pessoa tenha telefone celular", considerei que se não for passado o celular não é feita a validação e ocorre a impressão dos campos Nome e CPF