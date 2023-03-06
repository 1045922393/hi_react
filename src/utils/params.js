import {
  useSearchParams,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
// 复用代码 使用hook 需要 use作为前缀
export function useGetParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  return searchParams.get("p") || undefined;
}

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    let search = useSearchParams();
    return (
      <Component {...props} router={{ location, navigate, params, search }} />
    );
  }

  return ComponentWithRouterProp;
}
