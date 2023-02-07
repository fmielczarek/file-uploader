import styles from './ProgressBar.module.css';

type ProgressBarProps = {
  progress: number;
};

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.bar} style={{ width: `${progress}%` }}></div>
    </div>
  );
};
export default ProgressBar;
