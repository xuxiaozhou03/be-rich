import { success } from "@/lib/utils";
import getEtfDetail from "@/services/data/etf";

export const GET = async () => {
  const res = await getEtfDetail("159822");
  return success(res);
};
