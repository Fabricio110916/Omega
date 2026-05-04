export default async function handler(req, res) {
  const target = "https://my.koom.pp.ua" + req.url;

  try {
    const headers = { ...req.headers };

    headers.host = "my.koom.pp.ua";
    headers["x-forwarded-for"] = req.socket?.remoteAddress || "1.1.1.1";
    headers["x-real-ip"] = headers["x-forwarded-for"];

    const response = await fetch(target, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req,
      duplex: "half",
      redirect: "manual",
      // força comportamento mais simples
      cache: "no-store"
    });

    res.writeHead(response.status, Object.fromEntries(response.headers));

    if (response.body) {
      response.body.pipe(res);
    } else {
      res.end();
    }

  } catch (err) {
    console.error(err);
    res.status(502).send("Bad Gateway: " + err.message);
  }
}
