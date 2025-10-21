import React from "react";
import Navbar from "@/components/Navbar";
import Panel from "@/components/Panel";
import styles from "@/styles/Layout.module.css";

export default function Layout({ children }) {


  return (
      <div className={styles.layout}>
        <Navbar />
        <main className={styles.content}>
          <Panel>
            {children}
          </Panel>
        </main>
      </div>
  );
}
