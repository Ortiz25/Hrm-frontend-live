import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => (
  <React.Fragment>
    <Outlet />
  </React.Fragment>
);

export default RootLayout;
