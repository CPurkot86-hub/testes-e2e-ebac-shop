/// <reference types="cypress" />
const perfil = require('../fixtures/perfil.json')
import EnderecoPage from "../support/page_objects/endereco.page";
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

    it('Deve fazer um pedido na loja Ebac Shop de ponta a ponta', () => {

        //Deve fazer login com sucesso - Usando fixture
        cy.fixture('perfil').then(dados => {
            cy.get('#username').type(dados.usuario)
            cy.get('#password').type(dados.senha, { log: false })
            cy.get('.woocommerce-form > .button').click()
            cy.get('.page-title').should('contain', 'Minha conta')

            //acessar página de produtos
            cy.get('#primary-menu > .menu-item-629 > a').click()
            cy.get('.page-title').should('contain', 'Produtos')

            //Deve adicionar produtos ao carrinho - Usando Comando customizado
            cy.addProdutos('Abominable Hoodie', 'L', 'Red', 4)
            cy.get('#primary-menu > .menu-item-629 > a').click()
            cy.addProdutos('Abominable Hoodie', 'M', 'Blue', 3)
            cy.get('#primary-menu > .menu-item-629 > a').click()
            cy.addProdutos('Abominable Hoodie', 'XS', 'Green', 5)

            //acessar view cart e depois ir para etapa final da compra
            cy.get('.dropdown-toggle > .mini-cart-items').click()
            cy.get('#cart > .dropdown-menu > .widget_shopping_cart_content > .mini_cart_content > .mini_cart_inner > .mcart-border > .buttons > .view-cart').click()
            cy.get('.page-title').should('contain', 'Carrinho')
            cy.get('h2').should('contain', 'Total no carrinho')
            cy.get('.cart-subtotal > td > .woocommerce-Price-amount > bdi').should('exist');
            cy.get('strong > .woocommerce-Price-amount > bdi').should('exist')
            cy.get('.checkout-button').should('contain', 'Concluir compra').click()


            //Endereços - Faturamento e Entrega
            //EnderecoPage.editarEnderecoFaturamento('Cleverson', 'Purkot', 'EBAC', 'Brasil', 'AV Purkot', '2023', 'Curitiba', 'Paraná', '82010-210', '4199999999', 'page.objects@gmail.com')
            //cy.get('.woocommerce-message').should('contain', 'Endereço alterado com sucesso.')

        })
    })
})

