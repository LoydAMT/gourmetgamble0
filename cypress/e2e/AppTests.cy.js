/// <reference types="cypress" />

describe('App Tests', () => {
  const signUpEmail = `newuser_${Date.now()}@example.com`; // Unique email for each test run
  const signInEmail = 'kentoy634@gmail.com'; // Email for login test
  const signInPassword = 'Luck6304';

  beforeEach(() => {
   
    cy.visit('http://localhost:3000/')
 
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.get('.main-content', { timeout: 10000 }).should('be.visible')
  })

  it('should open the AuthModal and display Sign In form', () => {
    cy.get('[data-cy=auth-modal-open]').should('be.visible').click()
    cy.get('.modal-container').should('be.visible')
    cy.get('.LSHeader').should('contain', 'Sign In')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button').contains('Login').should('be.visible')
  })

  it('should switch to Sign Up form and display the correct elements', () => {
    cy.get('[data-cy=auth-modal-open]').should('be.visible').click()
    cy.get('button').contains('Create Account').click()
    cy.get('.LSHeader').should('contain', 'Sign Up')
    cy.get('input[placeholder="Name"]').should('be.visible')
    cy.get('select').should('be.visible')
    cy.get('button').contains('Create account').should('be.visible')
  })

  it('should show an error message on failed login', () => {
    cy.get('[data-cy=auth-modal-open]').should('be.visible').click()
    cy.get('input[type="email"]').type('invalid@example.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button').contains('Login').click()
    cy.get('.error-message').should('contain', 'Error in login')
  })


  it('should successfully sign up with valid details', () => {
    cy.get('[data-cy=auth-modal-open]').should('be.visible').click()
    cy.get('button').contains('Create Account').click()
    cy.get('input[placeholder="Name"]').type('Test User')
    cy.get('select').select('Yes')
    cy.get('input[type="email"]').type(signUpEmail)
    cy.get('input[type="password"]').type('newpassword')
    cy.get('button').contains('Create account').click()
    cy.get('.success-message', { timeout: 10000 }).should('contain', 'Successfully registered!')
  })

  it('should navigate to the Home page', () => {
    cy.get('button').contains('Home').should('be.visible').click()
    cy.url().should('eq', 'http://localhost:3000/')
    cy.get('.main-content').should('be.visible')
  })

  it('should navigate to the Recipes page', () => {
    cy.get('button').contains('Recipes').should('be.visible').click()
    cy.url().should('include', '/recipes')
    cy.get('.recipes-container').should('be.visible')
  })

  it('should navigate to the Community page', () => {
    cy.get('button').contains('Community').should('be.visible').click()
    cy.url().should('include', '/community')
    cy.get('.community-container').should('be.visible')
  })

  it('should open and close the Privacy Policy modal', () => {
    cy.get('footer').contains('Privacy Policy').should('be.visible').click()
    cy.get('.privacy-policy-modal', { timeout: 10000 }).should('be.visible')
    cy.get('.privacy-policy-modal .close').click()
    cy.get('.privacy-policy-modal').should('not.exist')
  })

  it('should open and close the About Us modal', () => {
    cy.get('footer').contains('About Us').should('be.visible').click()
    cy.get('.about-us-modal', { timeout: 10000 }).should('be.visible')
    cy.get('.about-us-modal .close').click()
    cy.get('.about-us-modal').should('not.exist')
  })

  it('should open and close the Contact Us modal', () => {
    cy.get('footer').contains('Contact Us').should('be.visible').click()
    cy.get('.contact-us-modal', { timeout: 10000 }).should('be.visible')
    cy.get('.contact-us-modal .close').click()
    cy.get('.contact-us-modal').should('not.exist')
  })

})
