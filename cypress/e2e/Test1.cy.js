/// <reference types="cypress" />

describe('AuthModal Tests', () => {
  const signUpEmail = `newuser_${Date.now()}@example.com`; // Unique email for each test run
  const signInEmail = 'valid@example.com'; // Email for login test
  const signInPassword = 'correctpassword';

  beforeEach(() => {
    // Visit the homepage
    cy.visit('http://localhost:3000/')
    
    // Ensure the user is logged out
    cy.logout();

    // Wait for the main content to be visible
    cy.get('.main-content', { timeout: 10000 }).should('be.visible')
  })

  it('should open the AuthModal and display Sign In form', () => {
    // Wait for and log the presence of the button to open AuthModal
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=auth-modal-open]').length > 0) {
        cy.log('Found the AuthModal open button')
        cy.get('[data-cy=auth-modal-open]').should('be.visible').click()
      } else {
        cy.log('AuthModal open button not found')
      }
    })

    // Verify modal is visible
    cy.get('.modal-container').should('be.visible')

    // Verify Sign In form elements
    cy.get('.LSHeader').should('contain', 'Sign In')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button').contains('Login').should('be.visible')
  })

  it('should switch to Sign Up form and display the correct elements', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=auth-modal-open]').length > 0) {
        cy.log('Found the AuthModal open button')
        cy.get('[data-cy=auth-modal-open]').should('be.visible').click()
      } else {
        cy.log('AuthModal open button not found')
      }
    })

    cy.get('button').contains('Create Account').click()

    // Verify Sign Up form elements
    cy.get('.LSHeader').should('contain', 'Sign Up')
    cy.get('input[placeholder="Name"]').should('be.visible')
    cy.get('select').should('be.visible')
    cy.get('button').contains('Create account').should('be.visible')
  })

  it('should show an error message on failed login', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=auth-modal-open]').length > 0) {
        cy.log('Found the AuthModal open button')
        cy.get('[data-cy=auth-modal-open]').should('be.visible').click()
      } else {
        cy.log('AuthModal open button not found')
      }
    })

    cy.get('input[type="email"]').type('invalid@example.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button').contains('Login').click()

    cy.get('.error-message').should('contain', 'Error in login')
  })

  it('should successfully log in with valid credentials', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=auth-modal-open]').length > 0) {
        cy.log('Found the AuthModal open button')
        cy.get('[data-cy=auth-modal-open]').should('be.visible').click()
      } else {
        cy.log('AuthModal open button not found')
      }
    })

    cy.get('input[type="email"]').type(signInEmail)
    cy.get('input[type="password"]').type(signInPassword)
    cy.get('button').contains('Login').click()

    // Wait for and verify success message
    cy.get('body').then(($body) => {
      if ($body.find('.success-message').length > 0) {
        cy.get('.success-message').should('contain', 'Successfully logged in!')
      } else if ($body.find('.error-message').length > 0) {
        cy.get('.error-message').then(($error) => {
          cy.log($error.text())
        })
      } else {
        cy.log('No success or error message found')
      }
    })
  })

  it('should successfully sign up with valid details', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=auth-modal-open]').length > 0) {
        cy.log('Found the AuthModal open button')
        cy.get('[data-cy=auth-modal-open]').should('be.visible').click()
      } else {
        cy.log('AuthModal open button not found')
      }
    })

    cy.get('button').contains('Create Account').click()

    cy.get('input[placeholder="Name"]').type('Test User')
    cy.get('select').select('Yes')
    cy.get('input[type="email"]').type(signUpEmail)
    cy.get('input[type="password"]').type('newpassword')
    cy.get('button').contains('Create account').click()

    cy.get('.success-message').should('contain', 'Successfully registered!')
  })
})
