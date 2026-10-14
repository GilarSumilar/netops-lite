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
      meta: { requiresAdmin: true },
      children: [
        { path: '',          redirect: '/admin/dashboard' },
        { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/views/admin/DashboardView.vue') },
        { path: 'pelanggan', name: 'admin-pelanggan', component: () => import('@/views/admin/PelangganView.vue') },
        { path: 'paket',     name: 'admin-paket',     component: () => import('@/views/admin/PaketView.vue') },
        { path: 'tagihan',   name: 'admin-tagihan',   component: () => import('@/views/admin/TagihanView.vue') },
        { path: 'pengaduan', name: 'admin-pengaduan', component: () => import('@/views/admin/PengaduanView.vue') },
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
router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'admin-login' }
  }
  if (to.meta.requiresCustomer && !auth.isCustomer) {
    return { name: 'portal-login' }
  }
})

export default router
