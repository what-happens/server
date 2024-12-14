const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "whathappen's API Documentation",
      version: "1.0.0",
      description: "whathappen의 API 명세서입니다.",
    },
    servers: [
      {
        url: "http://localhost:5000", // 서버 URL, 실제 환경에 맞게 수정
        description: "로컬 개발 서버",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken", // 쿠키 이름
          description: "인증에 필요한 액세스 토큰 (쿠키에서 제공).",
        },
      },
      responses: {
        TokenExpired: {
          description:
            "AccessToken이 만료되었습니다. RefreshToken을 사용해 새 토큰이 발급됩니다.",
          headers: {
            "Set-Cookie": {
              description: "새로운 accessToken이 포함된 쿠키",
              schema: {
                type: "string",
              },
            },
          },
        },
        Unauthorized: {
          description: "인증 토큰이 없거나 유효하지 않습니다.",
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // API 파일 경로
};

module.exports = { swaggerOptions };
