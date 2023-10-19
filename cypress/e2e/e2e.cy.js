/// <reference types="cypress" />

import EnderecoPage from "../support/page_objects/endereco.page";
import { TEST_IDS, TEST_MSG, } from "./constantsE2E"
const faker = require('faker');
const perfil = require('../fixtures/perfil.json')
const dadosEndereco = require('../fixtures/endereco.json')

context('Exercicio - Testes End-to-end - Fluxo de pedido', () => {
    /*  Como cliente 
        Quero acessar a Loja EBAC 
        Para fazer um pedido de 4 produtos 
        Fazendo a escolha dos produtos
        Adicionando ao carrinho
        Preenchendo todas opções no checkout
        E validando minha compra ao final */

    beforeEach(() => {
        cy.visit('minha-conta')
    });

    afterEach(() => {
        cy.screenshot()
    });

    it('Deve fazer um pedido na loja Ebac Shop de ponta a ponta', () => {

        // Loga no site utilizando dados predefinidos - Usando o arquivo de dados fixture
        cy.fixture('perfil').then(dados => {
            cy.get('#username').type(dados.usuario)
            cy.get('#password').type(dados.senha, { log: false })
            cy.get(TEST_IDS.checkoutButtonSelector).click()
            cy.get(TEST_IDS.pageTitleSelector).should('contain', TEST_MSG.myAccountText)

            // Acessa a página de produtos
            cy.get(TEST_IDS.primaryMenuItemSelector).click()
            cy.get(TEST_IDS.pageTitleSelector).should('contain', TEST_MSG.productsText)

            // Adiciona produtos ao carrinho do menu de compras
            cy.addProdutos('Abominable Hoodie', 'L', 'Red', 4)
            cy.get(TEST_IDS.primaryMenuItemSelector).click()
            cy.addProdutos('Abominable Hoodie', 'M', 'Blue', 3)
            cy.get(TEST_IDS.primaryMenuItemSelector).click()
            cy.addProdutos('Abominable Hoodie', 'XS', 'Green', 5)
            cy.get(TEST_IDS.primaryMenuItemSelector).click()

            // Adiciona o Produto 04 ao carrinho usando o Search - Usando Comando customizado
            cy.addProdutosSearch('Autumn Pullie', 'XL', 'Red', 10)

            // Acessa o carrinho e avança para o checkout (viewCart) - Usando Comando customizado
            cy.viewCart()

            // Preenche o formulário de faturamento com dados do Faker + Pages
            const TEST_FAKER = {
                nome: faker.name.firstName(),
                sobrenome: faker.name.lastName(),
                empresa: faker.company.companyName(),
                pais: 'Brasil',
                endereco: faker.address.streetAddress(),
                numero: faker.random.number().toString(),
                cidade: 'Curitiba',
                estado: 'Paraná',
                cep: '82010-210',
                telefone: '4199999999',
                email: faker.internet.email()
            }

            EnderecoPage.editarEnderecoFaturamento(
                TEST_FAKER.nome,
                TEST_FAKER.sobrenome,
                TEST_FAKER.empresa,
                TEST_FAKER.pais,
                TEST_FAKER.endereco,
                TEST_FAKER.numero,
                TEST_FAKER.cidade,
                TEST_FAKER.estado,
                TEST_FAKER.cep,
                TEST_FAKER.telefone,
                TEST_FAKER.email)

            //Finaliza a compra validando dados - Usando Comando customizado
            cy.checkout()

        })
    })
})

