import "../layout/Layout.scss";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout(props) {
  //Initialisation ---------------------------------
  const { session } = useAuth();

  const width = window.innerWidth;

  //State ------------------------------------------
  const [collapsed, setCollapsed] = useState(false);
  const [layoutName, setLayoutName] = useState("layout");

  const className = session ? layoutName : "layoutWithout";

  //Handlers ---------------------------------------
  const handleCollapse = () => {
    layoutName === "layout" ? setLayoutName("layoutCollapsed") : setLayoutName("layout");
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    if (width < 700) {
      setCollapsed(true);
      setLayoutName("layoutCollapsed");
    } else {
      setCollapsed(false);
      setLayoutName("layout");
    }
  }, [width]);

  //View -------------------------------------------
  return (
    <div className={className}>
      <Header className="header" />
      {session && <Sidebar className="sidebar" collapsed={collapsed} handleCollapse={handleCollapse} />}

      <main>{props.children}</main>
    </div>
  );
}

export default Layout;
