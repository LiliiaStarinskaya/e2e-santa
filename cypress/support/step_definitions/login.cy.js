import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
const users = require("../../fixtures/users.json");
const boxPage = require("../../fixtures/pages/boxPage.json");
const generalElements = require("../../fixtures/pages/general.json");
const dashboardPage = require("../../fixtures/pages/dashboardPage.json");
const invitePage = require("../../fixtures/pages/invitePage.json");
const inviteeDashboardPage = require("../../fixtures/pages/inviteeDashboardPage.json");
const lotteryPage = require("../../fixtures/pages/lottery.json");
import { faker } from "@faker-js/faker";
let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
let userWishes =
  faker.word.noun() + faker.word.adverb() + faker.word.adjective();
let maxAmount = 50;
let currency = "Евро";
let inviteLink;
let boxId;

Given("the user is on the login page", () => {
  cy.visit("/login");
});

When("the user logs in as {string} and {string}", (email, password) => {
  cy.login(email, password);
});

Then("the user creates a box", () => {
  cy.contains("Создать коробку").click();
  cy.get(boxPage.boxNameField).type(newBoxName);
  cy.get(generalElements.arrowRight).click();
  cy.get(boxPage.sixthIcon).click();
  cy.get(generalElements.arrowRight).click();
  cy.get(boxPage.giftPriceToggle).check({ force: true });
  cy.get(boxPage.maxAmount).type(maxAmount);
  cy.get(boxPage.currency).select(currency);
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.get(generalElements.arrowRight).click();

  cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName);
});

Then("the user is on the box page", () => {
  cy.get(generalElements.boxMenu)
    .invoke("text")
    .then((text) => {
      expect(text).to.include("Участники");
      expect(text).to.include("Моя карточка");
      expect(text).to.include("Подопечный");
    });
});

Then("the user saves the created Box id", () => {
  cy.url().then((url) => {
    const parts = url.split("/");
    boxId = parts[parts.length - 1];
    cy.log("Box ID:", boxId);
  });
});

Given("the user adds participants via link", () => {
  cy.get(generalElements.submitButton).click({ force: true });
  cy.get(invitePage.inviteLink)
    .invoke("text")
    .then((link) => {
      inviteLink = link;
    });
  cy.clearCookies();
});

When("the author adds the following users", (dataTable) => {
  const rows = dataTable.rawTable.slice(1);
  const firstUser = rows[0];
  cy.get(invitePage.inviteeNameFieldFirst).type(firstUser[0]);
  cy.get(invitePage.inviteeEmailFieldFirst).type(firstUser[1]);
  const secondUser = rows[1];
  cy.get(invitePage.inviteeNameFieldSecond).type(secondUser[0]);
  cy.get(invitePage.inviteeEmailFieldSecond).type(secondUser[1]);
  const thirdUser = rows[2];
  cy.get(invitePage.inviteeNameFieldThird).type(thirdUser[0]);
  cy.get(invitePage.inviteeEmailFieldThird).type(thirdUser[1]);
  cy.get(invitePage.button).click({ force: true });
});

Then("the participants are successfully added", () => {
  cy.get(invitePage.messageField).should(
    "include",
    "Карточки участников успешно созданы и приглашения уже отправляются."
  );
  cy.clearCookies();
});

Given("the participant is on the login page", () => {
  cy.visit(inviteLink);
  cy.get(generalElements.submitButton).click();
  cy.contains("войдите").click();
});

When("users log in as {string} and {string}", (email, password) => {
  cy.login(email, password);
  cy.contains("Создать карточку участника").should("exist");
});

When("the user approves the participation {string} and {string}", () => {
  cy.createUserCard(userWishes);
});

Then("the notice for the participant displays", () => {
  cy.get(inviteeDashboardPage.noticeForInvitee)
    .invoke("text")
    .then((text) => {
      expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
    });
  cy.clearCookies();
});

Given("the author is on the box page", () => {
  cy.visit("/login");
  cy.login(users.userAutor.email, users.userAutor.password);
  cy.get(generalElements.boxesButton).click();
  cy.contains(newBoxName).click({ force: true });
});

When("the author conducts the lottery", () => {
  cy.get(generalElements.gearIcon).click();
  cy.get(lotteryPage.lotterySidebarButton).click({ force: true });
  cy.get(generalElements.submitButton).click();
  cy.get(lotteryPage.secondSubmitButton).click();

  cy.get(lotteryPage.notice)
    .invoke("text")
    .then((text) => {
      expect(text).to.contain("Жеребьевка проведена");
    });
  cy.get(generalElements.gearIcon).click();
  cy.contains("Проведена").should("exist");
  cy.clearCookies();
});
When("the user sends a DELETE request to the box API endpoint", () => {
  cy.request({
    method: "DELETE",
    headers: {
      Cookie:
        "jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY1NTI1NjUsImlhdCI6MTcxMzMwMTIxMSwiZXhwIjoxNzE1ODkzMjExfQ.4OhB2_ABWkB-IvfyF9tsRw_1NH8j42JBmAfxY8RStho",
    },
    url: "https://santa-secret.ru/api/box/" + boxId,
  }).then((response) => {
    expect(response.status).to.equal(200);
  });
});
