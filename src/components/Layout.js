import React from "react";
import Navbar from "@/components/Navbar";
import styles from "@/styles/Layout.module.css";

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.content}>{children}</main>
    </div>
  );
}


