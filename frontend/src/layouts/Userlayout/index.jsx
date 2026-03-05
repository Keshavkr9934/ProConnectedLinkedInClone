import Navbar from '@/component/Navbar'
import React from 'react'

function UserLayout({children}) {
  return (
   <div>
   <Navbar />
    {children}
   </div>
  )
}

export default UserLayout