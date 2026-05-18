import SearchIcon from '@/assets/icons/search-icon.svg';
import styles from './mainSearch.module.scss';
import Image from 'next/image';

export default function MainSearch() {
  return (
    <div className={styles.mainSearch}>
      <div className={styles.mainSearchLeft}>
        <span className={`${styles.searchIcon} span-image`}>
          <Image fill src={SearchIcon.src} alt="검색" />
        </span>
        <input
          className={styles.searchInput}
          placeholder="공연 제목, 아티스트, 장소를 검색해보세요"
          type="text"
        />
      </div>
      <button className={styles.searchButton}>검색</button>
    </div>
  );
}
