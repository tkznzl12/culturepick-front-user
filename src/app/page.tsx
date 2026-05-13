import Image from 'next/image';
import styles from './page.module.scss';
import { mainContent, mainTitle } from '@/data/text';
import MainSearch from '@/components/search/mainSearch';
import MainBg from '@/assets/mock/main-bg.png';
import AiIconColor from '@/assets/icons/ai-icon-color.svg';
// main페이지
export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.mainBg}>
        <img src={MainBg.src} alt="" />
      </div>
      <main className={styles.container}>
        <div className={styles.mainTag}>
          <span>
            <img src={AiIconColor.src} alt="" />
          </span>
          <p>AI가 나에게 맞는 공연을 추천해드려요</p>
        </div>
        <p className={styles.title}>
          {mainTitle.title} <span>{mainTitle.strong}</span>
        </p>
        <pre>{mainContent}</pre>
        <MainSearch />
        {/* <div>tegList</div> */}
      </main>
    </div>
  );
}
