import faker from 'faker';

const numberOfUsers = 100;

const createUsers = () => {
  const users = [];
  for (let i = 0; i <= numberOfUsers; i += 1) {
    (function createAccounts() {
      const { firstName, lastName } = faker.name;
      const email = `${firstName()}.${lastName()}@andela.com`;
      const fullName = `${firstName()} ${lastName()}`;
      users.push({
        firstName: firstName(),
        lastName: lastName(),
        value: email,
        label: fullName,
      });
    }());
  }

  return users;
};

export default createUsers;
