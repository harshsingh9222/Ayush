import { Navigate } from "react-router-dom";

const AdminRoute = ({ currentAdminStatus, children }) => {
    //console.log("I am in the AdminRoute ->",currentAdminStatus);
  return currentAdminStatus ? children : <Navigate to="/login" />;
};

export default AdminRoute;
