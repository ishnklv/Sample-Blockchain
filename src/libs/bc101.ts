import { sha256 } from './sha256';

interface IBlock {
  timestamp: number;
  nonce: number;
  hash: string;
  prevBlockHash: string;
}

interface ITransaction {
  readonly sender: string;
  readonly recipient: string;
  readonly amount: number;
}

class Transaction implements ITransaction{
  constructor(
    readonly sender: string,
    readonly recipient: string,
    readonly amount: number,
  ) {}
}

export class Block{
  hash: string;
  nonce: number = 0;

  constructor(
    readonly prevHash: string,
    readonly timestamp: number,
    readonly transactions: ITransaction[]
  ) {
    this.hash = '';
  }

  async mine() {
    do {
      this.hash = await this.calcHash(++this.nonce);
    } while (this.hash.startsWith('00000') === false);
  }

  calcHash(nonce: number) {
    const data = this.prevHash + this.timestamp + JSON.stringify(this.transactions) + nonce;
    return sha256(data);
  }
}

export class BlockChain {
  private _chain: Block[] = [];
  private _pendingTransactions: ITransaction[] = [];

  constructor() {}

  get chain(): Block[] {
    return [...this._chain];
  }

  get pendingTransactions(): ITransaction[] {
    return [...this._pendingTransactions];
  }

  async createGenesisBlock() {
    const genesisBlock = new Block('0', Date.now(), [])
    await genesisBlock.mine();
    this._chain.push(genesisBlock);
  }

  createTransaction(transaction: ITransaction) {
    this._pendingTransactions.push(transaction);
  }

  getLatestBlock() {
    return this._chain[this._chain.length - 1];
  }

  async minePendingTransactions() {
    const block = new Block(this.getLatestBlock().hash, Date.now(), this._pendingTransactions);
    await block.mine();
    this._chain.push(block);
    this._pendingTransactions = [];
  }
}
