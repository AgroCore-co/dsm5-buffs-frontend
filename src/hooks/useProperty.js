// src/hooks/useProperty.js
import { useContext } from "react";
import { PropertyContext } from "@/contexts/PropertyContext";

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context)
    throw new Error("useProperty deve ser usado dentro de PropertyProvider");
  return context;
};
