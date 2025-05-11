import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import NavBar from "./Navbar";
import SideMenu from "./SideMenu";

function DashBoardLayout({ children, activeMenu }) {
  const { user } = useContext(UserContext);

  if (!user) return null;

  return (
    <div>
      <NavBar activeMenu={activeMenu} />
      {user && (
        <div className="flex overflow-auto">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>
          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
}

export default DashBoardLayout;
