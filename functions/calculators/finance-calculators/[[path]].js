function goneResponse() {
  return new Response('Gone', {
    status: 410,
    headers: {
      'cache-control': 'public, max-age=600',
      'content-type': 'text/plain; charset=UTF-8',
    },
  });
}

export function onRequestGet() {
  return goneResponse();
}

export function onRequestHead() {
  return goneResponse();
}

export function onRequest() {
  return goneResponse();
}
