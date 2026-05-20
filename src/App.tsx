import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ROUTES } from '@/constants/routes'
import { VerseCardSkeleton } from '@/components/ui/Skeleton'

const Home     = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })))
const Surahs   = lazy(() => import('@/pages/Surahs').then(m => ({ default: m.Surahs })))
const Reader   = lazy(() => import('@/pages/Reader').then(m => ({ default: m.Reader })))
const Search   = lazy(() => import('@/pages/Search').then(m => ({ default: m.Search })))
const Hifz     = lazy(() => import('@/pages/Hifz').then(m => ({ default: m.Hifz })))
const Tasbih   = lazy(() => import('@/pages/Tasbih').then(m => ({ default: m.Tasbih })))
const Profile    = lazy(() => import('@/pages/Profile').then(m => ({ default: m.Profile })))
const Recitation = lazy(() => import('@/pages/Recitation').then(m => ({ default: m.Recitation })))
const Login    = lazy(() => import('@/pages/auth/Login').then(m => ({ default: m.Login })))
const Register = lazy(() => import('@/pages/auth/Register').then(m => ({ default: m.Register })))

function PageFallback() {
  return (
    <div className="px-3 py-4 space-y-2">
      {Array.from({ length: 4 }).map((_, i) => <VerseCardSkeleton key={i} />)}
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        <Route path={ROUTES.HOME} element={<Layout><Home /></Layout>} />
        <Route path={ROUTES.SURAHS} element={<Layout><Surahs /></Layout>} />
        <Route path={ROUTES.READER} element={<Layout><Reader /></Layout>} />
        <Route path={ROUTES.READER_SURAH} element={<Layout><Reader /></Layout>} />
        <Route path={ROUTES.READER_PAGE} element={<Layout><Reader /></Layout>} />
        <Route path={ROUTES.READER_JUZ} element={<Layout><Reader /></Layout>} />
        <Route path={ROUTES.SEARCH} element={<Layout showTopNav={false}><Search /></Layout>} />
        <Route path={ROUTES.HIFZ} element={<Layout><Hifz /></Layout>} />
        <Route path={ROUTES.HIFZ_SESSION} element={<Layout><Hifz /></Layout>} />
        <Route path={ROUTES.TASBIH} element={<Layout><Tasbih /></Layout>} />
        <Route path={ROUTES.PROFILE} element={<Layout><Profile /></Layout>} />
        <Route path={ROUTES.RECITE} element={<Recitation />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  )
}
