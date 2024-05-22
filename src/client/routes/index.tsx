import Root from "./root";
import Home, { homeLoader } from "./home";
import About from "./about";
import NoMatch from "./no-match";

const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        loader: homeLoader,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "lazy",
        lazy: () => import("./lazy"),
      },
      {
        path: "*",
        element: <NoMatch />,
      },
    ],
  },
];

export default routes;
