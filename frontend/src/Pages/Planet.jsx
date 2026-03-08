import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../Contexts/CartContext.jsx";
import PlanetDetailsSection from "../Components/Planet/PlanetDetailsSection.jsx";
import PlanetPackagesSection from "../Components/Planet/PlanetPackagesSection.jsx";
import PlanetNearbySection from "../Components/Planet/PlanetNearbySection.jsx";
import usePlanetPageData from "../hooks/usePlanetPageData.jsx";

export default function Planet() {
  const navigate = useNavigate();
  const { planetSlug } = useParams();
  const { addToCart } = useCart();

  const handleNotFound = useCallback(() => {
    navigate("/404");
  }, [navigate]);

  const { planet, stacks, prevPlanet, nextPlanet } = usePlanetPageData(
    planetSlug,
    handleNotFound,
  );

  const handleAddToCart = (packageProps) => {
    if (packageProps.stock <= 0) return;
    addToCart(packageProps);
  };

  return (
    <div className="planet-page">
      <PlanetDetailsSection planet={planet} />
      <PlanetPackagesSection
        planet={planet}
        stacks={stacks}
        onAddToCart={handleAddToCart}
      />
      <PlanetNearbySection prevPlanet={prevPlanet} nextPlanet={nextPlanet} />
    </div>
  );
}
