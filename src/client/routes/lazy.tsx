import { useLoaderData } from "react-router-dom";

type AboutData = {
  id: string;
  content: string;
};

type LazyLoaderData = {
  about: AboutData[];
};

export const loader = async () => {
  const about = await fetch("http://localhost:5173/api/about").then((r) =>
    r.json(),
  );

  return {
    about,
  };
};

function LazyPage() {
  const data = useLoaderData() as LazyLoaderData;

  return (
    <>
      <h2>Lazy Route</h2>
      <p>Date from loader:</p>
      <ul>{data.about?.map((a) => <li key={a.id}>{a.content}</li>)}</ul>
    </>
  );
}

export const element = <LazyPage />;
