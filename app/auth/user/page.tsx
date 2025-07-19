import LoginFormUser from '@/app/components/LoginFormUser'
import RedirectIfAuthenticated from '@/app/components/RedirectIfAuthenticated'
import React from 'react'

function page() {
  return (
    <RedirectIfAuthenticated>
      <div>
        <LoginFormUser />
      </div>
    </RedirectIfAuthenticated>
  )
}

export default page
