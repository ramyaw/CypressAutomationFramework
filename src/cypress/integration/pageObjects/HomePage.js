class HomePage {

    getName() {
        return cy.get(':nth-child(1) > .form-control')
    }

    getDataBinding() {
        return cy.get(':nth-child(4) > .ng-untouched')
    }

    getGender() {
        return cy.get('select')
    }

    getRadio() {
        return cy.get('#inlineRadio3')
    }

    getShopLink() {
        return cy.get(':nth-child(2) > .nav-link')
    }
}

export default HomePage