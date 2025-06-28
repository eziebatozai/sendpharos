const { ethers } = require("ethers");
const fs = require("fs");

// ======== KONFIGURASI ========
const PRIVATE_KEY = "ISI_PRIVATE_KEY_MU"; // Jangan bagikan ini ke siapa pun!
const RPC_URL = "https://rpc.testnet.pharosnetwork.xyz"; // Ganti dengan RPC Pharos Testnet
const AMOUNT_TO_SEND = "0.01"; // jumlah yang dikirim (dalam ETH)
const DELAY_MS = 5000; // delay antar transaksi (ms)
const WALLET_FILE = "wallets.txt"; // file txt berisi address tujuan

// ======== SETUP PROVIDER & WALLET ========
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// ======== FUNGSI DELAY ========
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ======== MAIN FUNCTION ========
async function main() {
  const addresses = fs.readFileSync(WALLET_FILE, "utf-8")
                      .split("\n")
                      .map((a) => a.trim())
                      .filter((a) => ethers.isAddress(a));

  console.log(`Mengirim ke ${addresses.length} wallet...\n`);

  for (const [index, address] of addresses.entries()) {
    try {
      const tx = await wallet.sendTransaction({
        to: address,
        value: ethers.parseEther(AMOUNT_TO_SEND),
      });

      console.log(`${index + 1}. TX sent to ${address} | Hash: ${tx.hash}`);
      await tx.wait(); // tunggu konfirmasi

    } catch (err) {
      console.error(`Gagal kirim ke ${address}: ${err.message}`);
    }

    await delay(DELAY_MS);
  }

  console.log("\n✅ Semua transaksi selesai.");
}

main();
