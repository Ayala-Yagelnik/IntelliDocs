import { Provider } from 'react-redux'
import { router } from './Router'
import { RouterProvider } from 'react-router'
import store from './store/store'
import { ThemeProvider } from '@mui/material'
import theme from './utils/theme'

const App = () => {


  return (
    <>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </ThemeProvider>

    </>
  )
}

export default App
