// firebase.js (Firebase Admin SDK 및 클라이언트 SDK 설정)

const admin = require("firebase-admin");
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

// Firebase Admin SDK 초기화

if (!serviceAccount) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT 환경 변수가 설정되지 않았습니다.");
}

try {
  const parsedServiceAccount = JSON.parse(serviceAccount);
  admin.initializeApp({
    credential: admin.credential.cert(parsedServiceAccount),
  });
  console.log("Firebase 인증(Admin) 성공");
} catch (error) {
  console.log("Error initializing Firebase Admin : ", error);
  process.exit(1);
}
