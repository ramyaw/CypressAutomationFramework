class PurchasePage {

    getLocation() {
        return cy.get('#country')
    }

    getLocationList() {
        return cy.get('div.suggestions > ul >')
    }

    getSelectedLocation() {
        return cy.get('div.suggestions > ul > li > a')
    }

    getAgreeCheckbox() {
        return cy.get('#checkbox2')
    }

    getpurchaseButton() {
        return cy.get('.ng-untouched > .btn')
    }

    getSuccessMessage() {
        return cy.get('.alert')
    }
    
}

export default PurchasePage