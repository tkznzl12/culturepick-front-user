import CommonButton from '../common/buttons/common-button';
import styles from './header.module.scss';
import AiIcon from '../../assets/icons/ai-icon.svg';
import Logo from '../../assets/logo.svg';
import SearchComponent from '../search/search';
import { SiteRouter } from '@/data/router';
import Image from 'next/image';
import { genreList } from '@/data/filterList';
import { genreListType } from '@/data/type';
import Link from 'next/link';
export default function Header() {
  return (
    <nav>
      <div className={styles.navContainer}>
        <div className={styles.navLeft}>
          <span className={`${styles.logo} span-image`}>
            <Image fill src={Logo.src} alt="logo" />
          </span>
          <li>
            {genreList.map((genre: genreListType, index) => (
              <Link href="#" key={`header${index}`}>
                {genre.name}
              </Link>
            ))}
          </li>
        </div>
        <div className={styles.navRight}>
          <SearchComponent />
          <CommonButton
            variant="gradient"
            text="AI 추천"
            icon={<Image fill src={AiIcon.src} alt="AI" />}
          />
          <CommonButton variant="line" text="로그인" href={SiteRouter.login} />
        </div>
      </div>
    </nav>
  );
}
