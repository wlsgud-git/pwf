import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { userAction } from "../../redux/actions/userAction";

interface RequireProps {
  authenticated: number | undefined;
}

export const RequireAuth = () => {
  let id = useSelector((state: RootState) => state.user.id);
  let loading = useSelector((state: RootState) => state.user.loading);

  if (loading) return null;

  return id ? <Outlet /> : <Navigate to="/login" replace />;
};
