/// <reference types="Cypress" />
import HomePage from "../pageObjects/HomePage"
import ProductPage from "../pageObjects/ProductPage"
import CheckoutPage from "../pageObjects/CheckoutPage"
import PurchasePage from "../pageObjects/PurchasePage"

describe('My second test suite', function() {

    // runs once before all IT blocks
    before(function() {
        // fixture needs to resolve the promise to use the data
        cy.fixture('example').then(function(data){
            this.data = data
        })
    })
    
    it('UI Elements Practice', function() {
        const homePage = new HomePage
        const productPage = new ProductPage
        const checkoutPage = new CheckoutPage
        const purchasePage = new PurchasePage
        Cypress.config('defaultCommandTimeout', 6000)

        cy.visit(Cypress.env('url') + "/angularpractice/")

        homePage.getName().type(this.data.name)
        homePage.getGender().select(this.data.gender)

        // validations
        homePage.getDataBinding().should('have.value', this.data.name)
        // another way to get properties is resolve promise and use 'prop'
        homePage.getName().should('have.attr', 'minlength', '2')
        homePage.getRadio().should('be.disabled')

        // Move to next page
        homePage.getShopLink().click()

        // method from commands.js is invoked. Usage of common/custom functions and parametrization
        this.data.product.forEach(element => {
            cy.selectProduct(element)
        });
        
        productPage.goToCheckout().click()

        // Data Validations
        checkoutPage.getProductNames().each(($e1, index, $list) => {
            expect(this.data.product.includes($e1.text())).to.be.true
        })
        var sum = 0
        checkoutPage.getProductPrices().each(($e1, index, $list) => {
            var price = $e1.text().split(" ")
            sum = sum + Number(price[1].trim())
        }).then(function(){})
        checkoutPage.getFinalPrice().then(function(finalPriceEle) {
            var finalPrice = finalPriceEle.text().split(" ")
            assert.equal(sum, Number(finalPrice[1].trim()))
        })
        
        checkoutPage.getCheckoutButton().click()
        purchasePage.getLocation().type(this.data.country)
        cy.wait(5000)
        purchasePage.getLocationList().each(($el, index, $list) => {
            if($el.text().includes(this.data.country)) {
                purchasePage.getSelectedLocation().eq(index).click()
            }
        })
        purchasePage.getAgreeCheckbox().click({force : true})
        purchasePage.getpurchaseButton().click()
        purchasePage.getSuccessMessage().contains('Success! Thank you! Your order will be delivered in next few weeks :-).')
    })
   
})