const users = require("../fixtures/users.json");
const generalElements = require("../fixtures/pages/general.json");
const lotteryPage = require("../fixtures/pages/lottery.json");
import { faker } from "@faker-js/faker";

describe("user can perform a lottery", () => {
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  it("lottery", () => {
    cy.visit("/login");
    cy.login(users.userAutor.email, users.userAutor.password);
    cy.get(generalElements.boxesButton).click();
    cy.contains(newBoxName).click({ force: true });
    cy.get(lotteryPage.lotterySubmitLink).click({ force: true });
    cy.get(lotteryPage.lotterySubmitButton).click();
    cy.get(lotteryPage.secondSubmitButton).click();
    cy.get(lotteryPage.notice)
      .invoke("text")
      .then((text) => {
        expect(text).to.contain("Жеребьевка проведена");
      });
    cy.clearCookies();
  });
});
