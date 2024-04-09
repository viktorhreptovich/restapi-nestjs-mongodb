print('Start #################################################################');

db = db.getSiblingDB('bookstore');
db.createUser(
  {
    user: 'admin',
    pwd: 'password',
    roles: [
      { role: 'readWrite', db: 'bookstore' },
      { role: 'dbOwner', db: 'bookstore' },
    ],
  },
);

db = db.getSiblingDB('bookstore-test');
db.createUser(
  {
    user: 'admin',
    pwd: 'password',
    roles: [{ role: 'readWrite', db: 'bookstore-test' }],
  },
);


print('End #################################################################');
