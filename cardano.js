class CardanoWasmModule {
	async load() {
		this.wasm = await import("./node_modules/@emurgo/cardano-serialization-lib-asmjs/cardano_serialization_lib.js")
	}
	get API() {
		return this.wasm
	}
}

async function getutxos(address){

    return fetch('https://cardano-preprod.blockfrost.io/api/v0/addresses/'+address+'/utxos', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'project_id': blockfrost_id,
        }
      }).then(response => response.json())
      .then((responseJson) => {return responseJson;})
      .catch(error => console.log(error));

}

function saveByteArray(reportName, byte) {
    var blob = new Blob([byte]);
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
};

let input_tx = document.getElementById("txhash");
let input_index = document.getElementById("hashid");
let input_amount = document.getElementById("amount");

var blockfrost_id = "preprod15FQAa3zauTfVwRuRNC2a0Z7Ho4rwigF"
var mnemonic = "leader swarm dust tribe original ozone motion kick neither steel acid dash drip ski infant chair essence chief wash biology mansion bus unhappy same"
var address = "addr_test1qzc3st784d9knhshh6kkpm0l53d74juw9gm4yhaey6ucstjz25q0fkzlsy4n8zy2smtclgl8g3hmaw06u0d2rw46u9ysdpk8fx"
const entropy = bip39.mnemonicToEntropy(mnemonic)
const CARDANO_CONTRACT_HASH="542cadfaa02bbcc5fa6981729bc20b2b1ae80926eec054ecbfdc9f0e"

function execute(){

    const CardanoWasm = new CardanoWasmModule;

    CardanoWasm.load().then(function(){
        const rootKey= CardanoWasm.wasm.Bip32PrivateKey.from_bip39_entropy(buffer.Buffer.from(entropy, 'hex'),buffer.Buffer.from(''),)

        const accountKey = rootKey.derive(harden(1852)).derive(harden(1815)).derive(harden(0));
        const utxoPubKey = accountKey.derive(0).derive(0).to_public();
        const stakeKey = accountKey.derive(2).derive(0).to_public();
    
        const baseAddr = CardanoWasm.wasm.BaseAddress.new(
            CardanoWasm.wasm.NetworkInfo.testnet().network_id(),
              CardanoWasm.wasm.StakeCredential.from_keyhash(utxoPubKey.to_raw_key().hash()),
              CardanoWasm.wasm.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
          );
    
        const linearFee = CardanoWasm.wasm.LinearFee.new(
            CardanoWasm.wasm.BigNum.from_str('44'),
            CardanoWasm.wasm.BigNum.from_str('155381')
        );
        const txBuilderCfg = CardanoWasm.wasm.TransactionBuilderConfigBuilder.new()
            .fee_algo(linearFee)
            .pool_deposit(CardanoWasm.wasm.BigNum.from_str('500000000'))
            .key_deposit(CardanoWasm.wasm.BigNum.from_str('2000000'))
            .max_value_size(4000)
            .max_tx_size(8000)
            .coins_per_utxo_word(CardanoWasm.wasm.BigNum.from_str('34482'))
            .build();
        const txBuilder = CardanoWasm.wasm.TransactionBuilder.new(txBuilderCfg);
    
        // txBuilder.add_input(
        //     baseAddr.to_address(),
        //     CardanoWasm.wasm.TransactionInput.new(
        //         CardanoWasm.wasm.TransactionHash.from_bytes(
        //             buffer.Buffer.from(txId, "hex")
        //         ), // tx hash
        //         txIndex, // index
        //     ),
        //     CardanoWasm.wasm.Value.new(CardanoWasm.wasm.BigNum.from_str(txAmount))
        // );
    
        // const shelleyOutputAddress = CardanoWasm.wasm.Address.from_bech32(address);
    
        // const assetStr  = "4d696368436f696e";
        // const AssetName = CardanoWasm.wasm.AssetName.new(buffer.Buffer.from(assetStr, "hex"));
        // const timelockExpirySlot = 63675393
        const addr = baseAddr.to_address();
        console.log(addr.to_bech32())
        
        CardanoWasm.wasm.Address.
        
        const scriptHash = CardanoWasm.wasm.ScriptHash.from_hex(CARDANO_CONTRACT_HASH)
        
        const recipientContractAddress = CardanoWasm.wasm.EnterpriseAddress.new(
            0,
            CardanoWasm.wasm.StakeCredential.from_scripthash(scriptHash),
          ).to_address()

        console.log(recipientContractAddress.to_bech32())


        getutxos(addr.to_bech32()).then(response => {
            console.log(response)
        })

        getutxos(recipientContractAddress.to_bech32()).then(response => {
            console.log(response)
        })
        
        
        // txBuilder.set_ttl(timelockExpirySlot);

        // txBuilder.add_json_metadatum(
        //     CardanoWasm.wasm.BigNum.from_str("721"),
        //     JSON.stringify(metadata)
        // );

        // txBuilder.add_change_if_needed(shelleyOutputAddress);

            
        // const txBody = txBuilder.build();
        // const txHash = CardanoWasm.wasm.hash_transaction(txBody);


        // const witnesses = CardanoWasm.wasm.TransactionWitnessSet.new();
        // const vkeyWitnesses = CardanoWasm.wasm.Vkeywitnesses.new();
        // vkeyWitnesses.add(CardanoWasm.wasm.make_vkey_witness(txHash, accountKey.derive(0).derive(0).to_raw_key()));
        // witnesses.set_vkeys(vkeyWitnesses);
        // const witnessScripts = CardanoWasm.wasm.NativeScripts.new();
        // witnessScripts.add(mintScript);
        // witnesses.set_native_scripts(witnessScripts);

        // const unsignedTx = txBuilder.build_tx();

        // const tx = CardanoWasm.wasm.Transaction.new(
        //     unsignedTx.body(),
        //     witnesses,
        //     unsignedTx.auxiliary_data()
        // );

        // const signedTx = buffer.Buffer.from(tx.to_bytes()).toString("base64");
        // console.log(signedTx)

        // saveByteArray( "tx", tx.to_bytes() );
    })



}


function harden(num) {
    return 0x80000000 + num;
  }