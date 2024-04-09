print('Start #################################################################');

db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);
db.createUser(
  {
    user: 'admin',
    pwd: 'password',
    roles: [
      { role: 'readWrite', db: process.env.MONGO_INITDB_DATABASE },
      { role: 'dbOwner', db: process.env.MONGO_INITDB_DATABASE },
    ],
  },
);

db.createCollection('users');
db.users.insertOne({
  name: 'John',
  email: 'jhon@example.com',
  password: '$2a$10$OtVvtnB5PA1iBZy/myfVauV6MHOhjZRLKHI.dLo1QR248W7djWcZC'
});

db.createCollection('books');
db.users.insertOne({});

print('End #################################################################');
