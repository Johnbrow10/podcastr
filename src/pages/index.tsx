import { format, parseISO } from "date-fns";
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { usePlayer } from '../contexts/PlayerContext';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';


type Episode = {
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  publishedAt: string
  duration: number;
  durationAsString: string;
  url: string;
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];

}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {

  const { playList } = usePlayer()

  // Conceito de imutabilidade em react
  // não atualiza as variaveis com dados novos, exemplo colocar um push no latestEpisodes e all episodes
  // e sim espalhar os dados daquelas duas variaveis em uma nova 
  const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={styles.homePage}>

      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Ultimos Lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image
                  width={250}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit='cover'
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a >{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>

                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Tocar Episodio" /></button>

              </li>
            )
          })}
        </ul>

      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos Epsódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th> Podcast </th>
              <th> Integrantes </th>
              <th> Data</th>
              <th> Duração</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}> <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit='cover'
                  /> </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>
                    <a href=""> {episode.members}</a>
                  </td>
                  <td style={{ width: 100 }}>
                    <a href="">{episode.publishedAt}</a>
                  </td>
                  <td> <a href="">{episode.durationAsString}</a></td>
                  <td>
                    {/* como o episodeList prga dois arrays de latestEpisodes e AllEpisodes, entao para contar apenas os allEpisodes pegamos oindce com o ultimo indice de latestEpisodes e assim so vai contar o proximo indoce que sera do array de all Episodes*/}
                    <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar Episódio" />
                    </button> </td>
                </tr>
              )
            })}
          </tbody>

        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  //  Sempre que for alterar algum campo para mostrar no front
  //  faça essa alteração logo depois de trazer os dados da api
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      // Alterando para formato de data do BRASIL
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    };
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}
