import { Provider } from 'react-redux'
import { router } from './Router'
import { RouterProvider } from 'react-router'
import store from './store/store'
import { ThemeProvider } from './context/ThemeContext'

const App = () => {


  return (
    <>
      <ThemeProvider >
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </ThemeProvider>

    </>
  )
}

export default App
