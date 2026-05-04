export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);

  const target = "https://my.koom.pp.ua" + url.pathname + url.search;

  return fetch(target, {
    method: req.method,
    headers: req.headers,
    body: req.body
  });
}
