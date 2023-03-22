import { EraBanner } from "components/banner/EraBanner";
import { Outlet } from "react-router-dom";

export const EraBannerHOC = () => {
  return (
    <div>
      <EraBanner />
      <Outlet />
    </div>
  );
};
