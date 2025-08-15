// src/contexts/PropertyContext.js
import React, { createContext, useState, useEffect } from "react";

export const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [idPropriedade, setIdPropriedade] = useState(null);
  const [infoPropriedade, setInfoPropriedade] = useState(null);

  // Carrega do localStorage ao iniciar (opcional)
  useEffect(() => {
    const storedId = localStorage.getItem("idPropriedade");
    const storedInfo = localStorage.getItem("infoPropriedade");
    if (storedId) setIdPropriedade(Number(storedId));
    if (storedInfo) setInfoPropriedade(JSON.parse(storedInfo));
  }, []);

  // Persiste no localStorage sempre que mudar
  useEffect(() => {
    if (idPropriedade !== null)
      localStorage.setItem("idPropriedade", idPropriedade);
    if (infoPropriedade)
      localStorage.setItem("infoPropriedade", JSON.stringify(infoPropriedade));
  }, [idPropriedade, infoPropriedade]);

  const selectProperty = (id, info = null) => {
    setIdPropriedade(id);
    if (info) setInfoPropriedade(info);
  };

  return (
    <PropertyContext.Provider
      value={{ idPropriedade, infoPropriedade, selectProperty }}
    >
      {children}
    </PropertyContext.Provider>
  );
};
