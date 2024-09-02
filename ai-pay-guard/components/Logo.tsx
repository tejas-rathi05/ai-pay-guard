import React from 'react'

const Logo = () => {
  return (
        <header className='flex gap-2 items-center mb-5'>
          <img src="/logo.png" alt="logo" width={100} height={100}/>
            <h1 className='text-4xl font-bold'>AI PayGuard</h1>
        </header>
  )
}

export default Logo