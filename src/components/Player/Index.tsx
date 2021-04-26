import Image from 'next/image';
import { useContext, useEffect, useRef } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css'

export function Player() {

  // useRef da tipagem de elementos que escolhemos, dando assim inteligencia para ele 
  const audioRef = useRef<HTMLAudioElement>(null);

  const { episodeList, currentEpisodeIndex, isPlaying, togglePlay } = useContext(PlayerContext);

  // toda referencia nao tem valor nela, só tem apenas dentro de uma propriedade chamada current
  useEffect(() => { 
    // se a variavel audioRef nao tiver nehuma referencia nao retornada nada
    if (!audioRef.current) {
      return;
    }
    // agora se tiver algo no isPlaying execultando entao retorna ela produzindo
    if (isPlaying) {
      audioRef.current.play();
    } else {
      // se nao tiver nada da pausa no audio 
      audioRef.current.pause();
    }
  }, [isPlaying])

  const episode = episodeList[currentEpisodeIndex];


  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="./playing.svg" alt="Tocando Agora" />
        <strong>Tocando Agora {episode?.title} </strong>
      </header>

      {/* Quando tem um episodio em reproducao mostra o primeiro parenteses
         se nao tiver nada mostrar o segundo parenteses */}
      {episode ? (
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />

          <strong>{episode.title}</strong>
          <span>{episode.members}</span>

        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )
      }



      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>00:00</span>

          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}

          </div>

          <span>00:00</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            autoPlay
            ref={audioRef}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-previous.svg" alt="Tocar Anterior" />
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
            {isPlaying
              ? <img src="/pause.svg" alt="Tocar" />
              : <img src="/play.svg" alt="Tocar" />}
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-next.svg" alt="Tocar Proxima" />
          </button>
          <button type="button" className={styles.playButton} disabled={!episode}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div >
  )
}