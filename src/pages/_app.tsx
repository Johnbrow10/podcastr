import { Header } from "../components/Header/Index";
import { Player } from "../components/Player/Index";
import styles from '../styles/app.module.scss';
import '../styles/global.scss';

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.wrapper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
      <Player />
    </div>

  );
}

export default MyApp;
