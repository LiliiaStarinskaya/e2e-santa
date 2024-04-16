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
const users = require("../fixtures/users.json");
const loginPage = require("../fixtures/pages/loginPage.json");
const generalElements = require("../fixtures/pages/general.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");

Cypress.Commands.add("login", (userName, password) => {
  cy.get(loginPage.loginField).type(userName);
  cy.get(loginPage.passwordField).type(password);
  cy.get(generalElements.submitButton).click({ force: true });
});
Cypress.Commands.add("createUserCard", (wishes) => {
  cy.get(generalElements.submitButton).click({ force: true });
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.get(inviteeBoxPage.wishesInput).type(wishes);
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.clearCookies();
});

Cypress.Commands.add("approveUser1", (inviteLink, users) => {
  cy.visit(inviteLink);
  cy.get(generalElements.submitButton).click();
  cy.contains("войдите").click();
  cy.login(users.user1.email, users.user1.password);
  cy.contains("Создать карточку участника").should("exist");
});
Cypress.Commands.add("approveUser2", (inviteLink, users) => {
  cy.visit(inviteLink);
  cy.get(generalElements.submitButton).click();
  cy.contains("войдите").click();
  cy.login(users.user2.email, users.user2.password);
  cy.contains("Создать карточку участника").should("exist");

  Cypress.Commands.add("approveUser3", (inviteLink, users) => {
    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click();
    cy.contains("войдите").click();
    cy.login(users.user3.email, users.user3.password);
    cy.contains("Создать карточку участника").should("exist");
  });
});
