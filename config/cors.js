module.exports = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Custom-Header",
    "X-Requested-With",
    "Referer",
    "Cookie",
    "Origin",
    "Sec-CH-UA",
    "Sec-CH-UA-Mobile",
    "Sec-CH-UA-Full-Version-List",
    "Sec-CH-UA-Platform",
    "Credentials",
    "user-agent",
    "Accept",
    "Accept-Encoding",
    "Accept-Language",
    "Access-Control-Request-Headers",
    "Access-Control-Request-Method",
    "Sec-Fetch-Mode",
  ],
  credentials: true,
};
