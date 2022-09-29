import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

const encrypt = (id: { tx_id: string; amount:number; currency: string; partner_id: string, account?: string}) => {
  const { tx_id, account, amount, currency, partner_id } = id;
  const ID = `${partner_id}|${tx_id}|${account}|${currency}|${amount}`;

  const iv = randomBytes(16);

  const cipher = createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(ID), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

const decrypt = (hash) => {
  const decipher = createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

  const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

  const text = decrypted.toString();
  const d = text.split('|');
  return {
    partner_id: d[0],
    tx_id: d[1],
    account: d[2],
    currency: d[3],
    amount: d[4],
  };
};

export { decrypt, encrypt };
