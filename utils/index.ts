import { NextResponse } from "next/server";

export const success = (data: any = null) => {
  return NextResponse.json({ success: true, data });
};
export const error = (message: string, status: number = 500) => {
  return NextResponse.json({ success: false, message }, { status });
};
