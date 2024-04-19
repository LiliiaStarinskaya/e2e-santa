const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");
const lotteryPage = require("../fixtures/pages/lottery.json");
import { faker } from "@faker-js/faker";

describe("user can create a box and run it", () => {
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let userWishes =
    faker.word.noun() + faker.word.adverb() + faker.word.adjective();
  let maxAmount = 50;
  let currency = "Евро";
  let inviteLink;
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

  it("add participants via link", () => {
    cy.get(generalElements.submitButton).click({ force: true });
    cy.get(invitePage.inviteLink)
      .invoke("text")
      .then((link) => {
        inviteLink = link;
      });
    cy.clearCookies();
  });

  it("add participants manually", () => {
    cy.get(invitePage.inviteeNameFieldFirst).type(users.user1.name);
    cy.get(invitePage.inviteeEmailFieldFirst).type(users.user1.email);
    cy.get(invitePage.inviteeNameFieldSecond).type(users.user2.name);
    cy.get(invitePage.inviteeEmailFieldSecond).type(users.user2.email);
    cy.get(invitePage.inviteeNameFieldThird).type(users.user3.name);
    cy.get(invitePage.inviteeEmailFieldThird).type(users.user3.email);
    cy.get(invitePage.button).click({ force: true });
    cy.get(invitePage.messageField)
      .invoke("text")
      .should(
        "include",
        "Карточки участников успешно созданы и приглашения уже отправляются."
      );

    cy.clearCookies();
  });

  it("approve as user1", () => {
    cy.approveUser1(inviteLink, users);
    cy.createUserCard(userWishes);
    cy.get(inviteeDashboardPage.noticeForInvitee)
      .invoke("text")
      .then((text) => {
        expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
      });
    cy.clearCookies();
  });

  it("approve as user2", () => {
    cy.approveUser2(inviteLink, users);
    cy.createUserCard(userWishes);
    cy.get(inviteeDashboardPage.noticeForInvitee)
      .invoke("text")
      .then((text) => {
        expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
      });
    cy.clearCookies();
  });

  it("approve as user3", () => {
    cy.approveUser3(inviteLink, users);
    cy.createUserCard(userWishes);
    cy.get(inviteeDashboardPage.noticeForInvitee)
      .invoke("text")
      .then((text) => {
        expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
      });
    cy.clearCookies();
  });

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
  });
});
