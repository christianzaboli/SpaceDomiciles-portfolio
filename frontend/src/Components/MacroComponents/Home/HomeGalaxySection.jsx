import HomeDiscoveryCard from "./HomeDiscoveryCard.jsx";
import HomeSectionTitle from "./HomeSectionTitle.jsx";
import { GALAXY_ITEMS } from "../../../libs/consts.jsx";


export default function HomeGalaxySection() {
  return (
    <>
      <HomeSectionTitle text="SCEGLI LA TUA GALASSIA PREFERITA" />
      <div className="container-galassie">
        {GALAXY_ITEMS.map((item) => (
          <HomeDiscoveryCard key={item.to} {...item}/>
        ))}
      </div>
    </>
  );
}
