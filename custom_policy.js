class CardanoWasmModule {
	async load() {
		this.wasm = await import("./node_modules/@emurgo/cardano-serialization-lib-asmjs/cardano_serialization_lib.js")
	}
	get API() {
		return this.wasm
	}
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

var mnemonic = "leader swarm dust tribe original ozone motion kick neither steel acid dash drip ski infant chair essence chief wash biology mansion bus unhappy same"
var address = "addr_test1qzc3st784d9knhshh6kkpm0l53d74juw9gm4yhaey6ucstjz25q0fkzlsy4n8zy2smtclgl8g3hmaw06u0d2rw46u9ysdpk8fx"
const entropy = bip39.mnemonicToEntropy(mnemonic)
const description = "Testcoin"


function mint(){
    const txId = input_tx.value
    const txIndex = input_index.value
    const txAmount = input_amount.value
    console.log(txId)
    console.log(txIndex)
    console.log(txAmount)

    


    const CardanoWasm = new CardanoWasmModule;

    CardanoWasm.load().then(function(){
        const rootKey= CardanoWasm.wasm.Bip32PrivateKey.from_bip39_entropy(buffer.Buffer.from(entropy, 'hex'),buffer.Buffer.from(''),)

        const accountKey = rootKey.derive(harden(1852)).derive(harden(1815)).derive(harden(0));
        const utxoPubKey = accountKey.derive(0).derive(0).to_public();
        const stakeKey = accountKey.derive(2).derive(0).to_public();
           
        // console.log(policyKeyHash)

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
    
        txBuilder.add_input(
            baseAddr.to_address(),
            CardanoWasm.wasm.TransactionInput.new(
                CardanoWasm.wasm.TransactionHash.from_bytes(
                    buffer.Buffer.from(txId, "hex")
                ), // tx hash
                txIndex, // index
            ),
            CardanoWasm.wasm.Value.new(CardanoWasm.wasm.BigNum.from_str(txAmount))
        );
    
        const shelleyOutputAddress = CardanoWasm.wasm.Address.from_bech32(address);
    
        const assetStr  = "4d696368436f696e";
        const AssetName = CardanoWasm.wasm.AssetName.new(buffer.Buffer.from(assetStr, "hex"));
        const timelockExpirySlot = 63675393
        const addr = baseAddr.to_address();


        const cborHex = "582009ca7f508dd5a5f9823d367e98170f25606799f49ae7363a47a11d7d3502c91f"

        const policyPrivateKey = CardanoWasm.wasm.PrivateKey.from_normal_bytes(
            CBOR.decode(
                buffer.Buffer.from(cborHex, 'hex').buffer
            )
          );
        const policyPubKey = policyPrivateKey.to_public()
        console.log("policyPubKey", policyPubKey.to_bech32())
        
        const policyAddr = CardanoWasm.wasm.BaseAddress.new(
            CardanoWasm.wasm.NetworkInfo.testnet().network_id(),
            CardanoWasm.wasm.StakeCredential.from_keyhash(policyPubKey.hash()),
            CardanoWasm.wasm.StakeCredential.from_keyhash(policyPubKey.hash())
            ).to_address();

        // const policyKeyHash = CardanoWasm.wasm.BaseAddress.from_address(policyAddr).payment_cred().to_keyhash();
        const ScriptKeyHash = policyPubKey.hash()
        
        // console.log(policyKeyHash)
        // console.log(policyKeyHash)

        const scripts = CardanoWasm.wasm.NativeScripts.new();


        // const keyHashScript = CardanoWasm.wasm.NativeScript.new_script_pubkey(
        //     CardanoWasm.wasm.ScriptPubkey.new(policyKeyHash)
        //   );

          policy_vkey = "6d50d6892f24be81024885a9333c6d093bf3a23057fc5d111db73e3a"
        //   const ScriptKeyHash = CardanoWasm.wasm.Ed25519KeyHash.from_bytes(
        //       buffer.Buffer.from(policy_vkey, "hex") 
        //   )
      
          const scriptPubkey = CardanoWasm.wasm.NativeScript.new_script_pubkey(
              CardanoWasm.wasm.ScriptPubkey.new(ScriptKeyHash)
          )          

        // scripts.add(keyHashScript);
        scripts.add(scriptPubkey);

        
        const mintScript = CardanoWasm.wasm.NativeScript.new_script_all(
            CardanoWasm.wasm.ScriptAll.new(scripts)
          );




        const policyId = buffer.Buffer.from(
            scriptPubkey.hash(0).to_bytes()
          ).toString('hex')

        const NativeScripts = CardanoWasm.wasm.NativeScripts.new();

        //   const policyId = buffer.Buffer.from(mintScript.hash().to_bytes()).toString("hex");
        
          console.log(policyId)
          
          
          const policyTtl = timelockExpirySlot

        txBuilder.add_mint_asset_and_output_min_required_coin(
            mintScript,
            AssetName,
            CardanoWasm.wasm.Int.new(CardanoWasm.wasm.BigNum.from_str("1")),
            CardanoWasm.wasm.TransactionOutputBuilder.new().with_address(addr).next()
        );


        const metadata = {
            [policyId]: {
            [AssetName]: {
                name: AssetName,
                description,
                image: "ipfs://QmZYPGQ6RSEmP2uHcL2pvHLNzwYrrUvjB6WT1zKGN2cujc",
                mediaType: "image/jpeg",
            },
            },
        };

        // txBuilder.set_ttl(timelockExpirySlot);

        txBuilder.add_json_metadatum(
            CardanoWasm.wasm.BigNum.from_str("721"),
            JSON.stringify(metadata)
        );

        txBuilder.add_change_if_needed(shelleyOutputAddress);

            
        const txBody = txBuilder.build();
        const txHash = CardanoWasm.wasm.hash_transaction(txBody);


        const witnesses = CardanoWasm.wasm.TransactionWitnessSet.new();
        const vkeyWitnesses = CardanoWasm.wasm.Vkeywitnesses.new();
        vkeyWitnesses.add(CardanoWasm.wasm.make_vkey_witness(txHash, accountKey.derive(0).derive(0).to_raw_key()));
        vkeyWitnesses.add(CardanoWasm.wasm.make_vkey_witness(txHash, policyPrivateKey));

        witnesses.set_vkeys(vkeyWitnesses);
        witnesses.set_native_scripts

        const witnessScripts = CardanoWasm.wasm.NativeScripts.new();
        witnessScripts.add(mintScript);
        witnesses.set_native_scripts(witnessScripts);

        const unsignedTx = txBuilder.build_tx();

        const tx = CardanoWasm.wasm.Transaction.new(
            unsignedTx.body(),
            witnesses,
            unsignedTx.auxiliary_data()
        );

        const signedTx = buffer.Buffer.from(tx.to_bytes()).toString("base64");
        console.log(signedTx)

        saveByteArray( "tx", tx.to_bytes() );
    })



}

function burn(){
    const txId = input_tx.value
    const txIndex = input_index.value
    const txAmount = input_amount.value
    console.log(txId)
    console.log(txIndex)
    console.log(txAmount)

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
    
        txBuilder.add_input(
            baseAddr.to_address(),
            CardanoWasm.wasm.TransactionInput.new(
                CardanoWasm.wasm.TransactionHash.from_bytes(
                    buffer.Buffer.from(txId, "hex")
                ), // tx hash
                txIndex, // index
            ),
            CardanoWasm.wasm.Value.new(CardanoWasm.wasm.BigNum.from_str(txAmount))
        );
    
        const shelleyOutputAddress = CardanoWasm.wasm.Address.from_bech32(address);
    
        const assetStr  = "4d696368436f696e";
        const AssetName = CardanoWasm.wasm.AssetName.new(buffer.Buffer.from(assetStr, "hex"));
        const timelockExpirySlot = 63675393
        const addr = baseAddr.to_address();

        const mint = CardanoWasm.wasm.Mint.new()
        const MintAssets = CardanoWasm.wasm.MintAssets.new();
    
        MintAssets.insert(
            AssetName,
            CardanoWasm.wasm.Int.new_negative(CardanoWasm.wasm.BigNum.from_str("1"))
          ); 
    
    
       const keyHash = CardanoWasm.wasm.BaseAddress.from_address(addr).payment_cred().to_keyhash();
       
       const keyHashScript = CardanoWasm.wasm.NativeScript.new_script_pubkey(
           CardanoWasm.wasm.ScriptPubkey.new(keyHash)
           );
           
        const timelock = CardanoWasm.wasm.TimelockExpiry.new(timelockExpirySlot);
        const timelockScript = CardanoWasm.wasm.NativeScript.new_timelock_expiry(timelock);
           
        const scripts = CardanoWasm.wasm.NativeScripts.new();
        scripts.add(keyHashScript);
        scripts.add(timelockScript);
    
        const mintScript = CardanoWasm.wasm.NativeScript.new_script_all(
            CardanoWasm.wasm.ScriptAll.new(scripts)
        );
    
        const burnScript = CardanoWasm.wasm.NativeScripts.new()
        burnScript.add(mintScript)
    
        const policyId = buffer.Buffer.from(mintScript.hash().to_bytes()).toString("hex");
        const scriptHash = CardanoWasm.wasm.ScriptHash.from_bytes(
            buffer.Buffer.from(policyId, "hex")
          );
        mint.insert(scriptHash, MintAssets);    
    
        txBuilder.set_mint(mint, burnScript)
        txBuilder.set_ttl(timelockExpirySlot);
        txBuilder.add_change_if_needed(shelleyOutputAddress);
    
            
        const txBody = txBuilder.build();
        const txHash = CardanoWasm.wasm.hash_transaction(txBody);
    
        console.log(`TX_HASH: ${buffer.Buffer.from(txHash.to_bytes()).toString("hex")}`);
    
        const witnesses = CardanoWasm.wasm.TransactionWitnessSet.new();
        const vkeyWitnesses = CardanoWasm.wasm.Vkeywitnesses.new();
        vkeyWitnesses.add(CardanoWasm.wasm.make_vkey_witness(txHash, accountKey.derive(0).derive(0).to_raw_key()));
        witnesses.set_vkeys(vkeyWitnesses);
        const witnessScripts = CardanoWasm.wasm.NativeScripts.new();
        witnessScripts.add(mintScript);
        witnesses.set_native_scripts(witnessScripts);
    
        const unsignedTx = txBuilder.build_tx();
    
        const tx = CardanoWasm.wasm.Transaction.new(
            unsignedTx.body(),
            witnesses,
            unsignedTx.auxiliary_data()
        );
    
        const signedTx = buffer.Buffer.from(tx.to_bytes()).toString("base64");
        console.log(signedTx)


        saveByteArray( "tx", tx.to_bytes() );


    })

}

function harden(num) {
    return 0x80000000 + num;
  }