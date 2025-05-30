import { success } from "@/lib/utils";
import getEtfDetail from "@/services/data/etf/detail";
import getStageChange from "@/services/data/etf/jdzf";

export const GET = async () => {
  const res = await getEtfDetail("159822");
  // const jdzf = await getStageChange("159822");
  return success({
    // jdzf,
    ...res,
  });
};
