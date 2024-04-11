import React from 'react'

const Badge = ({children, color}: any) => {

  return (
    <span className={`bg-white border border-${color} py-1 px-2 rounded-md text-${color} w-fit dark:bg-darkmode-400/70 dark:text-white dark:border-white`}>
        {children}
    </span>
  )
}

export default Badge