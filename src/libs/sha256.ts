import * as crypto from 'crypto';

const sha256Node = (data: string) => {
  return Promise.resolve(crypto.createHash('sha256').update(data).digest('hex'));
}

export const sha256 = sha256Node;
