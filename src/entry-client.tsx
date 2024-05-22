import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  matchRoutes,
  RouterProvider,
} from "react-router-dom";
import routes from "./client/routes";
import "./client/index.css";

async function hydrate() {
  // Determine if any of the initial routes are lazy
  const lazyMatches = matchRoutes(routes, window.location)?.filter(
    (m) => "lazy" in m.route,
  );

  // Load the lazy matches and update the routes before creating your router
  // so we can hydrate the SSR-rendered content synchronously
  if (lazyMatches && lazyMatches?.length > 0) {
    await Promise.all(
      lazyMatches.map(async (m) => {
        if ("lazy" in m.route && typeof m.route.lazy === "function") {
          const routeModule = await m.route.lazy();
          Object.assign(m.route, {
            ...routeModule,
            lazy: undefined,
          });
        }
      }),
    );
  }

  const router = createBrowserRouter(routes);

  ReactDOM.hydrateRoot(
    document.getElementById("root")!,
    <React.StrictMode>
      <RouterProvider router={router} fallbackElement={null} />
    </React.StrictMode>,
  );
}

hydrate();
