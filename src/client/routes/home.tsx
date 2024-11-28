import { useLoaderData } from "react-router-dom";
import { Button } from "antd";

type ProductData = {
  id: string;
  content: string;
};

type HomeLoaderData = {
  products: ProductData[];
};

export const homeLoader = async () => {
  const products = await fetch("http://localhost:5173/api/products").then((r) =>
    r.json(),
  );

  return {
    products: products,
  };
};

function Home() {
  const data = useLoaderData() as HomeLoaderData;

  return (
    <div>
      <h2>Home</h2>
      <p>Loader Data</p>
      <Button>Default Button</Button>
      <ul>{data.products?.map((p) => <li key={p.id}>{p.content}</li>)}</ul>
    </div>
  );
}

export default Home;
