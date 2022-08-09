import '../styles/globals.scss'
import { Layout } from '../components/layout';
import { SessionProvider } from 'next-auth/react';

function App({ Component, pageProps }) {




  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <Component {...pageProps}>


        </Component>
      </Layout>
    </SessionProvider>
  )
}


export default App
