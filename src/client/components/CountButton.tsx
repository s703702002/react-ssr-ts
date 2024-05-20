import { useState } from "react";
import styles from "./CountButton.module.css";

const CountButton = () => {
  const [count, setCount] = useState(0);

  return (
    <button
      className={styles.root}
      onClick={() => setCount((count) => count + 1)}
    >
      count is {count}
    </button>
  );
};

export default CountButton;
