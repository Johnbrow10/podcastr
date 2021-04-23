import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { api } from '../../services/api';
import Image from 'next/image'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss'

type Episode = {
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  publishedAt: string
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
}

type EpisodeProps = {
  episode: Episode;

}

export default function Episode({ episode }: EpisodeProps) {

  return (
    < div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image width={700} height={160} src={episode.thumbnail} objectFit="cover" />
        <button type="button" >
          <img src="/play.svg" alt="Tocar Episodio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span> {episode.members} </span>

        <span> {episode.publishedAt} </span>

        <span> {episode.durationAsString} </span>
      </header>

      <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />


    </div>
  )
}

// para paginas estaticas que carregam dinamicamentes tem que usar esse metodo importado do nextjs
// getStaticPaths

export const getStaticPaths: GetStaticPaths = async () => {

  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })

  return {
    // paths vai ser as paginas que serao estaticas quando estao preenchidas atraves da build
    paths,
    // falback: false == se acessar a pagina que nao foi carregada na build vai da erro 404 
    fallback: 'blocking'
    // com fallback : "blocking" ele regenera novos dados 
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {

  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`)


  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    // Alterando para formato de data do BRASIL
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };


  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, /* 24 horas */
  }
}