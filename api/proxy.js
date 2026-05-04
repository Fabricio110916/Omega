export default async function handler(req, res) {
  const target = "https://my.koom.pp.ua" + req.url;

  try {
    // copia headers e ajusta host
    const headers = { ...req.headers };
    headers.host = "my.koom.pp.ua";

    // remove headers problemáticos
    delete headers["content-length"];
    delete headers["transfer-encoding"];
    delete headers["connection"];

    const response = await fetch(target, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req,
      redirect: "manual"
    });

    // status
    res.status(response.status);

    // repassa headers (filtrando alguns)
    response.headers.forEach((value, key) => {
      if (!["content-encoding", "transfer-encoding", "connection"].includes(key)) {
        res.setHeader(key, value);
      }
    });

    // 🔥 STREAM (não usar arrayBuffer)
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
