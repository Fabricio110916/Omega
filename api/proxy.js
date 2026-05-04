export default async function handler(req, res) {
  const targetBase = "https://my.koom.pp.ua";
  const targetUrl = targetBase + req.url;

  try {
    // clona headers e ajusta Host
    const headers = { ...req.headers };
    headers.host = "my.koom.pp.ua";

    // remove alguns problemáticos
    delete headers["content-length"];
    delete headers["transfer-encoding"];
    delete headers["connection"];

    const hasBody = !["GET", "HEAD"].includes(req.method);

    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: hasBody ? req : undefined,
      duplex: hasBody ? "half" : undefined, // necessário no Node/undici
      redirect: "manual",
      cache: "no-store",
    });

    // repassa status e headers
    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      if (!["transfer-encoding", "connection"].includes(key)) {
        res.setHeader(key, value);
      }
    });

    // stream da resposta
    if (upstream.body) {
      upstream.body.pipe(res);
    } else {
      res.end();
    }

  } catch (err) {
    // fallback: responde 200 OK se der erro no fetch
    console.error("Proxy error:", err);
    res.status(200).setHeader("Content-Type", "text/plain");
    res.end("OK");
  }
}
