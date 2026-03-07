// import axios
import axios from "axios";

// import di router-dom per link
import { Link, useParams, useNavigate } from "react-router-dom";

// import state e effect
import { useState, useEffect } from "react";

// importo funzionalità carrello
import { useCart } from "../Contexts/CartContext";

// importo gli stili css della pagina
import "../styles/Planet.css";

// IMPORT CONVENZIONALE COMPONENTE REACT (MAIUSCOLA)
import PackageCard from "../Components/MicroComponents/packageCard";

const Planet = () => {
  // Creo istanza di Navigate
  const redirect = useNavigate();

  // Stato pagina
  const [planet, setPlanet] = useState();
  const [stacks, setStacks] = useState();
  const { planetSlug } = useParams();
  const [nextId, setNextId] = useState();
  const [prevId, setPrevId] = useState();
  const [planets, setPlanets] = useState();
  const [nextPlanet, setNextPlanet] = useState();
  const [prevPlanet, setPrevPlanet] = useState();

  // Funzionalità carrello
  const { addToCart } = useCart();

  // Funzioni per chiamate API
  const fecthPlanet = () => {
    axios
      .get("http://localhost:3000/api/planets/" + planetSlug)
      .then((response) => {
        setPlanet(response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.status === 404) redirect("/404");
      });
  };

  const fetchStack = () => {
    axios
      .get("http://localhost:3000/api/stacks/planet/" + planetSlug)
      .then((response) => {
        setStacks(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchClosePlanets = () => {
    setNextId(planet?.id + 1);
    setPrevId(planet?.id - 1);
    axios
      .get(`http://localhost:3000/api/planets/from/${planet.galaxy_slug}`)
      .then((response) => {
        setPlanets(response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.status === 404) redirect("/404");
      });
  };

  const findClosePlanets = () => {
    if (!planets || !planet) return;

    const index = planets.findIndex((p) => p.slug === planet.slug);

    if (index === -1) return;

    setPrevPlanet(index > 0 ? planets[index - 1] : null);
    setNextPlanet(index < planets.length - 1 ? planets[index + 1] : null);
  };

  /* funzione che permette di tornare a inizio pagina quando viene selezionato un pianeta correlato */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ✨ MODIFICATO: Solo aggiunge al carrello, NON decrementa lo stock ✨
  const handleAddToCart = (packageProps) => {
    if (packageProps.stock <= 0) return;

    // Solo aggiungi al carrello
    addToCart(packageProps);
  };

  // ✨ NUOVA FUNZIONE: Da chiamare dopo il checkout per confermare l'acquisto ✨
  const completePurchase = async (cartItems) => {
    try {
      // Per ogni item nel carrello, decrementa lo stock sul backend
      for (const item of cartItems) {
        await axios.post(`http://localhost:3000/api/stacks/${item.id}/purchase`, {
          quantity: 1
        });
      }
      
      // Ricarica gli stacks aggiornati dal database
      fetchStack();
      
      console.log("Acquisto completato con successo!");
    } catch (error) {
      console.error("Errore durante l'acquisto:", error);
    }
  };

  // Effetti dati
  useEffect(fecthPlanet, [planetSlug]);
  useEffect(fetchStack, [planetSlug]);
  useEffect(() => {
    if (!planet) return;
    fetchClosePlanets();
  }, [planet]);
  useEffect(() => {
    findClosePlanets();
  }, [planets, nextId, prevId]);

  // Render completo
  return (
    <>
      <div className="planet-page">
        {/* Dettagli pianeta */}
        <section className="planet-details-section">
          <div className="planet-visual">
            <div className="planet-visual-container">
              <img
                className="planet-visual-image"
                src={planet?.image}
                alt={planet?.name}
              />
              <div className="planet-visual-name">{planet?.name}</div>
            </div>
          </div>
          <div className="planet-details-content">
            <h1 className="planet-details-title">{planet?.name}</h1>
            <p className="planet-details-description">{planet?.description}</p>
            <div className="planet-specs">
              <div className="planet-spec-item">
                <div className="planet-spec-icon">
                  <i className="fas fa-temperature-half"></i>
                </div>
                <div>
                  <div className="planet-spec-label">Temperatura</div>
                  <div className="planet-spec-value">
                    <span>Da </span>
                    {planet?.temperature_min} <span>a</span>{" "}
                    {planet?.temperature_max} <span>°C</span>
                  </div>
                </div>
              </div>
              <div className="planet-spec-item">
                <div className="planet-spec-icon">
                  <i className="fas fa-mountain"></i>
                </div>
                <div>
                  <div className="planet-spec-label">Superficie</div>
                  <div className="planet-spec-value">
                    {planet?.planet_size} <span>KM&#178;</span>
                  </div>
                </div>
              </div>
              <div className="planet-spec-item">
                <div className="planet-spec-icon">
                  <i className="fas fa-globe"></i>
                </div>
                <div>
                  <div className="planet-spec-label">Galassia</div>
                  <div className="planet-spec-value">{planet?.galaxy_name}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ✨ Packages Section - USA stacks dal database ✨ */}
        <section className="packages-section">
          <div className="cosmic-container">
            <h2 className="section-title">Scegli il Tuo Pacchetto</h2>
            <div className="packages">
              {planet && stacks ? (
                stacks.map((stack) => (
                  <PackageCard
                    key={stack.id}
                    {...stack}
                    planet_name={planet.name}
                    planet_image={planet.image}
                    onAddToCart={handleAddToCart}
                  />
                ))
              ) : (
                <p className="planet-spec-value">Caricamento pacchetti...</p>
              )}
            </div>
          </div>
        </section>

        {/* Sezione prodotti correlati (pianeti vicini) */}
        <section className="planet-close">
          <h2 className="section-title">Pianeti vicini</h2>
          <div className="planet-close-container">
            {prevPlanet && (
              <div className="planet-close-card">
                <h2 className="section-title">Previous</h2>
                <Link
                  to={`/galaxies/${prevPlanet.galaxy_slug}/${prevPlanet.slug}`}
                  onClick={scrollToTop}
                  className="planet-visual close-planet"
                >
                  <div className="planet-visual-container">
                    <img
                      className="planet-visual-image"
                      src={prevPlanet?.image}
                      alt={prevPlanet?.name}
                    />
                    <div className="planet-visual-name">{prevPlanet?.name}</div>
                  </div>
                </Link>
              </div>
            )}
            {nextPlanet && (
              <div className="planet-close-card">
                <h2 className="section-title">Next</h2>
                <Link
                  to={`/galaxies/${nextPlanet.galaxy_slug}/${nextPlanet.slug}`}
                  onClick={scrollToTop}
                  className="planet-visual close-planet"
                >
                  <div className="planet-visual-container">
                    <img
                      className="planet-visual-image"
                      src={nextPlanet?.image}
                      alt={nextPlanet?.name}
                    />
                    <div className="planet-visual-name">{nextPlanet?.name}</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Planet;
