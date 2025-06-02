import { success } from "@/lib/utils";
import list from "@/etfs.json";

export const GET = async () => {
  return success(list);
};
