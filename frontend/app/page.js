import Highscore from "./Highscore";
import styles from "./page.module.css";
import Puzzle from "./Puzzle";

export default function Home() {
  return (
    <div className={styles.page}>
      <Puzzle />
      <Highscore />
    </div>
  );
}
