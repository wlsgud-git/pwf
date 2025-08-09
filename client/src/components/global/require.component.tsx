import { useDispatch } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { userAction } from "../../redux/actions/userAction";

interface RouteProps {
  type: "pub" | "pri";
  children: React.ReactNode;
}

export const RouteCheck = ({ type, children }: RouteProps) => {
  const id = useSelector((state: RootState) => state.user.id);

  if (type == "pri") {
    if (!id) return <Navigate to="/login" replace />;
  } else {
    if (id) return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
