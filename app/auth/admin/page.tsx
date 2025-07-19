import LoginFormAdmin from '@/app/components/LoginFormAdmin'
import RedirectIfAuthenticated from '@/app/components/RedirectIfAuthenticated'
import React from 'react'

function page() {
  return (
    <RedirectIfAuthenticated>
      <div>
        <LoginFormAdmin />
      </div>
    </RedirectIfAuthenticated>
  )
}

export default page
