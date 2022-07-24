import '../styles/globals.css'
import { Layout } from '../components/layout';

function App({ Component, pageProps }) {




  return (

    <Layout>
      <Component {...pageProps}>


      </Component>
    </Layout>

  )
}


export default App
