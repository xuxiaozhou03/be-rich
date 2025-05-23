import { success } from "@/lib/utils";
import { getEtfKline } from "@/services/data/kline";

export const GET = async () => {
  const res = await getEtfKline({});
  return success(res);
};
