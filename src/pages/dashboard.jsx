import SideNav from "../components/sideNav";
import CardSection from "../components/cardSection";
// import Cookies from "js-cookie";

export default function Dashboard() {
  // console.log("admin Data", Cookies.get("adminData"))
  // console.log("manager Data", Cookies.get("managerData"))
  // const adminData = Cookies.get("adminData");
  // console.log("admin Data Role:", adminData ? JSON.parse(adminData).role : null);
  // const managerData = Cookies.get("managerData");
  // console.log("manager Data Role:", managerData ? JSON.parse(managerData).role : null);
  
  return (
    <div>
      <div className="grid grid-cols-3 grid-rows-1 gap-2 px-5 ">
        <div className="grid-row-1">
          <SideNav />
        </div>
        <div className="grid-row-1 col-span-2">
          <CardSection />
        </div>
      </div>
    </div>
  );
}
