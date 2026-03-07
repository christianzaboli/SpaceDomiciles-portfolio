import "./MilkyWayPage.css";
import { Link, useParams } from "react-router-dom";
// import { useDefaultContext } from "../Contexts/DefaultContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
export default function MilkyWayPage() {
  // const { planets, apiBaseUrl } = useDefaultContext();
  const { galaxySlug } = useParams();
  const Location = useLocation();
  const currLocation = Location.pathname;
  const [currGalaxy, setCurrGalaxy] = useState();
  const [currPlanets, setCurrPlanets] = useState();
  const navigate = useNavigate();
  // recupero i dati della galassia
  useEffect(() => {
    fetch(`http://localhost:3000/api/galaxies/${galaxySlug}`)
      .then((res) => res.json())
      .then((data) => setCurrGalaxy(data), console.log(currGalaxy))
      .catch((err) => console.error("Errore nel caricamento galassia:", err));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };
  // recupero i pianeti di questa galassia
  useEffect(() => {
    fetch("http://localhost:3000/api/planets/from/" + galaxySlug)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            navigate("/coming-soon");
            return null;
          }
        }
        return res.json();
      })
      .then((data) => {
        if (data) setCurrPlanets(data);
      })
      .catch((err) => {
        console.error("Errore nel caricamento pianeti", err);
      });
  }, [galaxySlug, navigate]);

  return (
    <>
      <div className="galaxy-page">
        <div className="mw-wrapper">
          <div className="mw-header">
            <h1>{currGalaxy?.name}</h1>
            <p>{currGalaxy?.description}</p>
          </div>
          {currPlanets?.length > 0 && (
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
          )}
        </div>
      </div>
    </>
  );
}
