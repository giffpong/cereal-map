import { locationsList } from "./constants";
import { createLocationObject } from "./helper";

const directions = [
  {
    from: locationsList.ColumnTower,
    to: locationsList.BtsAsoke,
    strokeColor: "#f68f54"
  },
  // {
  //   from: locationsList.Mumbai,
  //   to: locationsList.Pune,
  //   strokeColor: "#f68f54"
  // },
  // {
  //   from: locationsList.Goa,
  //   to: locationsList.Ratnagiri,
  //   strokeColor: "#f68f54"
  // },
  // {
  //   from: locationsList.Nagpur,
  //   to: locationsList.Nashik,
  //   strokeColor: "#f68f54"
  // },
  // {
  //   from: locationsList.Indore,
  //   to: locationsList.Gwalior,
  //   strokeColor: "#f68f54"
  // },
  // {
  //   from: locationsList.Madurai,
  //   to: locationsList.Coimbatore,
  //   strokeColor: "#f68f54"
  // },
  // {
  //   from: locationsList.Chennai,
  //   to: locationsList.Tirupati,
  //   strokeColor: "#f68f54"
  // },
  // {
  //   from: locationsList.Kochi,
  //   to: locationsList.Thiruvalla,
  //   strokeColor: "#f68f54"
  // },
  // {
  //   from: locationsList.Udaipur,
  //   to: locationsList.Jodhpur,
  //   strokeColor: "#f68f54"
  // },
  // {
  //   from: locationsList.Jaisalmer,
  //   to: locationsList.Jaipur,
  //   strokeColor: "#f68f54"
  // },
  // {
  //   from: locationsList.Kota,
  //   to: locationsList.Bikaner,
  //   strokeColor: "#f68f54"
  // }
];
const DummyLocations = directions.map(elem => {
  return createLocationObject(
    elem.from.latLng,
    elem.from.title,
    elem.to.latLng,
    elem.to.title,
    elem.strokeColor
  );
});

export default DummyLocations;