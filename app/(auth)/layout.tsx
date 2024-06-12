import React from 'react'

const AuthLyout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400">
        {children}
        </div>
  )
}

export default AuthLyout