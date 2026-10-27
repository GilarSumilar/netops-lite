import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { createServer as createHttpServer } from "node:http";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const collections = new Set([
  "pelanggan",
  "paket",
  "tagihan",
  "pengaduan",
  "akun",
]);
const prefixes = {
  pelanggan: "CUST",
  paket: "PKT",
  tagihan: "INV",
  pengaduan: "TKT",
  akun: "USR",
};
const roles = new Set(["admin", "teknisi", "pelanggan"]);
const defaultDataPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "data",
  "netops.json",
);
const sessionMaxAge = 8 * 60 * 60 * 1000;

function sendJson(response, status, value, headers = {}) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    ...headers,
  });
  response.end(JSON.stringify(value));
}

function passwordRecord(password, salt = randomBytes(16).toString("hex")) {
  return {
    passwordSalt: salt,
    passwordHash: scryptSync(password, salt, 64).toString("hex"),
  };
}

function validPassword(password, account) {
  if (
    typeof password !== "string" ||
    !account.passwordSalt ||
    !account.passwordHash
  )
    return false;
  const expected = Buffer.from(account.passwordHash, "hex");
  const actual = Buffer.from(
    scryptSync(password, account.passwordSalt, 64).toString("hex"),
    "hex",
  );
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

async function readDatabase(dataPath) {
  const data = JSON.parse(await readFile(dataPath, "utf8"));
  for (const collection of collections) {
    if (!Array.isArray(data[collection])) {
      throw new Error(`Koleksi "${collection}" harus berupa array.`);
    }
  }
  return data;
}

async function saveDatabase(dataPath, data) {
  await mkdir(dirname(dataPath), { recursive: true });
  const temporaryPath = `${dataPath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await rename(temporaryPath, dataPath);
}

async function initializeDatabase(dataPath) {
  const data = await readDatabase(dataPath);
  const seedAccounts = [
    {
      email: "budi.santoso@netops.id",
      name: "Budi Santoso",
      role: "admin",
      title: "Administrator",
      password: "NetOpsNOC#2025Secure",
    },
    {
      email: "dani.pratama@netops.id",
      name: "Dani Pratama",
      role: "teknisi",
      title: "Teknisi Jaringan",
      password: "TeknisiDemo#2025",
    },
    {
      email: "agus@example.com",
      name: "Bpk. Agus Setiawan",
      role: "pelanggan",
      title: "Pelanggan",
      customerId: "CUST-001",
      password: "pelanggan123",
    },
  ];
  let changed = false;
  for (const seed of seedAccounts) {
    if (data.akun.some((account) => account.email.toLowerCase() === seed.email))
      continue;
    const { password, ...profile } = seed;
    const credentials = passwordRecord(password);
    data.akun.push({
      id: `USR-${String(data.akun.length + 1).padStart(3, "0")}`,
      ...profile,
      ...credentials,
      active: true,
    });
    changed = true;
  }
  for (const invoice of data.tagihan) {
    if (invoice.pelangganId) continue;
    const customer = data.pelanggan.find((item) => item.name === invoice.nama);
    if (customer) {
      invoice.pelangganId = customer.id;
      changed = true;
    }
  }
  for (const ticket of data.pengaduan) {
    if (ticket.pelangganId) continue;
    const customer = data.pelanggan.find(
      (item) => item.name === ticket.pelanggan,
    );
    if (customer) {
      ticket.pelangganId = customer.id;
      changed = true;
    }
  }
  if (changed) await saveDatabase(dataPath, data);
}

async function readBody(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 1_000_000) {
      throw Object.assign(new Error("Ukuran data melebihi batas 1 MB."), {
        status: 413,
      });
    }
  }
  try {
    return JSON.parse(body);
  } catch {
    throw Object.assign(new Error("Body harus berupa JSON yang valid."), {
      status: 400,
    });
  }
}

function cookieValue(request, name) {
  const cookie = request.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : "";
}

function publicAccount(account, data) {
  const customer = data.pelanggan.find(
    (record) =>
      record.id === account.customerId ||
      record.email?.toLowerCase() === account.email.toLowerCase(),
  );
  return {
    id: customer?.id || account.id,
    accountId: account.id,
    name: customer?.name || account.name,
    email: account.email,
    role: account.role,
    title: account.title,
    active: account.active,
    phone: customer?.phone || account.phone || "",
    address: customer?.address || account.address || "",
    initials:
      customer?.initials ||
      account.name
        .split(/\s+/)
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    customerId: customer?.id || null,
    subscriptionStatus: customer ? customer.status : "belum_berlangganan",
  };
}

function sessionCookie(token, secure) {
  return `netops_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionMaxAge / 1000}${secure ? "; Secure" : ""}`;
}

async function handleRouterWrite(
  request,
  response,
  account,
  routerAction,
  dataPath,
) {
  // POST /api/router/kick-user
  if (request.method === "POST" && routerAction === "kick-user") {
    if (account.role !== "admin") {
      sendJson(response, 403, {
        error: "Hanya admin yang dapat memutus sesi pelanggan.",
      });
      return;
    }
    const payload = await readBody(request);
    const { sessionId, username } = payload || {};
    if (!sessionId && !username) {
      sendJson(response, 400, {
        error: "sessionId atau username wajib diisi.",
      });
      return;
    }
    await new Promise((r) => setTimeout(r, 350));
    sendJson(response, 200, {
      ok: true,
      message: `Sesi ${username || sessionId} berhasil diputus.`,
      kickedAt: new Date().toISOString(),
    });
    return;
  }

  // GET /api/router/settings
  if (request.method === "GET" && routerAction === "settings") {
    const currentData = await readDatabase(dataPath);
    const s = currentData.routerSettings || {
      host: "",
      port: "8728",
      username: "admin",
      password: "",
      useSSL: false,
    };
    sendJson(response, 200, { ...s, password: s.password ? "••••••••" : "" });
    return;
  }

  // PUT /api/router/settings
  if (request.method === "PUT" && routerAction === "settings") {
    if (account.role !== "admin") {
      sendJson(response, 403, {
        error: "Hanya admin yang dapat mengubah pengaturan router.",
      });
      return;
    }
    const payload = await readBody(request);
    if (!String(payload.host || "").trim()) {
      sendJson(response, 400, { error: "IP Address router wajib diisi." });
      return;
    }
    const currentData = await readDatabase(dataPath);
    currentData.routerSettings = {
      host: String(payload.host || "").trim(),
      port: String(payload.port || "8728").trim(),
      username: String(payload.username || "admin").trim(),
      password: String(payload.password || "").trim(),
      useSSL: Boolean(payload.useSSL),
    };
    await saveDatabase(dataPath, currentData);
    sendJson(response, 200, {
      ok: true,
      message: "Pengaturan router berhasil disimpan.",
    });
    return;
  }

  sendJson(response, 404, { error: "Endpoint router tidak ditemukan." });
}

export function createApiServer({
  dataPath = defaultDataPath,
  seedDemoAccounts = true,
} = {}) {
  let writes = Promise.resolve();
  const sessions = new Map();
  const ready = seedDemoAccounts
    ? initializeDatabase(dataPath)
    : Promise.resolve();

  return createHttpServer(async (request, response) => {
    const url = new URL(request.url, "http://localhost");
    const segments = url.pathname.split("/").filter(Boolean);
    const [resource, rawId, ...tail] = segments;
    const secure = Boolean(request.socket.encrypted);

    try {
      await ready;
      if (resource !== "api") {
        sendJson(response, 404, { error: "Endpoint tidak ditemukan." });
        return;
      }

      const data = await readDatabase(dataPath);
      const token = cookieValue(request, "netops_session");
      const session = sessions.get(token);
      if (session && session.expiresAt <= Date.now()) sessions.delete(token);
      const currentSession = sessions.get(token);
      const account = currentSession
        ? data.akun.find(
            (item) => item.id === currentSession.userId && item.active,
          )
        : null;

      if (
        rawId === "auth" &&
        tail[0] === "login" &&
        request.method === "POST"
      ) {
        const payload = await readBody(request);
        const identifier = String(payload.identifier || "")
          .trim()
          .toLowerCase();
        const user = data.akun.find(
          (item) =>
            item.email.toLowerCase() === identifier ||
            item.customerId?.toLowerCase() === identifier,
        );
        if (!user || !user.active || !validPassword(payload.password, user)) {
          sendJson(response, 401, {
            error: "Email/ID atau kata sandi tidak sesuai.",
          });
          return;
        }
        const sessionId = randomBytes(32).toString("hex");
        sessions.set(sessionId, {
          userId: user.id,
          expiresAt: Date.now() + sessionMaxAge,
        });
        sendJson(
          response,
          200,
          { user: publicAccount(user, data) },
          {
            "set-cookie": sessionCookie(sessionId, secure),
          },
        );
        return;
      }

      if (
        rawId === "auth" &&
        tail[0] === "register" &&
        request.method === "POST"
      ) {
        const payload = await readBody(request);
        const email = String(payload.email || "")
          .trim()
          .toLowerCase();
        const name = String(payload.name || "").trim();
        if (
          name.length < 2 ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
          String(payload.password || "").length < 8
        ) {
          sendJson(response, 400, {
            error:
              "Nama, email valid, dan kata sandi minimal 8 karakter wajib diisi.",
          });
          return;
        }
        if (data.akun.some((item) => item.email.toLowerCase() === email)) {
          sendJson(response, 409, { error: "Email sudah terdaftar." });
          return;
        }
        const customer = data.pelanggan.find(
          (item) => item.email?.toLowerCase() === email,
        );
        const credentials = passwordRecord(payload.password);
        const user = {
          id: `USR-${String(data.akun.length + 1).padStart(3, "0")}`,
          name,
          email,
          role: "pelanggan",
          title: "Pelanggan",
          customerId: customer?.id || null,
          active: true,
          ...credentials,
        };
        data.akun.push(user);
        await saveDatabase(dataPath, data);
        sendJson(response, 201, { user: publicAccount(user, data) });
        return;
      }

      if (rawId === "auth" && tail[0] === "me" && request.method === "GET") {
        if (!account) {
          sendJson(response, 401, {
            error: "Sesi tidak ditemukan atau sudah berakhir.",
          });
          return;
        }
        sendJson(response, 200, { user: publicAccount(account, data) });
        return;
      }

      if (
        rawId === "auth" &&
        tail[0] === "password" &&
        request.method === "POST"
      ) {
        if (!account) {
          sendJson(response, 401, {
            error: "Silakan masuk untuk mengakses data.",
          });
          return;
        }
        const payload = await readBody(request);
        if (!validPassword(payload.currentPassword, account)) {
          sendJson(response, 400, {
            error: "Kata sandi saat ini tidak sesuai.",
          });
          return;
        }
        if (
          typeof payload.newPassword !== "string" ||
          payload.newPassword.length < 8
        ) {
          sendJson(response, 400, {
            error: "Kata sandi baru minimal 8 karakter.",
          });
          return;
        }
        Object.assign(account, passwordRecord(payload.newPassword));
        await saveDatabase(dataPath, data);
        sendJson(response, 200, { ok: true });
        return;
      }

      if (
        rawId === "auth" &&
        tail[0] === "logout" &&
        request.method === "POST"
      ) {
        if (token) sessions.delete(token);
        sendJson(
          response,
          200,
          { ok: true },
          {
            "set-cookie":
              "netops_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0",
          },
        );
        return;
      }

      if (!account) {
        sendJson(response, 401, {
          error: "Silakan masuk untuk mengakses data.",
        });
        return;
      }

      if (
        rawId === "portal" &&
        account.role === "pelanggan" &&
        request.method === "GET" &&
        !tail.length
      ) {
        const user = publicAccount(account, data);
        const customer =
          data.pelanggan.find((item) => item.id === user.customerId) || null;
        const matchesCustomer = (record) =>
          record.accountId === account.id ||
          (customer &&
            (record.pelangganId === customer.id ||
              record.nama === customer.name ||
              record.pelanggan === customer.name));
        sendJson(response, 200, {
          user,
          customer,
          paket: customer
            ? data.paket.find((item) => item.name === customer.paket) || null
            : null,
          paketTersedia: data.paket.filter((item) => item.active),
          tagihan: data.tagihan.filter(matchesCustomer),
          pengaduan: data.pengaduan.filter(matchesCustomer),
        });
        return;
      }

      if (
        rawId === "portal" &&
        tail[0] === "profile" &&
        account.role === "pelanggan" &&
        request.method === "PUT"
      ) {
        const payload = await readBody(request);
        const name = String(payload.name || "").trim();
        const email = String(payload.email || "")
          .trim()
          .toLowerCase();
        if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          sendJson(response, 400, {
            error: "Nama minimal 2 karakter dan email harus valid.",
          });
          return;
        }
        if (
          data.akun.some(
            (item) =>
              item.id !== account.id && item.email.toLowerCase() === email,
          )
        ) {
          sendJson(response, 409, {
            error: "Email sudah digunakan akun lain.",
          });
          return;
        }
        account.name = name;
        account.email = email;
        account.phone = String(payload.phone || "");
        account.address = String(payload.address || "");
        const customer = data.pelanggan.find(
          (item) =>
            item.id === account.customerId ||
            item.email?.toLowerCase() === email,
        );
        if (customer) {
          account.customerId = customer.id;
          customer.name = name;
          customer.initials = name
            .split(/\s+/)
            .map((word) => word[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
          customer.email = email;
          customer.phone = String(payload.phone || customer.phone || "");
          customer.address = String(payload.address || customer.address || "");
        }
        await saveDatabase(dataPath, data);
        sendJson(response, 200, {
          user: publicAccount(account, data),
          customer,
        });
        return;
      }

      if (
        rawId === "portal" &&
        tail[0] === "pengaduan" &&
        account.role === "pelanggan" &&
        request.method === "POST"
      ) {
        const payload = await readBody(request);
        if (
          !String(payload.judul || "").trim() ||
          !String(payload.desc || "").trim()
        ) {
          sendJson(response, 400, {
            error: "Judul dan deskripsi pengaduan wajib diisi.",
          });
          return;
        }
        const user = publicAccount(account, data);
        const record = {
          id: `TKT-${String(data.pengaduan.length + 1).padStart(3, "0")}`,
          judul: String(payload.judul).trim(),
          desc: String(payload.desc).trim(),
          pelanggan: user.name,
          pelangganId: user.customerId,
          accountId: account.id,
          waktu: new Date().toLocaleString("id-ID"),
          prioritas: "normal",
          status: "baru",
          iconName: "support_agent",
          catatan: "",
        };
        data.pengaduan.push(record);
        await saveDatabase(dataPath, data);
        sendJson(response, 201, record);
        return;
      }

      if (resource === "api" && rawId === "akun") {
        if (account.role !== "admin") {
          sendJson(response, 403, {
            error: "Hanya admin yang dapat mengelola akun staf.",
          });
          return;
        }
        const accounts = data.akun.filter((item) => item.role !== "pelanggan");
        if (request.method === "GET" && !tail.length) {
          sendJson(
            response,
            200,
            accounts.map((item) => publicAccount(item, data)),
          );
          return;
        }
        const target = data.akun.find(
          (item) => item.id === decodeURIComponent(tail[0] || ""),
        );
        if (request.method === "DELETE" && target) {
          if (target.id === account.id) {
            sendJson(response, 400, {
              error: "Akun yang sedang digunakan tidak dapat dinonaktifkan.",
            });
            return;
          }
          if (
            target.role === "admin" &&
            target.active &&
            data.akun.filter((item) => item.role === "admin" && item.active)
              .length <= 1
          ) {
            sendJson(response, 400, {
              error: "Sistem harus memiliki minimal satu admin aktif.",
            });
            return;
          }
          target.active = false;
          await saveDatabase(dataPath, data);
          sendJson(response, 200, publicAccount(target, data));
          return;
        }
        if (request.method === "POST" && !tail.length) {
          const payload = await readBody(request);
          const email = String(payload.email || "")
            .trim()
            .toLowerCase();
          const name = String(payload.name || "").trim();
          const password = String(payload.password || "");
          if (
            name.length < 2 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
            password.length < 8 ||
            !roles.has(payload.role) ||
            payload.role === "pelanggan"
          ) {
            sendJson(response, 400, {
              error:
                "Nama, email valid, kata sandi minimal 8 karakter, serta role admin/teknisi wajib diisi.",
            });
            return;
          }
          if (data.akun.some((item) => item.email.toLowerCase() === email)) {
            sendJson(response, 409, { error: "Email sudah digunakan." });
            return;
          }
          const credentials = passwordRecord(password);
          const created = {
            id: `USR-${String(data.akun.length + 1).padStart(3, "0")}`,
            name,
            email,
            role: payload.role,
            title:
              payload.role === "admin" ? "Administrator" : "Teknisi Jaringan",
            active: true,
            ...credentials,
          };
          data.akun.push(created);
          await saveDatabase(dataPath, data);
          sendJson(response, 201, publicAccount(created, data));
          return;
        }
        if (request.method === "PUT" && target) {
          const payload = await readBody(request);
          const email = String(payload.email ?? target.email)
            .trim()
            .toLowerCase();
          if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
            !roles.has(payload.role ?? target.role) ||
            (payload.role ?? target.role) === "pelanggan"
          ) {
            sendJson(response, 400, { error: "Email atau role tidak valid." });
            return;
          }
          if (
            data.akun.some(
              (item) =>
                item.id !== target.id && item.email.toLowerCase() === email,
            )
          ) {
            sendJson(response, 409, { error: "Email sudah digunakan." });
            return;
          }
          const nextRole = payload.role ?? target.role;
          if (
            target.id === account.id &&
            (nextRole !== "admin" || payload.active === false)
          ) {
            sendJson(response, 400, {
              error: "Role admin yang sedang digunakan tidak dapat diubah.",
            });
            return;
          }
          if (
            target.role === "admin" &&
            target.active &&
            (nextRole !== "admin" || payload.active === false) &&
            data.akun.filter((item) => item.role === "admin" && item.active)
              .length <= 1
          ) {
            sendJson(response, 400, {
              error: "Sistem harus memiliki minimal satu admin aktif.",
            });
            return;
          }
          target.name = String(payload.name ?? target.name).trim();
          target.email = email;
          target.role = nextRole;
          target.title =
            target.role === "admin" ? "Administrator" : "Teknisi Jaringan";
          if (typeof payload.active === "boolean")
            target.active = payload.active;
          if (payload.password) {
            if (String(payload.password).length < 8) {
              sendJson(response, 400, {
                error: "Kata sandi minimal 8 karakter.",
              });
              return;
            }
            Object.assign(target, passwordRecord(payload.password));
          }
          await saveDatabase(dataPath, data);
          sendJson(response, 200, publicAccount(target, data));
          return;
        }
        sendJson(response, target ? 405 : 404, {
          error: target ? "Metode tidak didukung." : "Akun tidak ditemukan.",
        });
        return;
      }

      // ── Router / MikroTik endpoints ──────────────────────────────
      if (rawId === "router") {
        if (!["admin", "teknisi"].includes(account.role)) {
          sendJson(response, 403, { error: "Akses ditolak." });
          return;
        }
        const routerAction = tail[0];

        // GET /api/router/status
        if (request.method === "GET" && routerAction === "status") {
          const ups = Math.floor(Date.now() / 1000) % (30 * 24 * 3600);
          const d = Math.floor(ups / 86400);
          const h = Math.floor((ups % 86400) / 3600);
          const m = Math.floor((ups % 3600) / 60);
          const s = ups % 60;
          const pad = (n) => String(n).padStart(2, "0");
          sendJson(response, 200, {
            connected: true,
            boardName: "MikroTik RB4011iGS+RM",
            routerOsVersion: "7.14.2 (stable)",
            model: "RB4011iGS+",
            serialNumber: "HGX081234ABCD",
            uptime: `${d}d ${pad(h)}:${pad(m)}:${pad(s)}`,
            cpuLoad: Math.floor(Math.random() * 40) + 10,
            cpuCount: 4,
            cpuFrequency: 1400,
            freeMemory: Math.floor(Math.random() * 300) + 400,
            totalMemory: 1024,
            freeHddSpace: Math.floor(Math.random() * 200) + 400,
            totalHddSpace: 512,
            temperature: Math.floor(Math.random() * 10) + 48,
            timestamp: new Date().toISOString(),
          });
          return;
        }

        // GET /api/router/traffic
        if (request.method === "GET" && routerAction === "traffic") {
          sendJson(response, 200, {
            interfaces: [
              {
                name: "ether1",
                comment: "WAN - Upstream Provider",
                txBps: Math.floor(Math.random() * 80_000_000) + 5_000_000,
                rxBps: Math.floor(Math.random() * 200_000_000) + 20_000_000,
                running: true,
              },
              {
                name: "ether2",
                comment: "LAN - Core Switch",
                txBps: Math.floor(Math.random() * 180_000_000) + 15_000_000,
                rxBps: Math.floor(Math.random() * 75_000_000) + 4_000_000,
                running: true,
              },
              {
                name: "pppoe-out1",
                comment: "PPPoE Client ke ISP",
                txBps: Math.floor(Math.random() * 75_000_000) + 3_000_000,
                rxBps: Math.floor(Math.random() * 190_000_000) + 18_000_000,
                running: true,
              },
            ],
            timestamp: new Date().toISOString(),
          });
          return;
        }

        // GET /api/router/pppoe-active
        if (request.method === "GET" && routerAction === "pppoe-active") {
          const sessions = [
            {
              id: ".1",
              name: "pppoe-CUST001",
              service: "pppoe",
              callerId: "AA:BB:CC:11:22:01",
              address: "10.10.1.2",
              uptime: "2d 03:14:22",
            },
            {
              id: ".2",
              name: "pppoe-CUST002",
              service: "pppoe",
              callerId: "AA:BB:CC:11:22:02",
              address: "10.10.1.3",
              uptime: "5h 42:08",
            },
            {
              id: ".3",
              name: "pppoe-CUST003",
              service: "pppoe",
              callerId: "AA:BB:CC:11:22:03",
              address: "10.10.1.4",
              uptime: "1d 11:05:33",
            },
            {
              id: ".4",
              name: "pppoe-CUST004",
              service: "pppoe",
              callerId: "AA:BB:CC:11:22:04",
              address: "10.10.1.5",
              uptime: "0d 00:22:17",
            },
            {
              id: ".5",
              name: "pppoe-CUST005",
              service: "pppoe",
              callerId: "AA:BB:CC:11:22:05",
              address: "10.10.1.6",
              uptime: "3d 07:58:44",
            },
            {
              id: ".6",
              name: "hs-CUST006",
              service: "hotspot",
              callerId: "AA:BB:CC:11:22:06",
              address: "192.168.88.10",
              uptime: "0d 01:14:09",
            },
            {
              id: ".7",
              name: "pppoe-CUST007",
              service: "pppoe",
              callerId: "AA:BB:CC:11:22:07",
              address: "10.10.1.7",
              uptime: "6d 22:11:02",
            },
            {
              id: ".8",
              name: "hs-CUST008",
              service: "hotspot",
              callerId: "AA:BB:CC:11:22:08",
              address: "192.168.88.11",
              uptime: "0d 00:08:55",
            },
          ];
          sendJson(response, 200, {
            sessions,
            total: sessions.length,
            timestamp: new Date().toISOString(),
          });
          return;
        }

        // POST /api/router/kick-user  |  GET|PUT /api/router/settings
        await handleRouterWrite(
          request,
          response,
          account,
          routerAction,
          dataPath,
        );
        return;
      }
      // ── End Router / MikroTik ─────────────────────────────────────

      const collection = rawId;
      const id = tail[0];
      if (!collections.has(collection) || collection === "akun") {
        sendJson(response, 404, { error: "Koleksi tidak dikenal." });
        return;
      }
      const isAdmin = account.role === "admin";
      const isTechnicianRead =
        account.role === "teknisi" &&
        request.method === "GET" &&
        ["pelanggan", "pengaduan"].includes(collection);
      const isTechnicianTicketUpdate =
        account.role === "teknisi" &&
        collection === "pengaduan" &&
        request.method === "PUT" &&
        Boolean(id);
      if (!isAdmin && !isTechnicianRead && !isTechnicianTicketUpdate) {
        sendJson(response, 403, {
          error: "Role Anda tidak memiliki akses ke data ini.",
        });
        return;
      }
      if (request.method === "GET") {
        const records = data[collection];
        const record = id
          ? records.find((item) => String(item.id) === decodeURIComponent(id))
          : records;
        const visible =
          record && account.role === "teknisi" && collection === "pelanggan"
            ? (Array.isArray(record) ? record : [record]).map(
                ({ email, ...customer }) => customer,
              )
            : record;
        sendJson(
          response,
          record ? 200 : 404,
          visible || { error: "Data tidak ditemukan." },
        );
        return;
      }
      if (!["POST", "PUT", "DELETE"].includes(request.method)) {
        response.setHeader("allow", "GET, POST, PUT, DELETE");
        sendJson(response, 405, { error: "Metode tidak didukung." });
        return;
      }
      if (
        (request.method === "POST" && id) ||
        (request.method !== "POST" && !id)
      ) {
        sendJson(response, 404, { error: "Endpoint tidak ditemukan." });
        return;
      }

      const result = await new Promise((resolveWrite, rejectWrite) => {
        writes = writes
          .then(async () => {
            try {
              const currentData = await readDatabase(dataPath);
              const records = currentData[collection];
              const index = id
                ? records.findIndex(
                    (record) => String(record.id) === decodeURIComponent(id),
                  )
                : -1;
              if (id && index < 0) {
                resolveWrite({
                  status: 404,
                  value: { error: "Data tidak ditemukan." },
                });
                return;
              }
              if (request.method === "DELETE") {
                const [deleted] = records.splice(index, 1);
                await saveDatabase(dataPath, currentData);
                resolveWrite({ status: 200, value: deleted });
                return;
              }
              const payload = await readBody(request);
              if (
                !payload ||
                typeof payload !== "object" ||
                Array.isArray(payload)
              ) {
                resolveWrite({
                  status: 400,
                  value: { error: "Body harus berupa object JSON." },
                });
                return;
              }
              if (request.method === "POST") {
                const nextNumber =
                  records.reduce((max, record) => {
                    const match = String(record.id).match(/-(\d+)$/);
                    return match ? Math.max(max, Number(match[1])) : max;
                  }, 0) + 1;
                const recordPayload = { ...payload };
                if (collection === "tagihan") {
                  const customer = currentData.pelanggan.find(
                    (item) =>
                      item.id === payload.pelangganId ||
                      item.id === payload.nama ||
                      item.name === payload.nama,
                  );
                  if (customer) {
                    recordPayload.pelangganId = customer.id;
                    recordPayload.nama = customer.name;
                  }
                }
                if (collection === "pengaduan") {
                  const customer = currentData.pelanggan.find(
                    (item) =>
                      item.id === payload.pelangganId ||
                      item.id === payload.pelanggan ||
                      item.name === payload.pelanggan,
                  );
                  if (customer) {
                    recordPayload.pelangganId = customer.id;
                    recordPayload.pelanggan = customer.name;
                  }
                }
                const record = {
                  ...recordPayload,
                  id:
                    payload.id ||
                    `${prefixes[collection]}-${String(nextNumber).padStart(3, "0")}`,
                };
                if (
                  records.some((item) => String(item.id) === String(record.id))
                ) {
                  resolveWrite({
                    status: 409,
                    value: { error: "ID data sudah digunakan." },
                  });
                  return;
                }
                records.push(record);
                await saveDatabase(dataPath, currentData);
                resolveWrite({ status: 201, value: record });
                return;
              }
              let record;
              if (!isAdmin) {
                if (!["baru", "proses", "selesai"].includes(payload.status)) {
                  resolveWrite({
                    status: 400,
                    value: { error: "Status tiket tidak valid." },
                  });
                  return;
                }
                record = {
                  ...records[index],
                  status: payload.status,
                  catatan: String(
                    payload.catatan ?? records[index].catatan ?? "",
                  ),
                  id: records[index].id,
                };
              } else {
                record = {
                  ...records[index],
                  ...payload,
                  id: records[index].id,
                };
              }
              records[index] = record;
              await saveDatabase(dataPath, currentData);
              resolveWrite({ status: 200, value: record });
            } catch (error) {
              rejectWrite(error);
            }
          })
          .catch(rejectWrite);
      });
      sendJson(response, result.status, result.value);
    } catch (error) {
      sendJson(response, error.status || 500, { error: error.message });
    }
  });
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const port = Number(process.env.API_PORT || 3001);
  const server = createApiServer();
  server.listen(port, () =>
    console.log(`JSON API berjalan di http://localhost:${port}`),
  );
  server.on("error", (error) => {
    console.error("Gagal menjalankan JSON API:", error);
    process.exitCode = 1;
  });
}
