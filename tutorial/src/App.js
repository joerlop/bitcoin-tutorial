import React from "react";
import "./App.css";

const bitcoin = require("bitcoinjs-lib");

// Sets network to testnet
const network = bitcoin.networks.testnet;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      address: "",
      keypair: "",
      outputNumber: "",
      txid: "",
      amount: null,
      hex: ""
    };
  }

  generateAddress = e => {
    e.preventDefault();

    // Generates keypair (public and private key)
    const keypair = bitcoin.ECPair.makeRandom({ network });

    // Grabs public key from keypair
    const pubkey = keypair.publicKey;

    // Creates p2pkh address
    const addressObject = bitcoin.payments.p2pkh({ pubkey, network });

    const address = addressObject.address;
    console.log(address);
    this.setState({
      ...this.state,
      address: address,
      keypair: keypair
    });
  };

  createTransaction = e => {
    e.preventDefault();

    // Creates transaction builder
    const txb = new bitcoin.TransactionBuilder();

    txb.network = bitcoin.networks.testnet;

    let outputNumber = this.state.outputNumber;
    let txid = this.state.txid;
    let amount = this.state.amount;

    // Transaction inputs - txid: transaction id, outputNumber: number of btc transferred in that transaction
    txb.addInput(txid, +outputNumber);

    const destinationAddress = "mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB";

    // In satoshis
    const minerFee = 10000;

    const outputAmount = amount * 1e8 - minerFee;

    txb.addOutput(destinationAddress, +outputAmount);

    // We need to sign the transaction
    txb.sign(0, this.state.keypair);

    const hex = txb.build().toHex();

    this.setState({
      ...this.state,
      hex: hex
    });
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="App">
        <h1>Bitcoin rules!</h1>
        <button onClick={this.generateAddress}>Generate Bitcoin address</button>
        <p>Address: {this.state.address}</p>
        <br />
        <input
          type="text"
          placeholder="outputNumber"
          name="outputNumber"
          onChange={e => this.handleChange(e)}
          value={this.state.outputNumber}
        />
        <input
          type="text"
          placeholder="txid"
          name="txid"
          onChange={e => this.handleChange(e)}
          value={this.state.txid}
        />
        <input
          type="text"
          placeholder="amount"
          name="amount"
          onChange={e => this.handleChange(e)}
          value={this.state.amount}
        />
        <button onClick={this.createTransaction}>Create transaction</button>
        <p>Hex: {this.state.hex}</p>
      </div>
    );
  }
}

export default App;
