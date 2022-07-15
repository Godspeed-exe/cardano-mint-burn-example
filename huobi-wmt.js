class CardanoWasmModule {
	async load() {
		this.wasm = await import("./node_modules/@emurgo/cardano-serialization-lib-asmjs/cardano_serialization_lib.js")
	}
	get API() {
		return this.wasm
	}
}

function harden(num) {
    return 0x80000000 + num;
  }


const CardanoWasm = new CardanoWasmModule;

CardanoWasm.load().then(function(){
    const multiAsset = getAsset('100000');

    const inputValue = CardanoWasm.wasm.Value.new(CardanoWasm.wasm.BigNum.from_str('1500000'));
    inputValue.set_multiasset(multiAsset);
    
    console.log(CardanoWasm.wasm.min_ada_required(
        inputValue,
        false,
        CardanoWasm.wasm.BigNum.from_str('34482')
    ).to_str());

  })

  
  function getAsset(amount) {
      const multiAsset = CardanoWasm.wasm.MultiAsset.new();
      const name = CardanoWasm.wasm.AssetName.new(buffer.Buffer.from('776f726c646d6f62696c65746f6b656e', 'hex'));
      const asset = CardanoWasm.wasm.Assets.new();
  
      asset.insert(name, CardanoWasm.wasm.BigNum.from_str(amount));
      const sHash = CardanoWasm.wasm.ScriptHash.from_bytes(buffer.Buffer.from('1d7f33bd23d85e1a25d87d86fac4f199c3197a2f7afeb662a0f34e1e', 'hex'));
      multiAsset.insert(sHash, asset);
  
      return multiAsset;
  }