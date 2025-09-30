import React from "react";
import Navbar from "@/components/Navbar";
import Panel from "@/components/Panel";
import ProtectedRoute from "@/components/ProtectedRoute";
import styles from "@/styles/Layout.module.css";
import PropertySelectorFloating from "./PropertySelectorFloating";
import { usePathname } from "next/navigation";

export default function Layout({ children }) {
  const pathname = usePathname();

  // Remover restrição para mostrar o seletor em todas as páginas
  // const hideSelectorPaths = ["/propriedade/[id]", "/propriedades"];
  // const showSelector = pathname ? !hideSelectorPaths.some((path) =>
  //   pathname.includes(path.replace("[id]", ""))
  // ) : true;
  const showSelector = true;

  return (
    <ProtectedRoute>
      <div className={styles.layout}>
        <Navbar />
        <main className={styles.content}>
          <Panel>
            {children}
            {showSelector && <PropertySelectorFloating />}
          </Panel>
        </main>
      </div>
    </ProtectedRoute>
  );
}
