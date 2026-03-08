import { Suspense, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../Contexts/CartContext.jsx";
import PlanetDetailsSection from "../Components/Planet/PlanetDetailsSection.jsx";
import PlanetPackagesSection from "../Components/Planet/PlanetPackagesSection.jsx";
import PlanetNearbySection from "../Components/Planet/PlanetNearbySection.jsx";
import AppLoader from "../Components/MicroComponents/AppLoader.jsx";
import SuspenseGate from "../Components/MicroComponents/SuspenseGate.jsx";
import usePlanetPageData from "../hooks/usePlanetPageData.jsx";
import { useWebHaptics } from "web-haptics/react";


export default function Planet() {
  const { trigger } = useWebHaptics();
  const navigate = useNavigate();
  const { planetSlug } = useParams();
  const { addToCart } = useCart();

  const handleNotFound = useCallback(() => {
    navigate("/404");
  }, [navigate]);

  const { planet, stacks, prevPlanet, nextPlanet, isLoading } = usePlanetPageData(
    planetSlug,
    handleNotFound,
  );

  const handleAddToCart = (packageProps) => {

    if (packageProps.stock <= 0) return;
    trigger([ { duration: 30 }, { delay: 60, duration: 40, intensity: 1 } ])
    addToCart(packageProps);
  };

  return (
    <div className="planet-page">
      <Suspense fallback={<AppLoader text="Caricamento pianeta..." minHeight="55vh" />}>
        <SuspenseGate isLoading={isLoading}>
          <PlanetDetailsSection planet={planet} />
          <PlanetPackagesSection
            planet={planet}
            stacks={stacks}
            onAddToCart={handleAddToCart}
          />
          <PlanetNearbySection prevPlanet={prevPlanet} nextPlanet={nextPlanet} />
        </SuspenseGate>
      </Suspense>
    </div>
  );
}
