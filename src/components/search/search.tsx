import styles from './search.module.scss';
import SearchIcon from '../../assets/icons/search-icon.svg';
import Image from 'next/image';
export default function SearchComponent() {
  return (
    <div className={styles.search}>
      <input type="text" placeholder="공연 검색..." />
      <button>
        <Image fill src={SearchIcon.src} alt="검색" />
      </button>
    </div>
  );
}
