export default async function handler(req, res) {
  const target = "https://my.koom.pp.ua" + req.url;

  try {
    const response = await fetch(target, {
      method: req.method,
      headers: {
        ...req.headers,
        host: "my.koom.pp.ua"
      },
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body
    });

    // status
    res.status(response.status);

    // headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // body
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));

  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
}
