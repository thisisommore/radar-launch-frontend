import { CONTRACT_ADDRESS } from "@/constants/address";
import { getEthExchangeRate } from "@/lib/getEthExchangeRate";
import { parseEther } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

interface Response {
  checkoutLinkIntentUrl: string;
  transactionId: string;
  estimatedPrice: { value: string; currency: string };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response | { message: string }>
) {
  if (req.method !== "POST") {
    return res.status(404).json({ message: "Not found" });
  }
  try {
    const { fee, address, id, title, imageUrl } = req.body;
    console.log({ fee, address, id, title, imageUrl });

    const exchangeRateData = await getEthExchangeRate();
    if (
      !exchangeRateData ||
      !exchangeRateData.ethereum ||
      !exchangeRateData.ethereum.usd
    ) {
      console.error("Error fetching exchange rate data");
      return res.status(400).json({ message: "Error has occured" });
    }

    const actualFee = parseEther(
      String(parseFloat(fee) / exchangeRateData.ethereum.usd),
      "wei"
    ).toString();

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: "Bearer " + process.env.PAPER_API_KEY,
      },
      body: JSON.stringify({
        contractId: CONTRACT_ADDRESS,
        title: `Create Project - ${title}`,
        // description: "Describe your project *with Markdown!*",
        imageUrl,
        successCallbackUrl: id
          ? `https://radarlaunch.app/project/${id}`
          : "https://radarlaunch.app",
        cancelCallbackUrl: "https://radarlaunch.app/project/create",
        sendEmailOnCreation: true,
        quantity: 1,
        metadata: {},
        mintMethod: {
          name: "createEdition",
          args: { payer: "$WALLET", fee: actualFee, owner: address, id },
          payment: { currency: "ETH", value: "0" },
        },
        // contractArgs: "string",
        feeBearer: "BUYER",
        sendEmailOnTransferSucceeded: true,
      }),
    };

    const response = await fetch(
      "https://withpaper.com/api/2022-08-12/checkout-link-intent",
      options
    ).then((response) => response.json());
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
  }
  return res.status(400).json({ message: "Error has occured" });
}
