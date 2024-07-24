/// <reference types="cypress" />

describe('App Tests', () => {
  const signUpEmail = `newuser_${Date.now()}@example.com`; // Unique email for each test run
  const signInEmail = 'kentoy634@gmail.com'; // Email for login test
  const signInPassword = 'Luck6304';

  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.get('.main-content', { timeout: 5000 }).should('be.visible');
  });
  /*

  it('should open the AuthModal and display Sign In form', () => {
    cy.get('[data-cy=auth-modal-open]').should('be.visible').click();
    cy.get('.modal-container').should('be.visible');
    cy.get('.LSHeader').should('contain', 'Sign In');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button').contains('Login').should('be.visible');
  });

  it('should switch to Sign Up form and display the correct elements', () => {
    cy.get('[data-cy=auth-modal-open]').should('be.visible').click();
    cy.get('button').contains('Create Account').click();
    cy.get('.LSHeader').should('contain', 'Sign Up');
    cy.get('input[placeholder="Name"]').should('be.visible');
    cy.get('select').should('be.visible');
    cy.get('button').contains('Create account').should('be.visible');
  });

  it('should show an error message on failed login', () => {
    cy.get('[data-cy=auth-modal-open]').should('be.visible').click();
    cy.get('input[type="email"]').type('invalid@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button').contains('Login').click();
    cy.get('.error-message').should('contain', 'Error in login');
  });

  it('should successfully sign up with valid details', () => {
    cy.get('[data-cy=auth-modal-open]').should('be.visible').click();
    cy.get('button').contains('Create Account').click();
    cy.get('input[placeholder="Name"]').type('Test User');
    cy.get('select').select('Yes');
    cy.get('input[type="email"]').type(signUpEmail);
    cy.get('input[type="password"]').type('newpassword');
    cy.get('button').contains('Create account').click();
    cy.get('.success-message', { timeout: 10000 }).should('contain', 'Successfully registered!');
  });

  it('should navigate to the Home page', () => {
    cy.get('button').contains('Home').should('be.visible').click();
    cy.url().should('eq', 'http://localhost:3000/');
    cy.get('.main-content').should('be.visible');
  });

  it('should navigate to the Recipes page', () => {
    cy.get('button').contains('Recipes').should('be.visible').click();
    cy.url().should('include', '/recipes');
    cy.get('.recipes-container').should('be.visible');
  });

  it('should navigate to the Community page', () => {
    cy.get('button').contains('Community').should('be.visible').click();
    cy.url().should('include', '/community');
    cy.get('.community-container').should('be.visible');
  });

  it('should open and close the Privacy Policy modal', () => {
    cy.get('footer').contains('Privacy Policy').should('be.visible').click();
    cy.get('.privacy-policy-modal', { timeout: 10000 }).should('be.visible');
    cy.get('.privacy-policy-modal .close').click();
    cy.get('.privacy-policy-modal').should('not.exist');
  });

  it('should open and close the About Us modal', () => {
    cy.get('footer').contains('About Us').should('be.visible').click();
    cy.get('.about-us-modal', { timeout: 10000 }).should('be.visible');
    cy.get('.about-us-modal .close').click();
    cy.get('.about-us-modal').should('not.exist');
  });

  it('should open and close the Contact Us modal', () => {
    cy.get('footer').contains('Contact Us').should('be.visible').click();
    cy.get('.contact-us-modal', { timeout: 10000 }).should('be.visible');
    cy.get('.contact-us-modal .close').click();
    cy.get('.contact-us-modal').should('not.exist');
  });

  // Additional tests for the Home component
  it('should display ingredients and allow searching', () => {
    // Ensure ingredients are displayed
    cy.get('.ingredient-cards').within(() => {
      cy.get('.card').should('have.length.at.least', 1);
    });

    // Perform a search
    cy.get('.search-bar').type('tomato');
    cy.get('.ingredient-cards').within(() => {
      cy.get('.card').each(($card) => {
        cy.wrap($card).contains('tomato', { matchCase: false });
      });
    });
  });

  it('should toggle ingredient selection', () => {
    // Click the first ingredient card
    cy.get('.ingredient-cards .card').first().click();
    // Verify it has the selected class
    cy.get('.ingredient-cards .card').first().should('have.class', 'selected-card');
    // Click it again to deselect
    cy.get('.ingredient-cards .card').first().click();
    // Verify it no longer has the selected class
    cy.get('.ingredient-cards .card').first().should('not.have.class', 'selected-card');
  });

  it('should scroll ingredient cards', () => {
    // Scroll right
    cy.get('.ingredient-cards-container .right-scroll-button').click();
    // Add assertion to ensure scrolling, can check scrollLeft property
    cy.get('.ingredient-cards').then(($el) => {
      const initialScrollLeft = $el.scrollLeft();
      cy.get('.ingredient-cards-container .right-scroll-button').click();
    });
  });

  it('should toggle chatbot visibility', () => {
    cy.get('.chatbot-button').click();
    cy.get('.chatbot-button').click();
  });

  // Tests for the Community component
  it('should display the Community component', () => {
    cy.get('button').contains('Community').click();
    cy.get('.community-container').should('be.visible');
  });

  it('should allow adding a new post', () => {
    cy.wait(3000); // Wait for data to load
    cy.get('button').contains('Community').click();
    cy.get('.new-post-input').type('This is a test post');
    cy.wait(2000); // Wait for data to load
    cy.get('.new-post-button').click();
    cy.wait(2000); // Wait for data to load
    cy.get('.post-card').first().contains('This is a test post');
  });

  it('should allow liking a post', () => {
    cy.wait(3000); // Wait for data to load
    cy.get('button').contains('Community').click();
    cy.wait(1000); // Wait for data to load
    cy.get('.like-button').first().click();
    cy.wait(2000); // Wait for like action to complete
    cy.get('.like-count').first().should('contain', '1');
  });

  it('should allow adding a comment', () => {
    cy.wait(3000); // Wait for data to load
    cy.get('button').contains('Community').click();
    cy.wait(1000); // Wait for data to load
    cy.get('.comment-toggle-button').first().click();
    cy.get('.comment-input').first().type('This is a test comment');
    cy.wait(1000);
    cy.get('.post-comment-button').first().click();
    cy.wait(3000); // Wait for comment to be added
    cy.get('.comment').first().contains('This is a test comment');
  });

  it('should allow searching posts', () => {
    cy.get('button').contains('Community').click();
    cy.wait(1000); // Wait for data to load
    cy.get('.search-bar').type('test');
    cy.wait(1000); // Wait for search results to load
  });

  it('should allow following a user', () => {
    cy.get('button').contains('Community').click();
    cy.wait(1000); // Wait for data to load
    cy.get('.follow-button').first().click();
    cy.get('.follow-button').first().should('contain', 'Unfollow');
  });

  it('should display trending posts', () => {
    cy.get('button').contains('Community').click();
    cy.get('.sidebar-section').contains('Trends for you');
    cy.get('.trending-post').should('have.length.at.least', 1);
  });

  it('should display who to follow section', () => {
    cy.get('button').contains('Community').click();
    cy.get('.sidebar-section').contains('Who to follow');
    cy.get('.who-to-follow-item').should('have.length.at.least', 1);
  });

  
  // Tests for the Profile component
  it('should upload a new profile picture', () => {
    cy.get('img.profile-picture-nav').click(); // Navigate to profile
    // Wait for profile to load
    cy.get('.edit-profile-button').click(); // Open the edit profile modal

    // Intercept the upload request
    cy.intercept('POST', '**//**').as('fileUpload');

    // Select a file to upload (ensure you have a sample image in the fixtures folder)
    const fileName = 'sampleProfilePic.jpg';
    cy.get('input[type="file"]').attachFile(fileName);

    // Save the profile picture
    cy.get('.save-button').click();

    // Wait for the file upload request to complete
    cy.wait(3000);

    // Verify that the new profile picture is displayed
    cy.get('.profile-picture')
      .should('have.attr', 'src')
      .and('not.include', 'default-profile.png'); // Ensure the new profile picture URL is different from the default
  });

  it('should change the nickname', () => {
    cy.get('img.profile-picture-nav').click(); // Navigate to profile
    cy.wait(1000); // Wait for profile to load
    cy.get('.edit-profile-button').click(); // Open the edit profile modal

    const newNickname = 'NewNickName';
    cy.get('#nickname').clear().type(newNickname); // Change the nickname

    // Save the new nickname
    cy.get('.save-button').click();
    
    // Verify that the new nickname is displayed
    cy.get('.nickname').should('contain', newNickname);
  });

  it('should display followers and following lists', () => {
    cy.get('img.profile-picture-nav').click(); // Navigate to profile
    cy.wait(1000); // Wait for profile to load

    // Verify followers list is displayed correctly
    cy.get('span').contains('Followers').click();
    cy.get('.recipes-container-profile').should('exist');
    
    // Verify following list is displayed correctly
    cy.get('span').contains('Following').click();
    cy.get('.recipes-container-profile').should('exist');
  });

*/
// Test for the Upload Recipe button in the Profile component
  it('should open and close the Upload Recipe modal', () => {
    cy.wait(2000);
    cy.get('img.profile-picture-nav').click(); // Navigate to profile
    cy.wait(2000); // Wait for profile to load
    cy.get('.upload-recipe-button').click();
    cy.get('.modalContainer').should('be.visible');
    cy.get('.cancelButton').click();
  });

});
