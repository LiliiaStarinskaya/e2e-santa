const users = require("../fixtures/users.json");
const generalElements = require("../fixtures/pages/general.json");
const lotteryPage = require("../fixtures/pages/lottery.json");
const boxPage = require("../fixtures/pages/boxPage.json");

describe("user can perform a lottery", () => {
  it("lottery", () => {
    cy.visit("/login");
    cy.login(users.userAutor.email, users.userAutor.password);
    cy.get(generalElements.boxesButton).click();
    cy.get(boxPage.boxElement).click();
    cy.get(generalElements.gearIcon).click();
    cy.get(lotteryPage.lotterySidebarButton).click({ forse: true });
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
});
