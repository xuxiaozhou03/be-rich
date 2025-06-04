import { success } from "@/lib/utils";
import { etfs } from "@/services/data/etfs/list";

export const GET = async () => {
  return success(etfs);
};
