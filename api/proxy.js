export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);

  const target = "https://my.koom.pp.ua" + url.pathname + url.search;

  const headers = new Headers(req.headers);

  // força host correto (muito importante)
  headers.set("host", "my.koom.pp.ua");

  return fetch(target, {
    method: req.method,
    headers,
    body: req.body,
    redirect: "manual"
  });
}
