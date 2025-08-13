import React from "react";
import Navbar from "@/components/Navbar";
import Panel from "@/components/Panel";
import ProtectedRoute from "@/components/ProtectedRoute";
import styles from "@/styles/Layout.module.css";

export default function Layout({ children }) {
  return (
    <ProtectedRoute>
      <div className={styles.layout}>
        <Navbar />
        <main className={styles.content}>
          <Panel>{children}</Panel>
        </main>
      </div>
    </ProtectedRoute>
  );
}


