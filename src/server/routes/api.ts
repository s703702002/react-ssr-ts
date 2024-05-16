import { Router } from "express";

const router = Router();

router.get("/test", (_, res) => {
  return res.json({ ok: "ok" });
});

export default router;
