self.addEventListener('push', event => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {
    data = { body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'Jugs & Mugs Staff Hub';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || 'You have a new announcement.',
      data: { url: data.url || './' },
      tag: 'jugs-mugs-captain-alert',
      renotify: true
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  let requested = event.notification.data?.url || './';
  if (requested === '/') requested = './';

  const target = new URL(requested, self.registration.scope).href;

  event.waitUntil((async () => {
    const openClients = await clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    for (const client of openClients) {
      if (client.url.startsWith(self.registration.scope)) {
        await client.focus();
        if ('navigate' in client) await client.navigate(target);
        return;
      }
    }

    if (clients.openWindow) await clients.openWindow(target);
  })());
});
