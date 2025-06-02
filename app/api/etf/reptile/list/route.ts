import * as fs from "fs";
import { success } from "@/lib/utils";
import { getEtfs } from "@/services/data/etf/list";
import * as path from "path";

export const GET = async () => {
  const etfs = await getEtfs();
  if (process.env.NODE_ENV === "development") {
    fs.writeFileSync(
      path.resolve(process.cwd(), "./etfs.json"),
      JSON.stringify(etfs, null, 2),
      "utf-8"
    );
  }
  return success(etfs);
};
