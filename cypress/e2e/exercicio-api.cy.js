/// <reference types="cypress" />

import contrato from "../contracts/usuarios.contract";

describe('Testes da Funcionalidade Usuários', () => {

  let token

  beforeEach(() => {
    cy.token('enrico.QA@teste.com.br', 'teste123').then(tkn => {
      token = tkn
    })
  })

  it('Deve validar contrato de usuários com sucesso', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    })

  });

  it('Deve listar usuários cadastrados com sucesso - GET', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
      expect(response.duration).to.be.lessThan(20)
    })
  });

  it('Deve cadastrar um usuário com sucesso - PUT', () => {
    cy.cadastrarUsuario(token, 'Enrico', 'teste' + Math.floor(Math.random() * 1000) + '@qa.com', 'teste', 'true')
      .then((response) => {
        expect(response.status).to.equal(201)
        expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.cadastrarUsuario(token, 'Enrico', 'teste  ' + Math.floor(Math.random() * 1000) + '@qa.com', 'teste', 'true')
      .should((response) => {
        expect(response.body.email).equal('email deve ser um email válido')
        expect(response.status).to.equal(400)
      })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let usuario = 'UsuárioCadastrado ' + Math.floor(Math.random() * 1000)
    let email = 'teste' + Math.floor(Math.random() * 1000) + '@qa.com'

    cy.cadastrarUsuario(token, usuario, email, 'teste', 'true').should((response) => {
      expect(response.status).to.equal(201)
    })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    let usuario = 'UsuárioCadastrado ' + Math.floor(Math.random() * 1000)
    let email = 'teste' + Math.floor(Math.random() * 1000) + '@qa.com'

    cy.cadastrarUsuario(token, usuario, email, 'teste', 'true').then((response) => {
      cy.request({
        method: 'DELETE',
        url: 'usuarios/' + response.body._id,
        headers: { authorization: token }
      }).should((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal("Registro excluído com sucesso")
      })
    })
  });


});
