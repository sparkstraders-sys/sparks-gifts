import { NextResponse } from "next/server";
import { getSettingsMap } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const s = await getSettingsMap().catch(() => ({} as Record<string, string>));
  return NextResponse.json({
    jazzcash: s.paymentJazzcash ?? "",
    easypaisa: s.paymentEasypaisa ?? "",
    raast: s.paymentRaast ?? "",
    bankDetails: s.paymentBankDetails ?? "",
    accountTitle: s.paymentAccountTitle ?? "",
    whatsapp: s.whatsapp ?? "923001432502",
  });
}
