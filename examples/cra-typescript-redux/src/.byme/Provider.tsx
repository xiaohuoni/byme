import React from 'react'
import ReduxProvider from './plugins/redux';

const Provider = (props) => {
  return <ReduxProvider {...props}></ReduxProvider>
}

export default Provider
