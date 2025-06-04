import * as fs from "fs";
import { success } from "@/lib/utils";
import { reptileEtfs } from "@/services/data/etfs/reptile";
import * as path from "path";

export const GET = async () => {
  const etfs = await reptileEtfs();
  if (process.env.NODE_ENV === "development") {
    fs.writeFileSync(
      path.resolve(process.cwd(), "public", "etfs.json"),
      JSON.stringify(etfs, null, 2),
      "utf-8"
    );
  }
  return success(etfs);
};
