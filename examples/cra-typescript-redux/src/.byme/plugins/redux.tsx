import { Provider } from 'react-redux'
import store from '@/store'
import React from 'react'

const ReduxProvider = (props)=>{
    return  <Provider store={store} {...props}></Provider>
}
export default ReduxProvider