// ========================================
// Configuration Port
// ========================================


process.env.PORT = process.env.PORT || 3000;

// ========================================
// Configuration Token
// ========================================

// Expire: 60 seconds * 60 minutes * 24 hours * 30 days
process.env.EXPIRE_TOKEN = 60*60*24*30;


// Seed authentication
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'semilla-dev';

// ========================================
// Configuration environment data
// ========================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://127.0.0.1:27017/coffee';
}
else{
    //urlDB = 'mongodb+srv://admin:gdzMB6QdaBlEPSTf@cluster0-jizs6.mongodb.net/coffee';
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB= urlDB;