import CommonButton from '../common/buttons/line-btn';
import styles from './header.module.scss';
import AiIcon from '../../assets/icons/ai-icon.svg';
import Logo from '../../assets/logo.svg';
import SearchComponent from '../search/search';
export default function Header() {
  const headerMockData = [
    { name: '공연 홈', type: 'ALL' },
    { name: '뮤지컬', type: 'category' },
    { name: '연극', type: 'category' },
  ];
  return (
    <nav>
      <div className={styles.navContainer}>
        <div className={styles.navLeft}>
          <span className={styles.logo}>
            <img src={Logo.src} alt="logo" />
          </span>
          <li>
            {headerMockData.map((headerCategory, index) => (
              <ul key={`header${index}`}>{headerCategory.name}</ul>
            ))}
          </li>
        </div>
        <div className={styles.navRight}>
          <SearchComponent />
          <CommonButton
            variant="gradient"
            text="AI 추천"
            icon={<img src={AiIcon.src} alt="AI" />}
          />
          <CommonButton variant="line" text="로그인" />
        </div>
      </div>
    </nav>
  );
}
