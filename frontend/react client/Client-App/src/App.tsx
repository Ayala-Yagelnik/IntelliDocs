import { Provider } from 'react-redux'
import { router } from './Router'
import { RouterProvider } from 'react-router'
import store from './store/store'

const App = () => {


  return (
    <>
    <Provider store={store}>
      <RouterProvider router={router} />
      </Provider>
    </>
  )
}

export default App
