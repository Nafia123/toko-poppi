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

export function LoaderFailed({ completeLoader } : { completeLoader: boolean }) {
  return (
    completeLoader ? (
      <svg className={styles.cross} width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className={styles.cross__check} fillRule="evenodd" clipRule="evenodd" d="M4.22676 4.22676C4.5291 3.92441 5.01929 3.92441 5.32163 4.22676L12 10.9051L18.6784 4.22676C18.9807 3.92441 19.4709 3.92441 19.7732 4.22676C20.0756 4.5291 20.0756 5.01929 19.7732 5.32163L13.0949 12L19.7732 18.6784C20.0756 18.9807 20.0756 19.4709 19.7732 19.7732C19.4709 20.0756 18.9807 20.0756 18.6784 19.7732L12 13.0949L5.32163 19.7732C5.01929 20.0756 4.5291 20.0756 4.22676 19.7732C3.92441 19.4709 3.92441 18.9807 4.22676 18.6784L10.9051 12L4.22676 5.32163C3.92441 5.01929 3.92441 4.5291 4.22676 4.22676Z" fill="#ffff" />
      </svg>
    )
      : <Loader loading />
  );
}
