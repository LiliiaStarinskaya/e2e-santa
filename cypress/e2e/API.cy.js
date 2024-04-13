const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
import { faker } from "@faker-js/faker";

describe("user can create a box and run it", () => {
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let maxAmount = 50;
  let currency = "Евро";

  let boxId;

  it("user logins and create a box", () => {
    cy.visit("/login");
    cy.login(users.userAutor.email, users.userAutor.password);
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
    cy.get(generalElements.boxMenu)
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Участники");
        expect(text).to.include("Моя карточка");
        expect(text).to.include("Подопечный");
      });

    cy.url().then((url) => {
      const parts = url.split("/");
      boxId = parts[parts.length - 1];
      cy.log("Box ID:", boxId);
    });
  });

  it("Delete_box", () => {
    cy.request({
      method: "DELETE",
      headers: {
        Cookie:
          "jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY1NTI1NjUsImlhdCI6MTcxMjk1NzY1MiwiZXhwIjoxNzE1NTQ5NjUyfQ.ISTy4N-ZRB04PQ0Di_0VGjaVJ5xlWYQy0EdVo-ubE3M",
      },
      url: "https://santa-secret.ru/api/box/" + boxId,
    }).then((response) => {
      expect(response.status).to.equal(200);
    });
    cy.log("ready!");
  });
});
