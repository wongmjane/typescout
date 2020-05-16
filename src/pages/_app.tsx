import 'styles/global.css';

import { AppProps } from 'next/app';
import React, { FC } from 'react';

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <div className='w-screen min-h-screen flex'>
    <Component {...pageProps} />
  </div>
);

export default App;
