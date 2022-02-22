import styles from '../../styles/Loading.module.css';

export function Loader({ loading, fullScreen = false } : {
  loading: boolean,
  fullScreen?: boolean
}) {
  if (!loading) {
    return null;
  }
  return (
    <div className={fullScreen ? 'col-span-5 z-100 fixed min-h-screen w-screen h-screen bg-transparent overscroll-y-none bg-gray-100 opacity-50' : ''}>
      <svg className={styles.loading} viewBox="0 0 52 52">
        <circle className={styles.checkmark__outer__circle} cx="26" cy="26" r="25" fill="none" />
        <circle className={styles.checkmark__inner__circle} cx="26" cy="26" r="18" fill="none" />
      </svg>
    </div>
  );
}

export function LoaderComplete({ completeLoader } : { completeLoader: boolean }) {
  return (
    completeLoader ? (
      <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <path className={styles.checkmark__check} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
      </svg>
    )
      : <Loader loading />
  );
}
