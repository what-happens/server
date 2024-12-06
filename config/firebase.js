const admin = require("firebase-admin");

// Firebase 초기화 함수
function initializeFirebaseApp() {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccount) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT 환경 변수가 설정되지 않았습니다."
    );
  }

  try {
    const parsedServiceAccount = JSON.parse(serviceAccount);
    admin.initializeApp({
      credential: admin.credential.cert(parsedServiceAccount),
    });
    console.log("Firebase 인증(Admin) 성공");
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    process.exit(1); // 초기화 실패 시 서버 종료
  }
}

// Firestore 접근 함수 (싱글톤 패턴 유지)
let firestoreInstance = null;

function getFirestoreInstance() {
  if (firestoreInstance) {
    console.log("Reusing existing Firestore instance");
    return firestoreInstance;
  }

  try {
    firestoreInstance = admin.firestore();
    return firestoreInstance;
  } catch (error) {
    console.error("Error accessing Firestore:", error);
    throw error;
  }
}

module.exports = { initializeFirebaseApp, getFirestoreInstance };
