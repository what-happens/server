const admin = require("firebase-admin");
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccount) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT 환경 변수가 설정되지 않았습니다.");
}

try {
  const parsedServiceAccount = JSON.parse(serviceAccount);
  admin.initializeApp({
    credential: admin.credential.cert(parsedServiceAccount),
  });
  console.log("Firebase 인증 성공");
} catch (error) {
  console.log("Error initializing Firebase : ", error);
  process.exit(1);
}
