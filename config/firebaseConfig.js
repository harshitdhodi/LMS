const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
FIREBASE_SERVICE_ACCOUNT={"type": "service_account","project_id": "lead-management-system-245fb","private_key_id": "39ff56d378e1901c3ddad0b9c700f93a768f6213","private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCqIeAPUwzMywr/\n42J/49guOx/2p2ajYT8wRiN5CUqgLtaWUwRaKX+ATomGRGrJvz3ApYPxSrnuR3BY\nl/i1kTX5OnNaLPLNQX6x6QULxGzEFlf9FAcyLnrxR5Pn7lE1PmwdnxUtojBZnQgv\nDWLo65OoflXv9zTK2Mre4odLugzJsCLScTjsVMOhtpxEtKgP0MIjW4lBVplnkorr\nkPVsK+A+e7ZE3GtszV+u/CpAZL+EkW7Kj1E/NagAhaPzNwuI1Zn2kKN/w8Fq7bkL\nNsKe1mfTwi/M9iWmHaTFytgtF559qMg6tZg2TVCAk05GdosW7GNpiv7ZTlfUrRfh\nqUiosBHBAgMBAAECggEAF+qCqYzSchCB55ZSoKlKGLehhuYh6MoxHItjja53cdyb\nuE6LwFPwkzwXG4uPGnS6jNQHn/oR+JPM0HtukDGNTY+AqzbB3AY+tepMlgqjAo6k\niFRSLaT4jeXyvgoTmuE/SAu2qa9QziwjvB+M3bLOE0PNN1pALtq6bAoanFPXW9ue\naTN5w/S/V8NPWR+ol/KcKcgyOnTdB/VHCw0Ic8MReIYb9725QAFgLL6n80xo6WWD\nhMDxdr3YNfEr/g4erdf4YoAD7VrBPR+X8x0/tjBwjIraoVFiGX/Eg1fE6Fp/ZeAj\n6FcR6nbbHJv1JRXv1zHBzU3whsztFR+vP8Yvsr1pxQKBgQDsvRDpwzU9feODM0oi\nvLAMG7z3w4Tf65KbuGo0+WvxqUvTrKeSpdhV1paH9F0sXSpZfyVEswyqpp274Gi2\n42RU1o9rZGq2t6ti84RmNzP2UX8uCRerv8XoR5dgjYmEgC81jfkK9mqcBz0hASpH\nu9r61F4osBi+DbnnSv15cduitQKBgQC3+X6ZPoTrZACxulYq1N6IJ80j2CsBogEr\nvyu9UiW7c3i3c5kR41+ZS5ogUJ5RC7NVq8TMFQa1QyMhcQmYVLOV7p8/x6H3u00k\nxVJmweX16QJOQKmlt5R1car+2uQhvxOrBGgueqRMhYiQAzzUQ6lEil96KBXV9rIL\nnIPoQLneXQKBgGC4/mgDsYTmIkZAdlGq9eJ8ksBHycoS3VtyBTKPlWKu4KQjLnPj\n/ndTrTzuwgKWLe9S208uOEagvGE+VooibaOb5gzighcVA5jyFW4Nr9U7htKwNFOf\njqRQW7C/IyhXlvIyh0XLV9NXwcnyR+v2/Ijuq2nESNedlA7DvLwZoLrhAoGBAIeG\nfaI6EgStWG2UjOFkisHWQCJFnfjH9QDbBUej+jPKboUF3R72VnhA3zsq6FVfvy4/\nKOwGGTjySjDaam0TCHBMpnd/gmtSSRPrYDZeZB7xFUe8Dr0LLYwOvh6b9S5+6egz\niOOkaOAOBnnASNE9PrZFEOyWFu/VmXdAR1OSStnpAoGBAL0IUpAc3xnUsr08zLIH\nPw2r/u1NNadmu5Fd1am+/OO4T9vdAImpwZLT30KLcQ/B/p3soLImaz2qvqqopdMe\nYSEJK1LHWngvdbg0iSZde1ncfnd2Bb9NVSPKtO4Db75t17n0ASAEvIsdKJk1ByrJ\nKLiVwQetxKogDwa2AqCWaRti\n-----END PRIVATE KEY-----\n","client_email": "firebase-adminsdk-vn38p@lead-management-system-245fb.iam.gserviceaccount.com","client_id": "109671609089221557375","auth_uri": "https://accounts.google.com/o/oauth2/auth","token_uri": "https://oauth2.googleapis.com/token","auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-vn38p%40lead-management-system-245fb.iam.gserviceaccount.com","universe_domain": "googleapis.com"}

const initializeFirebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
      databaseURL: "https://lead-management-system-245fb-default-rtdb.firebaseio.com"
    });
  } 
};

module.exports = { initializeFirebase };
