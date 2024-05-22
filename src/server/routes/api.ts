import { Router } from "express";

const router = Router();

router.get("/products", (_, res) => {
  return res.json([
    { id: "1", title: "aaa", content: "product 1" },
    { id: "2", title: "bbb", content: "product 2" },
    { id: "3", title: "ccc", content: "product 3" },
  ]);
});

router.get("/about", (_, res) => {
  return res.json([
    { id: "1", title: "1", content: "about aaa" },
    { id: "2", title: "2", content: "about bbb" },
    { id: "3", title: "3", content: "about ccc" },
  ]);
});

export default router;
