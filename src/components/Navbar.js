import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Navbar.module.css";

const Navbar = () => {
  const router = useRouter();

  const navItems = [
    { label: "Página inicial", path: "/dashboard" },
    { label: "Rebanho", path: "/rebanho" },
    { label: "Lactação", path: "/lactacao" },
    { label: "Controle Reprodução", path: "/controle-reproducao" },
    { label: "Manejo", path: "/manejo" },
    { label: "Equipe", path: "/equipe" },
  ];

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Principal">
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/dashboard">
            <img 
              src="/images/Logo-buffs.svg" 
              alt="Buffs Logo" 
              className={styles.logoImage}
            />
          </Link>
        </div>

        {/* Navigation Items */}
        <div className={styles.navItems}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.navItem} ${
                router.pathname === item.path ? styles.active : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* User Profile */}
        <div className={styles.userProfile}>
          <div className={styles.avatar}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
