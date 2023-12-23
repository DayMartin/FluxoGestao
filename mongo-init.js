// mongo-init.js
db = db.getSiblingDB('admin');
db.createUser({
    user: 'negociosdinah',
    pwd: 'IKxKACgqYePR9T3m',
    roles: [{ role: 'root', db: 'admin' }]
});
