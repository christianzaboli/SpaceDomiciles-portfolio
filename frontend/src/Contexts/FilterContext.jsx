import { createContext, useContext, useState } from "react";

const DefaultContext = createContext();

export function DefaultProvider({ children }) {
  const defaultFilter = {
    search: "",
    temperatureMin: -273,
    temperatureMax: 500,
    sizeMin: 0,
    sizeMax: 7e10,
    price: 5000,
    category: "",
    galaxy_slug: "",
  };

  const [filters, setFilters] = useState(defaultFilter);

  // 🔥 funzione universale per aggiornare 1 solo campo
  const updateFilters = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 🔥 funzione che aggiorna più campi (utile per il Drawer)
  const updateFiltersBatch = (obj) => {
    setFilters((prev) => ({
      ...prev,
      ...obj,
    }));
  };

  return (
    <DefaultContext.Provider
      value={{
        filters,
        setFilters,
        updateFilters,
        updateFiltersBatch,
        defaultFilter,
      }}
    >
      {children}
    </DefaultContext.Provider>
  );
}

export const useDefaultContext = () => useContext(DefaultContext);
