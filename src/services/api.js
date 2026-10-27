const baseUrl = '/api'

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    credentials: 'same-origin',
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...options.headers,
    },
  })
  const payload = await response.json()
  if (!response.ok) {
    throw Object.assign(new Error(payload.error || `Permintaan gagal (${response.status}).`), {
      status: response.status,
    })
  }
  return payload
}

export const api = {
  login: credentials => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: credentials => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  session: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),
  portal: () => request('/portal'),
  portalTicket: ticket => request('/portal/pengaduan', {
    method: 'POST',
    body: JSON.stringify(ticket),
  }),
  portalProfile: profile => request('/portal/profile', {
    method: 'PUT',
    body: JSON.stringify(profile),
  }),
  changePassword: passwords => request('/auth/password', {
    method: 'POST',
    body: JSON.stringify(passwords),
  }),
  list: collection => request(`/${collection}`),
  create: (collection, record) => request(`/${collection}`, {
    method: 'POST',
    body: JSON.stringify(record),
  }),
  update: (collection, id, record) => request(`/${collection}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(record),
  }),
  remove: (collection, id) => request(`/${collection}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }),
  accounts: () => request('/akun'),
  createAccount: account => request('/akun', {
    method: 'POST',
    body: JSON.stringify(account),
  }),
  updateAccount: (id, account) => request(`/akun/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(account),
  }),
  deactivateAccount: id => request(`/akun/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }),

  // ── Router / MikroTik ────────────────────────────────────────────
  routerStatus:    () => request('/router/status'),
  routerTraffic:   () => request('/router/traffic'),
  routerSessions:  () => request('/router/pppoe-active'),
  routerKickUser:  payload => request('/router/kick-user', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  routerSettings:     () => request('/router/settings'),
  routerSaveSettings: settings => request('/router/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  }),
}
