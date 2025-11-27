import React from "react";
import Sidebar from "./Sidebar";

type DashboardProps = {
  id: string;
};

const Dashboard: React.FC<DashboardProps> = ({ id }) => {
  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar id={id} />
    </div>
  );
};

export default Dashboard;
