import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { buildApiUrl } from "../libs/utils.jsx";
import GalaxyCard from "../Components/Galaxy/GalaxyCard.jsx";
import BackToHomeBtn from "../Components/MicroComponents/BackToHomeBtn.jsx";
import AppLoader from "../Components/MicroComponents/AppLoader.jsx";
import SuspenseGate from "../Components/MicroComponents/SuspenseGate.jsx";
export default function GalaxiesList() {
  const [galaxies, setGalaxies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    axios
      .get(buildApiUrl("/api/galaxies"))
      .then((response) => setGalaxies(response.data))
      .catch((err) => console.error("Errore nel caricamento galassie:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="galaxy-page pos-gal">
      <div className="galaxies-section">
        <h2 className="galaxies-section-title">Galassie disponibili</h2>
        <p className="galaxies-section-desc">
          Scopri stelle, pianeti e sistemi abitabili
        </p>

        <Suspense fallback={<AppLoader text="Caricamento galassie..." minHeight="30vh" />}>
          <SuspenseGate isLoading={isLoading}>
            <div className="galaxies-cards-container">
              {galaxies.map((galaxy) => (
                <GalaxyCard key={galaxy.id} galaxy={galaxy} />
              ))}
            </div>
          </SuspenseGate>
        </Suspense>

        <BackToHomeBtn />
      </div>
    </div>
  );
}
