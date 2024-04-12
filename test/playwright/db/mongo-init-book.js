print('Start #################################################################');

db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);
db.createUser(
  {
    user: 'admin',
    pwd: 'password',
    roles: [
      { role: 'readWrite', db: process.env.MONGO_INITDB_DATABASE },
      { role: 'dbOwner', db: process.env.MONGO_INITDB_DATABASE }
    ]
  }
);

db.createCollection('users');
db.users.insertOne(
  {
    _id: ObjectId('6618b64e607744f03afbb356'),
    name: 'John',
    email: 'jhon@example.com',
    password: '$2a$10$lZ3vHuryK3YevrTDt/9F/.Dt9oFDwKgveWXj7d1ONmI30BmLxpjEK',
    createdAt: new Date('2024-04-12T04:19:26.672Z'),
    updatedAt: new Date('2024-04-12T04:19:26.672Z'),
    __v: 0
  }
);

db.createCollection('books');
db.books.insertOne(
  {
    _id: ObjectId('6618b6d8607744f03afbb359'),
    title: 'Lord of the Rings',
    description: 'This is the description',
    author: 'J.R.R. Tolkien',
    price: 101,
    category: 'fantasy',
    user: ObjectId('6618b64e607744f03afbb356'),
    createdAt: new Date('2024-04-12T04:21:44.817Z'),
    updatedAt: new Date('2024-04-12T04:21:44.817Z'),
    __v: 0
  }
);

print('End #################################################################');
