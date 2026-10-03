import { Sidebar } from '@/components/dashboard/SideBar'
import Navbar from '@/components/ui/Navbar'
import React from 'react'

const page = () => {
  return (
    <>
    <div>
      <h1>Dashboard</h1>
      <Navbar />
      <Sidebar />
      <div>
        <h2>Welcome to the Dashboard</h2>
        <p>This is the main content area.</p>
      </div>
    </div>
    </>
  )
}

export default page