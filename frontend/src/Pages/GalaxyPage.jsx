import { Link, useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { Suspense, useState, useEffect } from "react";
import axios from "axios";
import { buildApiUrl, scrollToTop } from "../libs/utils.jsx";
import AppLoader from "../Components/MicroComponents/AppLoader.jsx";
import SuspenseGate from "../Components/MicroComponents/SuspenseGate.jsx";

export default function GalaxyPage() {
  // params e location
  const { galaxySlug } = useParams();
  const Location = useLocation();
  const currLocation = Location.pathname;

  // sstates
  const [currGalaxy, setCurrGalaxy] = useState();
  const [currPlanets, setCurrPlanets] = useState();
  const [isLoadingGalaxy, setIsLoadingGalaxy] = useState(true);
  const [isLoadingPlanets, setIsLoadingPlanets] = useState(true);
  const navigate = useNavigate();
  // recupero i dati della galassia
  useEffect(() => {
    setIsLoadingGalaxy(true);

    axios
      .get(buildApiUrl(`/api/galaxies/${galaxySlug}`))
      .then((response) => setCurrGalaxy(response.data))
      .catch((err) => console.error("Errore nel caricamento galassia:", err))
      .finally(() => setIsLoadingGalaxy(false));
  }, [galaxySlug]);

  // recupero i pianeti di questa galassia
  useEffect(() => {
    setIsLoadingPlanets(true);

    axios
      .get(buildApiUrl(`/api/planets/from/${galaxySlug}`))
      .then((response) => {
        setCurrPlanets(response.data);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          navigate("/coming-soon");
          return;
        }
        console.error("Errore nel caricamento pianeti", err);
      })
      .finally(() => {
        setIsLoadingPlanets(false);
      });
  }, [galaxySlug, navigate]);

  return (
    <>
      <div className="galaxy-page gpage">
        <div className="mw-wrapper">
          <Suspense fallback={<AppLoader text="Caricamento galassia..." minHeight="32vh" />}>
            <SuspenseGate isLoading={isLoadingGalaxy || isLoadingPlanets}>
              <div className="mw-header">
                <h1>{currGalaxy?.name}</h1>
                <p>{currGalaxy?.description}</p>
              </div>
              <div>
                <h2 className="mw-subtitle">I pianeti</h2>
                <div className="mw-cards-grid">
                  {currPlanets?.map((planet) => (
                    <Link to={`${currLocation}/${planet.slug}`} key={planet.id}>
                      <div className="mw-card" onClick={scrollToTop}>
                        <div className="mw-explore">
                          <h3>{planet.name}</h3>
                        </div>
                        <div
                          className={`mw-planet-img mw-img-${planet.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          style={{ backgroundImage: `url(${planet.image})` }}
                        ></div>
                        <div className="mw-bottom">
                          <p className="mw-desc">{planet.description}</p>
                          <div className="mw-divider"></div>
                          <div className="mw-explore">Esplora il pianeta →</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </SuspenseGate>
          </Suspense>
        </div>
      </div>
    </>
  );
}
