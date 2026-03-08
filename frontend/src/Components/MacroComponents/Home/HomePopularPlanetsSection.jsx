import { Suspense } from "react";
import HomeDiscoveryCard from "./HomeDiscoveryCard.jsx";
import HomeSectionTitle from "./HomeSectionTitle.jsx";
import AppLoader from "../../MicroComponents/AppLoader.jsx";
import SuspenseGate from "../../MicroComponents/SuspenseGate.jsx";

export default function HomePopularPlanetsSection({ planets, isLoading }) {
  const validPlanets = planets.filter(Boolean);

  return (
    <>
      <HomeSectionTitle text="I PIANETI PIU' POPOLARI" />
      <div className="container-galassie">
        <Suspense
          fallback={
            <AppLoader text="Caricamento pianeti popolari..." minHeight="24vh" />
          }
        >
          <SuspenseGate isLoading={isLoading}>
            {validPlanets.map((planet) => (
              <HomeDiscoveryCard
                key={planet.slug}
                to={`/galaxies/${planet.galaxy_slug}/${planet.slug}`}
                imageSrc={planet.image}
                imageAlt={planet.name}
                imageClassName={planet.slug !== "mars" ? "pianeta-piccolo" : ""}
                title={planet.name}
                description={planet.description}
              />
            ))}
          </SuspenseGate>
        </Suspense>
      </div>
    </>
  );
}
