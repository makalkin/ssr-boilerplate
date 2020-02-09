import React from 'react'

import styles from './styles.module.scss'
import { Button } from '../../components'

export const Home = () => {
  React.useEffect(() => {

  }, [])

  return (
    <div styleName="home-container" >
      Hello world!

      <Button>Blue button</Button>
    </div>
  )
}