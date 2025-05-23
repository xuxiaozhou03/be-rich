import { success } from "@/lib/utils";
import { getEtfs } from "@/services/data/etfs";

export const GET = async () => {
  const etfs = await getEtfs();
  return success(etfs);
};
