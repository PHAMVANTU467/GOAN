import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, "dist");
const BACKEND_URL = process.env.BACKEND_URL ? process.env.BACKEND_URL.replace(/\/$/, "") : null;

// In-memory demo store for fallback auth when standalone
const users = new Map([
  [
    "admin",
    {
      userId: "00000000-0000-0000-0000-000000000001",
      fullName: "Quản trị GOAN",
      email: "admin@goan.local",
      phone: "0900000000",
      username: "admin",
      password: "123456",
    },
  ],
]);

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function handleMockAuth(req, res, urlPath) {
  if (req.method === "POST" && urlPath === "/api/auth/login") {
    readJsonBody(req)
      .then((body) => {
        const { identifier, password } = body || {};
        if (!identifier || !password) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ message: "Vui lòng nhập tên đăng nhập và mật khẩu." }));
          return;
        }

        const user = Array.from(users.values()).find(
          (u) =>
            (u.username && u.username.toLowerCase() === identifier.toLowerCase()) ||
            (u.email && u.email.toLowerCase() === identifier.toLowerCase()) ||
            u.phone === identifier
        );

        if (!user || user.password !== password) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ message: "Tên đăng nhập hoặc mật khẩu không chính xác." }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(
          JSON.stringify({
            userId: user.userId,
            fullName: user.fullName,
            message: "Đăng nhập thành công",
          })
        );
      })
      .catch(() => {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ message: "Dữ liệu yêu cầu không hợp lệ." }));
      });
    return true;
  }

  if (req.method === "POST" && urlPath === "/api/auth/register") {
    readJsonBody(req)
      .then((body) => {
        const { fullName, phone, email, username, password } = body || {};
        if (!fullName || !username || !password) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ message: "Vui lòng nhập đầy đủ các trường bắt buộc." }));
          return;
        }

        const exists = Array.from(users.values()).some(
          (u) =>
            u.username.toLowerCase() === username.toLowerCase() ||
            (email && u.email && u.email.toLowerCase() === email.toLowerCase()) ||
            (phone && u.phone && u.phone === phone)
        );

        if (exists) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ message: "Tên đăng nhập, email hoặc số điện thoại đã tồn tại." }));
          return;
        }

        const newUser = {
          userId: crypto.randomUUID(),
          fullName,
          phone: phone || "",
          email: email || "",
          username,
          password,
        };
        users.set(username.toLowerCase(), newUser);

        res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
        res.end(
          JSON.stringify({
            userId: newUser.userId,
            fullName: newUser.fullName,
            message: "Đăng ký thành công",
          })
        );
      })
      .catch(() => {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ message: "Dữ liệu yêu cầu không hợp lệ." }));
      });
    return true;
  }

  return false;
}

function proxyToBackend(req, res, targetBase) {
  try {
    const targetUrl = new URL(req.url, targetBase);
    const client = targetUrl.protocol === "https:" ? https : http;
    const proxyReq = client.request(
      targetUrl,
      {
        method: req.method,
        headers: {
          ...req.headers,
          host: targetUrl.host,
        },
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      }
    );

    proxyReq.on("error", (err) => {
      console.error(`Proxy to backend ${targetBase} failed:`, err.message);
      // Fallback to mock auth if it was an auth route
      const urlPath = req.url ? req.url.split("?")[0] : "/";
      if (handleMockAuth(req, res, urlPath)) {
        return;
      }
      res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          message: `Không thể kết nối đến máy chủ backend tại ${targetBase}.`,
        })
      );
    });

    req.pipe(proxyReq, { end: true });
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ message: "Lỗi chuyển tiếp yêu cầu tới backend." }));
  }
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const urlPath = req.url ? req.url.split("?")[0] : "/";

  // Handle /api routes
  if (urlPath.startsWith("/api")) {
    if (BACKEND_URL) {
      proxyToBackend(req, res, BACKEND_URL);
      return;
    }

    if (handleMockAuth(req, res, urlPath)) {
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ message: `API endpoint ${urlPath} không tồn tại.` }));
    return;
  }

  // Handle static assets & SPA fallback
  let safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(DIST_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        // SPA Fallback: Return index.html ONLY for non-API page routes
        const indexPath = path.join(DIST_DIR, "index.html");
        fs.readFile(indexPath, (indexErr, indexContent) => {
          if (indexErr) {
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("500 - Internal Server Error: Build output not found.");
            return;
          }
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(indexContent);
        });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`GOAN server running on http://0.0.0.0:${PORT}`);
  if (BACKEND_URL) {
    console.log(`Proxying /api requests to ${BACKEND_URL}`);
  } else {
    console.log(`Running in standalone demo mode with built-in auth`);
  }
});
