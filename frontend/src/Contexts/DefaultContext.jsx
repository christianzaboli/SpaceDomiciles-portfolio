import { createContext, useContext } from "react";
import { useState, useEffect } from "react";

export const DefaultContext = createContext();

export function DefaultProvider({ children }) {
  const apiBaseUrl = "http://localhost:3000";
  // caricamento pianeti
  const [planets, setPlanets] = useState([]);
  useEffect(() => {
    fetch(apiBaseUrl + "/api/planets")
      .then((res) => res.json())
      .then((data) => setPlanets(data))
      .catch((err) => console.error("Errore nel caricamento pianeti:", err));
  }, []);

  // logica pagina search
  const defaultFilter = {
    search: "",
    temperatureMin: -273,
    temperatureMax: 550,
    sizeMin: 0,
    sizeMax: 7e10, // 70 miliardi
    price: 5000,
    galaxy_slug: "",
  };

  // variabile di stato che contiene l'elenco dei filtri
  // Legge dal localStorage all'avvio o usa il default
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem("filters");
    return saved ? JSON.parse(saved) : defaultFilter;
  });

  // Aggiorna localStorage quando filters cambia
  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(filters));
  }, [filters]);

  // funzione che aggiorna l'elenco dei filtri
  const updateFilters = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const updateFiltersBatch = (obj) =>
    setFilters((prev) => ({ ...prev, ...obj }));

  return (
    <DefaultContext.Provider
      value={{
        filters,
        setFilters,
        updateFilters,
        updateFiltersBatch,
        planets,
        defaultFilter,
        apiBaseUrl,
      }}
    >
      {children}
    </DefaultContext.Provider>
  );
}

export function useDefaultContext() {
  return useContext(DefaultContext);
}
