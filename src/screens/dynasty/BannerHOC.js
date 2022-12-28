import { Banner } from "components/banner/Banner";
import { Outlet } from "react-router-dom";

export const BannerHOC = () => {
  return (
    <div>
      <Banner />
      <Outlet />
    </div>
  );
};
