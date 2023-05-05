import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminProtected from "../Authorization/AdminProtected";
import CustomerProtected from "../Authorization/CustomerProtected";
import { NotFound } from "../Components/NotFound";
import AddDevices from "./Admin/AddDevices";
import AddUser from "./Admin/AddUser";
import AdminDashboard from "./Admin/AdminDashboard";
import Devices from "./Admin/Devices";
import DeviceShow from "./Admin/DeviceShow";
import EditDevices from "./Admin/EditDevices";
import EditUser from "./Admin/EditUser";
import ShowUser from "./Admin/ShowUser";
import User from "./Admin/User";
import AddVehicle from "./Customer/AddVehicle";
import CompletedTripList from "./Customer/CompletedTripList";
import CompletedTripView from "./Customer/CompletedTripView";
import CustomerDashboard from "./Customer/CustomerDashboard";
import CustomerDevices from "./Customer/CustomerDevices";
import EditVehicle from "./Customer/EditVehicle";
import OngoingTripList from "./Customer/OngoingTripList";
import OngoingTripView from "./Customer/OngoingTripView";
import Vehicle from "./Customer/Vehicle";
import VehicleShow from "./Customer/VehicleShow";
import Login from "./Login";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/not-found" element={<NotFound />} />
      {/* //////////////Customer Routes/////////////// */}
      <Route
        path="/customer-dashboard"
        element={
          <CustomerProtected>
            <CustomerDashboard />
          </CustomerProtected>
        }
      />
      <Route
        path="/vehicle"
        element={
          <CustomerProtected>
            <Vehicle />
          </CustomerProtected>
        }
      />
      <Route
        path="/add-vehicle"
        element={
          <CustomerProtected>
            <AddVehicle />
          </CustomerProtected>
        }
      />
      <Route
        path="/edit-vehicle/:vehicle_id"
        element={
          <CustomerProtected>
            <EditVehicle />
          </CustomerProtected>
        }
      />
      <Route
        path="/vehicle-show/:vehicle_id"
        element={
          <CustomerProtected>
            <VehicleShow />
          </CustomerProtected>
        }
      />
      <Route
        path="/ongoing-trips"
        element={
          <CustomerProtected>
            <OngoingTripList />
          </CustomerProtected>
        }
      />
      <Route
        path="/ongoing-trips/:id"
        element={
          <CustomerProtected>
            <OngoingTripView />
          </CustomerProtected>
        }
      />
      <Route
        path="/completed-trips/"
        element={
          <CustomerProtected>
            <CompletedTripList />
          </CustomerProtected>
        }
      />
      <Route
        path="/completed-trips/:id"
        element={
          <CustomerProtected>
            <CompletedTripView />
          </CustomerProtected>
        }
      />
      <Route
        path="/customer-devices"
        element={
          <CustomerProtected>
            <CustomerDevices />
          </CustomerProtected>
        }
      />
      {/* Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <AdminProtected>
            <AdminDashboard />
          </AdminProtected>
        }
      />
      <Route
        path="/devices"
        element={
          <AdminProtected>
            <Devices />
          </AdminProtected>
        }
      />
      <Route
        path="/devices-add"
        element={
          <AdminProtected>
            <AddDevices />
          </AdminProtected>
        }
      />
      <Route
        path="/devices-edit/:id"
        element={
          <AdminProtected>
            <EditDevices />
          </AdminProtected>
        }
      />
      <Route
        path="/devices-show/:id"
        element={
          <AdminProtected>
            <DeviceShow />
          </AdminProtected>
        }
      />
      <Route
        path="/users"
        element={
          <AdminProtected>
            <User />
          </AdminProtected>
        }
      />
      <Route
        path="/users-add"
        element={
          <AdminProtected>
            <AddUser />
          </AdminProtected>
        }
      />
      <Route
        path="/users-edit/:user_id"
        element={
          <AdminProtected>
            <EditUser />
          </AdminProtected>
        }
      />
      <Route
        path="/users-show/:user_id"
        element={
          <AdminProtected>
            <ShowUser />
          </AdminProtected>
        }
      />
    </Routes>
  );
};

export default AllRoutes;
