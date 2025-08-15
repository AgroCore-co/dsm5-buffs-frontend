// src/hooks/useProperty.js
import { useContext } from "react";
import { PropertyContext } from "@/contexts/PropertyContext";

export const useProperty = () => {
  const ctx = useContext(PropertyContext);
  if (!ctx) throw new Error("useProperty deve ser usado dentro de PropertyProvider");
  return ctx;
};
