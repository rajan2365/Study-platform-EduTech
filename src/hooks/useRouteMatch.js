import { useLocation, matchPath } from "react-router-dom";


//eska use current Router ke path ke liye krte hai HOOKS 
export default function useRouteMatch(path) {
  const location = useLocation();
  return matchPath(location.pathname, { path });
}