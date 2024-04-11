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

print('End #################################################################');
