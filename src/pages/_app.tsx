import 'styles/global.css';

import type { AppProps } from 'next/app';
import type { VFC } from 'react';

const App: VFC<AppProps> = ({ Component, pageProps }) => (
  <div className='w-screen min-h-screen flex'>
    <Component {...pageProps} />
  </div>
);

export default App;
