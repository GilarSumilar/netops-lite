import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Root redirect
    { path: '/', redirect: '/admin/login' },

    // ── Admin ─────────────────────────────────────────────
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresStaff: true },
      children: [
        { path: '',          redirect: '/admin/dashboard' },
        { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/views/admin/DashboardView.vue') },
        { path: 'pelanggan', name: 'admin-pelanggan', component: () => import('@/views/admin/PelangganView.vue'), meta: { roles: ['admin', 'teknisi'] } },
        { path: 'paket',     name: 'admin-paket',     component: () => import('@/views/admin/PaketView.vue'), meta: { roles: ['admin'] } },
        { path: 'tagihan',   name: 'admin-tagihan',   component: () => import('@/views/admin/TagihanView.vue'), meta: { roles: ['admin'] } },
        { path: 'pengaduan',  name: 'admin-pengaduan',  component: () => import('@/views/admin/PengaduanView.vue'), meta: { roles: ['admin', 'teknisi'] } },
        { path: 'router',     name: 'admin-router',     component: () => import('@/views/admin/RouterView.vue'), meta: { roles: ['admin', 'teknisi'] } },
        { path: 'pengaturan', name: 'admin-pengaturan', component: () => import('@/views/admin/PengaturanView.vue'), meta: { roles: ['admin'] } },
        { path: 'akun', name: 'admin-akun', component: () => import('@/views/admin/AkunView.vue'), meta: { roles: ['admin'] } },
      ],
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/LoginView.vue'),
      meta: { layout: 'blank' },
    },

    // ── Portal Pelanggan ──────────────────────────────────
    {
      path: '/portal',
      component: () => import('@/layouts/PortalLayout.vue'),
      meta: { requiresCustomer: true },
      children: [
        { path: '',            redirect: '/portal/beranda' },
        { path: 'beranda',     name: 'portal-beranda',     component: () => import('@/views/portal/BerandaView.vue') },
        { path: 'tagihan',     name: 'portal-tagihan',     component: () => import('@/views/portal/TagihanView.vue') },
        { path: 'layanan',     name: 'portal-layanan',     component: () => import('@/views/portal/LayananView.vue') },
        { path: 'pengaduan',   name: 'portal-pengaduan',   component: () => import('@/views/portal/PengaduanView.vue') },
        { path: 'profil',      name: 'portal-profil',      component: () => import('@/views/portal/ProfilView.vue') },
        { path: 'simulasi-bayar', name: 'portal-simulasi', component: () => import('@/views/portal/SimulasiBayarView.vue') },
      ],
    },
    {
      path: '/portal/login',
      name: 'portal-login',
      component: () => import('@/views/portal/LoginView.vue'),
      meta: { layout: 'blank' },
    },
    {
      path: '/portal/register',
      name: 'portal-register',
      component: () => import('@/views/portal/RegisterView.vue'),
      meta: { layout: 'blank' },
    },

    // ── Kuitansi ──────────────────────────────────────────
    {
      path: '/kuitansi',
      component: () => import('@/layouts/BlankLayout.vue'),
      children: [
        { path: 'pratinjau-a4',   name: 'kuitansi-a4',       component: () => import('@/views/kuitansi/PratinjauA4View.vue') },
        { path: 'warna-vs-mono',  name: 'kuitansi-warna',    component: () => import('@/views/kuitansi/WarnaMononView.vue') },
        { path: 'overlay-diff',   name: 'kuitansi-overlay',  component: () => import('@/views/kuitansi/OverlayDiffView.vue') },
        { path: 'grid-margin',    name: 'kuitansi-grid',     component: () => import('@/views/kuitansi/GridMarginView.vue') },
        { path: 'heatmap',        name: 'kuitansi-heatmap',  component: () => import('@/views/kuitansi/HeatmapView.vue') },
      ],
    },

    // 404
    { path: '/:pathMatch(.*)*', redirect: '/admin/login' },
  ],
})

// Navigation guards
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  try {
    await auth.restoreSession()
  } catch (error) {
    if (to.meta.requiresStaff) return { name: 'admin-login', query: { unavailable: error.message } }
    if (to.meta.requiresCustomer) return { name: 'portal-login', query: { unavailable: error.message } }
  }

  if (to.meta.requiresStaff && !['admin', 'teknisi'].includes(auth.user?.role)) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresCustomer && !auth.isCustomer) {
    return { name: 'portal-login', query: { redirect: to.fullPath } }
  }
  if (to.meta.roles && !to.meta.roles.includes(auth.user?.role)) {
    return auth.user?.role === 'teknisi' ? { name: 'admin-dashboard' } : { name: 'admin-login' }
  }
  if (to.name === 'admin-login' && ['admin', 'teknisi'].includes(auth.user?.role)) {
    return { name: 'admin-dashboard' }
  }
  if (['portal-login', 'portal-register'].includes(to.name) && auth.isCustomer) {
    return { name: 'portal-beranda' }
  }
})

export default router
