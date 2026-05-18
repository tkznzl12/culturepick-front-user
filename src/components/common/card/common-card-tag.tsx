import { TagType } from '@/data/type';
import styles from './common-card-tag.module.scss';

type CardTagProps = {
  tag: TagType;
};

export default function CardTag({ tag }: CardTagProps) {
  const tagList = {
    musical: '뮤지컬',
    play: '연극',
    classic: '클래식',
    koreanMusic: '국악',
    concert: '콘서트',
    dancing: '무용',
    upcomming: '공연예정',
    performing: '공연중',
    done: '공연완료',
  };
  return (
    <div className={`${styles[tag]} ${styles.tagComponent} `}>
      {tagList[tag]}
    </div>
  );
}
