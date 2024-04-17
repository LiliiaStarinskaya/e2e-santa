

Feature: The user can create a box and run it

    Scenario: The user logs in and creates a box
        Given the user is on the login page
        When the user logs in as "starinskaya_29@mail.ru" and "test1111"
        Then the user creates a box
        And the user is on the box page
        Then the user saves the created Box id

    Scenario: The user adds participants via link
        Given the user adds participants via link

Feature: The author adds participants via table

    Scenario: The author adds participants via table
        When the author adds the following users
            | name   | email                        |
            | lilia  | starinskaya_29+test1@mail.ru |
            | lilia2 | starinskaya_29+test2@mail.ru |
            | lilia3 | starinskaya_29+test3@mail.ru |
        Then the participants are successfully added

    Scenario: Users approve a participation
        Given the participant is on the login page
        When users log in as "<email>" and "<password>"
        And the user approves the participation "<email>" and "<password>"
        Then the notice for the participant displays
        Examples:
            | email                        | password |
            | starinskaya_29+test1@mail.ru | test1111 |
            | starinskaya_29+test2@mail.ru | test1111 |
            | starinskaya_29+test3@mail.ru | test1111 |

    Scenario: The author conducts a lottery
        Given the author is on the box page
        When the author conducts the lottery
    Scenario: Delete box via API

        Given  the user sends a DELETE request to the box API endpoint

