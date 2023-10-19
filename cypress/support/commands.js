// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('login', (usuario, senha) => {
    cy.get('#username').type(usuario)
    cy.get('#password').type(senha, { log: false })
    cy.get('.woocommerce-form > .button').click()
});

// Adiciona produtos ao carrinho do menu de compras
Cypress.Commands.add('addProdutos', (produto,tamanho, cor, quantidade) => {
    cy.get('[class="product-block grid"]')
        .contains(produto).click()
    cy.get('.button-variable-item-' + tamanho).click()
    cy.get('.button-variable-item-' + cor).click()
    cy.get('.input-text').clear().type(quantidade)
    cy.get('.single_add_to_cart_button').click()
    cy.get('.woocommerce-message').should('contain', quantidade + ' × “Abominable Hoodie” foram adicionados no seu carrinho.')
})

// Adiciona o Produto 04 ao carrinho usando o Search
Cypress.Commands.add('addProdutosSearch', (produto, tamanho, cor, quantidade) => {
    cy.get("#tbay-header input[type='text']").click().clear().type(produto, { delay: 0 });

    cy.get('.search > .tbay-search-form > .form-ajax-search > .form-group > .input-group > .button-group > .button-search')
        .click();

    cy.get('.product_title').should('contain', produto)
    cy.get('.input-text').clear().type(quantidade)
    cy.get('.button-variable-item-' + tamanho).click()
    cy.get('.button-variable-item-' + cor).click()
    cy.get('.single_add_to_cart_button').click()
    cy.get('.woocommerce-message').should('contain', ' “Autumn Pullie” foram adicionados no seu carrinho.')
})

// Acessa o carrinho e avança para o checkout (viewCart)
Cypress.Commands.add('viewCart', () => {
    cy.get('.dropdown-toggle > .mini-cart-items').click();
    cy.get('#cart > .dropdown-menu > .widget_shopping_cart_content > .mini_cart_content > .mini_cart_inner > .mcart-border > .buttons > .view-cart').click();
    cy.get('.page-title').should('contain', 'Carrinho');
    cy.get('h2').should('contain', 'Total no carrinho');
    cy.get('.cart-subtotal > td > .woocommerce-Price-amount > bdi').should('exist');
    cy.get('strong > .woocommerce-Price-amount > bdi').should('exist');
    cy.get('.checkout-button').should('contain', 'Concluir compra').click();
});

// Finaliza a compra validando dados
Cypress.Commands.add('checkout', () => {
    cy.get('#order_comments').click().type('Teste Aluno Purkot');
    cy.get('#payment_method_cod').click({ force: true });
    cy.get('#terms').click({ force: true });
    cy.get('.woocommerce-privacy-policy-text > p').should('be.visible');
    cy.get('.woocommerce-terms-and-conditions-checkbox-text').should('be.visible');
    cy.get('#place_order').should('be.visible').click();
    cy.get('h1.page-title', { timeout: 10000 }).should('contain', 'Pedido recebido');
    cy.get('.woocommerce-notice').should('contain', 'Obrigado. Seu pedido foi recebido.');
    cy.get('.woocommerce-order-overview__order > strong').invoke('text').then((text) => {
        expect(text.trim()).to.match(/^\d+$/); // Esta expressão regular valida se há apenas dígitos
    });
    cy.get('.woocommerce-order-details__title');
    cy.get('address').should('be.visible');
});





