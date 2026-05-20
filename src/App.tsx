import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ROUTES } from '@/constants/routes'
import { Home } from '@/pages/Home'
import { Reader } from '@/pages/Reader'
import { Search } from '@/pages/Search'
import { Hifz } from '@/pages/Hifz'
import { Tasbih } from '@/pages/Tasbih'
import { Profile } from '@/pages/Profile'
import { Login } from '@/pages/auth/Login'
import { Register } from '@/pages/auth/Register'

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />

      <Route
        path={ROUTES.HOME}
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path={ROUTES.READER}
        element={
          <Layout>
            <Reader />
          </Layout>
        }
      />
      <Route
        path={ROUTES.READER_SURAH}
        element={
          <Layout>
            <Reader />
          </Layout>
        }
      />
      <Route
        path={ROUTES.READER_PAGE}
        element={
          <Layout>
            <Reader />
          </Layout>
        }
      />
      <Route
        path={ROUTES.READER_JUZ}
        element={
          <Layout>
            <Reader />
          </Layout>
        }
      />
      <Route
        path={ROUTES.SEARCH}
        element={
          <Layout showTopNav={false}>
            <Search />
          </Layout>
        }
      />
      <Route
        path={ROUTES.HIFZ}
        element={
          <Layout>
            <Hifz />
          </Layout>
        }
      />
      <Route
        path={ROUTES.HIFZ_SESSION}
        element={
          <Layout>
            <Hifz />
          </Layout>
        }
      />
      <Route
        path={ROUTES.TASBIH}
        element={
          <Layout>
            <Tasbih />
          </Layout>
        }
      />
      <Route
        path={ROUTES.PROFILE}
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  )
}
