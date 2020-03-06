// ========================================
// Configuration Port
// ========================================


process.env.PORT = process.env.PORT || 3000;

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