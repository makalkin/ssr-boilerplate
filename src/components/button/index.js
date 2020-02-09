import React from 'react'

import styles from './styles.module.scss'

export const Button = ({ children }) => {
  return (
    <button styleName="button--main">
      {children}
    </button>
  )
}