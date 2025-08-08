import React, { useEffect, useState } from "react";
import styles from "@/styles/Loading.module.css";

const Loading = ({
  variant = "spinner",
  size = "medium",
  text = "Carregando...",
  fullScreen = false,
  duration = 3000, // 3 segundos por padrão
  onComplete,
  className = "",
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, duration);

      // Cleanup do timer se o componente for desmontado
      return () => clearTimeout(timer);
    }
  }, [duration, onComplete]);

  const containerClasses = [
    styles.container,
    fullScreen && styles.fullScreen,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const spinnerClasses = [
    styles.spinner,
    styles[variant],
    styles[size],
  ]
    .filter(Boolean)
    .join(" ");

  if (!isVisible) {
    return null;
  }

  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return (
          <div className={spinnerClasses}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        );
      
      case "pulse":
        return <div className={spinnerClasses}></div>;
      
      case "bars":
        return (
          <div className={spinnerClasses}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
        );
      
      case "spinner":
      default:
        return <div className={spinnerClasses}></div>;
    }
  };

  if (fullScreen) {
    return (
      <div className={containerClasses} {...props}>
        <div className={styles.content}>
          {renderSpinner()}
          {text && <p className={styles.text}>{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses} {...props}>
      {renderSpinner()}
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};

export default Loading;
