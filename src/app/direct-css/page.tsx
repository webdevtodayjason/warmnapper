"use client";

import styles from './page.module.css';

export default function DirectCssPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Direct CSS Module Test Page</h1>
      
      <div className={styles.blueBox}>
        This is a blue box with white text (using CSS modules).
      </div>
      
      <div className={styles.greenBox}>
        This is a green box with white text (using CSS modules).
      </div>
      
      <div className={styles.redBox}>
        This is a red box with white text (using CSS modules).
      </div>
      
      <button 
        className={styles.button}
        onClick={() => alert('Button clicked!')}
      >
        Click Me
      </button>
    </div>
  );
}