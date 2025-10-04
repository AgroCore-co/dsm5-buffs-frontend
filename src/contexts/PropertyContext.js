// src/contexts/PropertyContext.js
import React from "react";

export const PropertyContext = React.createContext();

const PropertyProvider = ({ children }) => {
  // Contexto desativado: não fornece nenhum valor ou lógica
  return <>{children}</>;
};

export default PropertyProvider;