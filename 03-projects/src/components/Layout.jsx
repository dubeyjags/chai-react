import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
        <Header />
        <main className="min-h-[calc(100vh-126px)] lg:min-h-[calc(100vh-94px)] bg-[var(--bg)] flex items-center justify-center overflow-y-auto">
            <Outlet />
        </main>
        <Footer />
    </>
  )
}

export default Layout