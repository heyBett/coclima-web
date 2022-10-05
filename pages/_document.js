import { Html, Head, Main, NextScript } from 'next/document'


export default function Document() {
    return (
        <Html>
            <Head>





                <link rel="preconnect" href="https://fonts.googleapis.com"></link>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin></link>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;500;600;700;800;900&display=swap" rel="stylesheet"></link>
                <link rel="icon" href="/images/circledIcon.png"></link>
                <title>Dashboard | Coclima</title>
                <meta name="description" content="Description"></meta>
                <meta name="author" content="Luiz Bett | CODX Web Development"></meta>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </Head>
            <body className=''>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}