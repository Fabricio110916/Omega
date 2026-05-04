export default async function handler(req, res) {
  const target = "https://my.koom.pp.ua" + req.url;

  try {
    const headers = { ...req.headers };
    headers.host = "my.koom.pp.ua";

    delete headers["content-length"];
    delete headers["transfer-encoding"];
    delete headers["connection"];

    const isBodyAllowed = !["GET", "HEAD"].includes(req.method);

    const response = await fetch(target, {
      method: req.method,
      headers,
      body: isBodyAllowed ? req : undefined,
      duplex: isBodyAllowed ? "half" : undefined, // 🔥 ESSENCIAL
      redirect: "manual"
    });

    res.status(response.status);

    response.headers.forEach((value, key) => {
      if (!["content-encoding", "transfer-encoding", "connection"].includes(key)) {
        res.setHeader(key, value);
      }
    });

    if (response.body) {
      response.body.pipe(res);
    } else {
      res.end();
    }

  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error: " + err.message);
  }
}
