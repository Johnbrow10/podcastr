import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './styles.module.scss';


export function Player() {

  // useRef da tipagem de elementos que escolhemos, dando assim inteligencia para ele 
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0)

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayingState,
    playNext,
    toogleLopp,
    playPrevious,
    hasPrevious,
    isLooping,
    toogleShuffle,
    isShuffling,
    hasNext } = usePlayer();

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

  function setupProgresslistener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }

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
          <span>{convertDurationToTimeString(progress)}</span>

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

          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            autoPlay
            loop={isLooping}
            ref={audioRef}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgresslistener}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toogleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Tocar Anterior" />
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
            {isPlaying
              ? <img src="/pause.svg" alt="Tocar" />
              : <img src="/play.svg" alt="Tocar" />}
          </button>
          <button type="button" disabled={!episode || !hasNext} onClick={playNext} >
            <img src="/play-next.svg" alt="Tocar Proxima" />
          </button>
          <button
            type="button"
            onClick={toogleLopp}
            className={isLooping ? styles.isActive : ''}
            disabled={!episode}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div >
  )
}