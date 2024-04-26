class CheckoutPage {

    getProductNames() {
        return cy.get('h4[class="media-heading"]')
    }

    getProductPrices() {
        return cy.get('tr > td:nth-child(4) > strong')
    }

    getFinalPrice() {
        return cy.get('h3 > strong')
    }

    getCheckoutButton() {
        return cy.get(':nth-child(5) > :nth-child(5) > .btn')
    }
    
}

export default CheckoutPage