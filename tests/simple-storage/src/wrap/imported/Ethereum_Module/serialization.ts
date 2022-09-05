import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Option,
  BigInt,
  BigNumber,
  JSON,
  Context
} from "@polywrap/wasm-as";
import * as Types from "../..";

export class Args_callContractView {
  address: string;
  method: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
}

export function serializecallContractViewArgs(args: Args_callContractView): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: callContractView");
  const sizer = new WriteSizer(sizerContext);
  writecallContractViewArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: callContractView");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writecallContractViewArgs(encoder, args);
  return buffer;
}

export function writecallContractViewArgs(
  writer: Write,
  args: Args_callContractView
): void {
  writer.writeMapLength(4);
  writer.context().push("address", "string", "writing property");
  writer.writeString("address");
  writer.writeString(args.address);
  writer.context().pop();
  writer.context().push("method", "string", "writing property");
  writer.writeString("method");
  writer.writeString(args.method);
  writer.context().pop();
  writer.context().push("args", "Array<string> | null", "writing property");
  writer.writeString("args");
  writer.writeOptionalArray(args.args, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializecallContractViewResult(buffer: ArrayBuffer): string {
  const context: Context = new Context("Deserializing imported module-type: callContractView");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("callContractView", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Args_callContractStatic {
  address: string;
  method: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
  txOverrides: Types.Ethereum_TxOverrides | null;
}

export function serializecallContractStaticArgs(args: Args_callContractStatic): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: callContractStatic");
  const sizer = new WriteSizer(sizerContext);
  writecallContractStaticArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: callContractStatic");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writecallContractStaticArgs(encoder, args);
  return buffer;
}

export function writecallContractStaticArgs(
  writer: Write,
  args: Args_callContractStatic
): void {
  writer.writeMapLength(5);
  writer.context().push("address", "string", "writing property");
  writer.writeString("address");
  writer.writeString(args.address);
  writer.context().pop();
  writer.context().push("method", "string", "writing property");
  writer.writeString("method");
  writer.writeString(args.method);
  writer.context().pop();
  writer.context().push("args", "Array<string> | null", "writing property");
  writer.writeString("args");
  writer.writeOptionalArray(args.args, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
  writer.context().push("txOverrides", "Types.Ethereum_TxOverrides | null", "writing property");
  writer.writeString("txOverrides");
  if (args.txOverrides) {
    Types.Ethereum_TxOverrides.write(writer, args.txOverrides as Types.Ethereum_TxOverrides);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializecallContractStaticResult(buffer: ArrayBuffer): Types.Ethereum_StaticTxResult {
  const context: Context = new Context("Deserializing imported module-type: callContractStatic");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("callContractStatic", "Types.Ethereum_StaticTxResult", "reading function output");
  const object = Types.Ethereum_StaticTxResult.read(reader);
  const res: Types.Ethereum_StaticTxResult =  object;
  reader.context().pop();

  return res;
}

export class Args_getBalance {
  address: string;
  blockTag: BigInt | null;
  connection: Types.Ethereum_Connection | null;
}

export function serializegetBalanceArgs(args: Args_getBalance): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: getBalance");
  const sizer = new WriteSizer(sizerContext);
  writegetBalanceArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: getBalance");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetBalanceArgs(encoder, args);
  return buffer;
}

export function writegetBalanceArgs(
  writer: Write,
  args: Args_getBalance
): void {
  writer.writeMapLength(3);
  writer.context().push("address", "string", "writing property");
  writer.writeString("address");
  writer.writeString(args.address);
  writer.context().pop();
  writer.context().push("blockTag", "BigInt | null", "writing property");
  writer.writeString("blockTag");
  writer.writeOptionalBigInt(args.blockTag);
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializegetBalanceResult(buffer: ArrayBuffer): BigInt {
  const context: Context = new Context("Deserializing imported module-type: getBalance");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("getBalance", "BigInt", "reading function output");
  const res: BigInt = reader.readBigInt();
  reader.context().pop();

  return res;
}

export class Args_encodeParams {
  types: Array<string>;
  values: Array<string>;
}

export function serializeencodeParamsArgs(args: Args_encodeParams): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: encodeParams");
  const sizer = new WriteSizer(sizerContext);
  writeencodeParamsArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: encodeParams");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeencodeParamsArgs(encoder, args);
  return buffer;
}

export function writeencodeParamsArgs(
  writer: Write,
  args: Args_encodeParams
): void {
  writer.writeMapLength(2);
  writer.context().push("types", "Array<string>", "writing property");
  writer.writeString("types");
  writer.writeArray(args.types, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("values", "Array<string>", "writing property");
  writer.writeString("values");
  writer.writeArray(args.values, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
}

export function deserializeencodeParamsResult(buffer: ArrayBuffer): string {
  const context: Context = new Context("Deserializing imported module-type: encodeParams");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("encodeParams", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Args_encodeFunction {
  method: string;
  args: Array<string> | null;
}

export function serializeencodeFunctionArgs(args: Args_encodeFunction): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: encodeFunction");
  const sizer = new WriteSizer(sizerContext);
  writeencodeFunctionArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: encodeFunction");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeencodeFunctionArgs(encoder, args);
  return buffer;
}

export function writeencodeFunctionArgs(
  writer: Write,
  args: Args_encodeFunction
): void {
  writer.writeMapLength(2);
  writer.context().push("method", "string", "writing property");
  writer.writeString("method");
  writer.writeString(args.method);
  writer.context().pop();
  writer.context().push("args", "Array<string> | null", "writing property");
  writer.writeString("args");
  writer.writeOptionalArray(args.args, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
}

export function deserializeencodeFunctionResult(buffer: ArrayBuffer): string {
  const context: Context = new Context("Deserializing imported module-type: encodeFunction");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("encodeFunction", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Args_solidityPack {
  types: Array<string>;
  values: Array<string>;
}

export function serializesolidityPackArgs(args: Args_solidityPack): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: solidityPack");
  const sizer = new WriteSizer(sizerContext);
  writesolidityPackArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: solidityPack");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesolidityPackArgs(encoder, args);
  return buffer;
}

export function writesolidityPackArgs(
  writer: Write,
  args: Args_solidityPack
): void {
  writer.writeMapLength(2);
  writer.context().push("types", "Array<string>", "writing property");
  writer.writeString("types");
  writer.writeArray(args.types, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("values", "Array<string>", "writing property");
  writer.writeString("values");
  writer.writeArray(args.values, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
}

export function deserializesolidityPackResult(buffer: ArrayBuffer): string {
  const context: Context = new Context("Deserializing imported module-type: solidityPack");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("solidityPack", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Args_solidityKeccak256 {
  types: Array<string>;
  values: Array<string>;
}

export function serializesolidityKeccak256Args(args: Args_solidityKeccak256): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: solidityKeccak256");
  const sizer = new WriteSizer(sizerContext);
  writesolidityKeccak256Args(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: solidityKeccak256");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesolidityKeccak256Args(encoder, args);
  return buffer;
}

export function writesolidityKeccak256Args(
  writer: Write,
  args: Args_solidityKeccak256
): void {
  writer.writeMapLength(2);
  writer.context().push("types", "Array<string>", "writing property");
  writer.writeString("types");
  writer.writeArray(args.types, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("values", "Array<string>", "writing property");
  writer.writeString("values");
  writer.writeArray(args.values, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
}

export function deserializesolidityKeccak256Result(buffer: ArrayBuffer): string {
  const context: Context = new Context("Deserializing imported module-type: solidityKeccak256");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("solidityKeccak256", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Args_soliditySha256 {
  types: Array<string>;
  values: Array<string>;
}

export function serializesoliditySha256Args(args: Args_soliditySha256): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: soliditySha256");
  const sizer = new WriteSizer(sizerContext);
  writesoliditySha256Args(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: soliditySha256");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesoliditySha256Args(encoder, args);
  return buffer;
}

export function writesoliditySha256Args(
  writer: Write,
  args: Args_soliditySha256
): void {
  writer.writeMapLength(2);
  writer.context().push("types", "Array<string>", "writing property");
  writer.writeString("types");
  writer.writeArray(args.types, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("values", "Array<string>", "writing property");
  writer.writeString("values");
  writer.writeArray(args.values, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
}

export function deserializesoliditySha256Result(buffer: ArrayBuffer): string {
  const context: Context = new Context("Deserializing imported module-type: soliditySha256");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("soliditySha256", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Args_getSignerAddress {
  connection: Types.Ethereum_Connection | null;
}

export function serializegetSignerAddressArgs(args: Args_getSignerAddress): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: getSignerAddress");
  const sizer = new WriteSizer(sizerContext);
  writegetSignerAddressArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: getSignerAddress");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetSignerAddressArgs(encoder, args);
  return buffer;
}

export function writegetSignerAddressArgs(
  writer: Write,
  args: Args_getSignerAddress
): void {
  writer.writeMapLength(1);
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializegetSignerAddressResult(buffer: ArrayBuffer): string {
  const context: Context = new Context("Deserializing imported module-type: getSignerAddress");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("getSignerAddress", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Args_getSignerBalance {
  blockTag: BigInt | null;
  connection: Types.Ethereum_Connection | null;
}

export function serializegetSignerBalanceArgs(args: Args_getSignerBalance): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: getSignerBalance");
  const sizer = new WriteSizer(sizerContext);
  writegetSignerBalanceArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: getSignerBalance");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetSignerBalanceArgs(encoder, args);
  return buffer;
}

export function writegetSignerBalanceArgs(
  writer: Write,
  args: Args_getSignerBalance
): void {
  writer.writeMapLength(2);
  writer.context().push("blockTag", "BigInt | null", "writing property");
  writer.writeString("blockTag");
  writer.writeOptionalBigInt(args.blockTag);
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializegetSignerBalanceResult(buffer: ArrayBuffer): BigInt {
  const context: Context = new Context("Deserializing imported module-type: getSignerBalance");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("getSignerBalance", "BigInt", "reading function output");
  const res: BigInt = reader.readBigInt();
  reader.context().pop();

  return res;
}

export class Args_getSignerTransactionCount {
  blockTag: BigInt | null;
  connection: Types.Ethereum_Connection | null;
}

export function serializegetSignerTransactionCountArgs(args: Args_getSignerTransactionCount): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: getSignerTransactionCount");
  const sizer = new WriteSizer(sizerContext);
  writegetSignerTransactionCountArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: getSignerTransactionCount");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetSignerTransactionCountArgs(encoder, args);
  return buffer;
}

export function writegetSignerTransactionCountArgs(
  writer: Write,
  args: Args_getSignerTransactionCount
): void {
  writer.writeMapLength(2);
  writer.context().push("blockTag", "BigInt | null", "writing property");
  writer.writeString("blockTag");
  writer.writeOptionalBigInt(args.blockTag);
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializegetSignerTransactionCountResult(buffer: ArrayBuffer): BigInt {
  const context: Context = new Context("Deserializing imported module-type: getSignerTransactionCount");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("getSignerTransactionCount", "BigInt", "reading function output");
  const res: BigInt = reader.readBigInt();
  reader.context().pop();

  return res;
}

export class Args_getGasPrice {
  connection: Types.Ethereum_Connection | null;
}

export function serializegetGasPriceArgs(args: Args_getGasPrice): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: getGasPrice");
  const sizer = new WriteSizer(sizerContext);
  writegetGasPriceArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: getGasPrice");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetGasPriceArgs(encoder, args);
  return buffer;
}

export function writegetGasPriceArgs(
  writer: Write,
  args: Args_getGasPrice
): void {
  writer.writeMapLength(1);
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializegetGasPriceResult(buffer: ArrayBuffer): BigInt {
  const context: Context = new Context("Deserializing imported module-type: getGasPrice");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("getGasPrice", "BigInt", "reading function output");
  const res: BigInt = reader.readBigInt();
  reader.context().pop();

  return res;
}

export class Args_estimateTransactionGas {
  tx: Types.Ethereum_TxRequest;
  connection: Types.Ethereum_Connection | null;
}

export function serializeestimateTransactionGasArgs(args: Args_estimateTransactionGas): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: estimateTransactionGas");
  const sizer = new WriteSizer(sizerContext);
  writeestimateTransactionGasArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: estimateTransactionGas");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeestimateTransactionGasArgs(encoder, args);
  return buffer;
}

export function writeestimateTransactionGasArgs(
  writer: Write,
  args: Args_estimateTransactionGas
): void {
  writer.writeMapLength(2);
  writer.context().push("tx", "Types.Ethereum_TxRequest", "writing property");
  writer.writeString("tx");
  Types.Ethereum_TxRequest.write(writer, args.tx);
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializeestimateTransactionGasResult(buffer: ArrayBuffer): BigInt {
  const context: Context = new Context("Deserializing imported module-type: estimateTransactionGas");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("estimateTransactionGas", "BigInt", "reading function output");
  const res: BigInt = reader.readBigInt();
  reader.context().pop();

  return res;
}

export class Args_estimateContractCallGas {
  address: string;
  method: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
  txOverrides: Types.Ethereum_TxOverrides | null;
}

export function serializeestimateContractCallGasArgs(args: Args_estimateContractCallGas): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: estimateContractCallGas");
  const sizer = new WriteSizer(sizerContext);
  writeestimateContractCallGasArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: estimateContractCallGas");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeestimateContractCallGasArgs(encoder, args);
  return buffer;
}

export function writeestimateContractCallGasArgs(
  writer: Write,
  args: Args_estimateContractCallGas
): void {
  writer.writeMapLength(5);
  writer.context().push("address", "string", "writing property");
  writer.writeString("address");
  writer.writeString(args.address);
  writer.context().pop();
  writer.context().push("method", "string", "writing property");
  writer.writeString("method");
  writer.writeString(args.method);
  writer.context().pop();
  writer.context().push("args", "Array<string> | null", "writing property");
  writer.writeString("args");
  writer.writeOptionalArray(args.args, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
  writer.context().push("txOverrides", "Types.Ethereum_TxOverrides | null", "writing property");
  writer.writeString("txOverrides");
  if (args.txOverrides) {
    Types.Ethereum_TxOverrides.write(writer, args.txOverrides as Types.Ethereum_TxOverrides);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializeestimateContractCallGasResult(buffer: ArrayBuffer): BigInt {
  const context: Context = new Context("Deserializing imported module-type: estimateContractCallGas");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("estimateContractCallGas", "BigInt", "reading function output");
  const res: BigInt = reader.readBigInt();
  reader.context().pop();

  return res;
}

export class Args_checkAddress {
  address: string;
}

export function serializecheckAddressArgs(args: Args_checkAddress): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: checkAddress");
  const sizer = new WriteSizer(sizerContext);
  writecheckAddressArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: checkAddress");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writecheckAddressArgs(encoder, args);
  return buffer;
}

export function writecheckAddressArgs(
  writer: Write,
  args: Args_checkAddress
): void {
  writer.writeMapLength(1);
  writer.context().push("address", "string", "writing property");
  writer.writeString("address");
  writer.writeString(args.address);
  writer.context().pop();
}

export function deserializecheckAddressResult(buffer: ArrayBuffer): bool {
  const context: Context = new Context("Deserializing imported module-type: checkAddress");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("checkAddress", "bool", "reading function output");
  const res: bool = reader.readBool();
  reader.context().pop();

  return res;
}

export class Args_toWei {
  eth: string;
}

export function serializetoWeiArgs(args: Args_toWei): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: toWei");
  const sizer = new WriteSizer(sizerContext);
  writetoWeiArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: toWei");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writetoWeiArgs(encoder, args);
  return buffer;
}

export function writetoWeiArgs(
  writer: Write,
  args: Args_toWei
): void {
  writer.writeMapLength(1);
  writer.context().push("eth", "string", "writing property");
  writer.writeString("eth");
  writer.writeString(args.eth);
  writer.context().pop();
}

export function deserializetoWeiResult(buffer: ArrayBuffer): BigInt {
  const context: Context = new Context("Deserializing imported module-type: toWei");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("toWei", "BigInt", "reading function output");
  const res: BigInt = reader.readBigInt();
  reader.context().pop();

  return res;
}

export class Args_toEth {
  wei: BigInt;
}

export function serializetoEthArgs(args: Args_toEth): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: toEth");
  const sizer = new WriteSizer(sizerContext);
  writetoEthArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: toEth");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writetoEthArgs(encoder, args);
  return buffer;
}

export function writetoEthArgs(
  writer: Write,
  args: Args_toEth
): void {
  writer.writeMapLength(1);
  writer.context().push("wei", "BigInt", "writing property");
  writer.writeString("wei");
  writer.writeBigInt(args.wei);
  writer.context().pop();
}

export function deserializetoEthResult(buffer: ArrayBuffer): string {
  const context: Context = new Context("Deserializing imported module-type: toEth");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("toEth", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Args_awaitTransaction {
  txHash: string;
  confirmations: u32;
  timeout: u32;
  connection: Types.Ethereum_Connection | null;
}

export function serializeawaitTransactionArgs(args: Args_awaitTransaction): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: awaitTransaction");
  const sizer = new WriteSizer(sizerContext);
  writeawaitTransactionArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: awaitTransaction");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeawaitTransactionArgs(encoder, args);
  return buffer;
}

export function writeawaitTransactionArgs(
  writer: Write,
  args: Args_awaitTransaction
): void {
  writer.writeMapLength(4);
  writer.context().push("txHash", "string", "writing property");
  writer.writeString("txHash");
  writer.writeString(args.txHash);
  writer.context().pop();
  writer.context().push("confirmations", "u32", "writing property");
  writer.writeString("confirmations");
  writer.writeUInt32(args.confirmations);
  writer.context().pop();
  writer.context().push("timeout", "u32", "writing property");
  writer.writeString("timeout");
  writer.writeUInt32(args.timeout);
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializeawaitTransactionResult(buffer: ArrayBuffer): Types.Ethereum_TxReceipt {
  const context: Context = new Context("Deserializing imported module-type: awaitTransaction");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("awaitTransaction", "Types.Ethereum_TxReceipt", "reading function output");
  const object = Types.Ethereum_TxReceipt.read(reader);
  const res: Types.Ethereum_TxReceipt =  object;
  reader.context().pop();

  return res;
}

export class Args_waitForEvent {
  address: string;
  event: string;
  args: Array<string> | null;
  timeout: Option<u32>;
  connection: Types.Ethereum_Connection | null;
}

export function serializewaitForEventArgs(args: Args_waitForEvent): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: waitForEvent");
  const sizer = new WriteSizer(sizerContext);
  writewaitForEventArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: waitForEvent");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writewaitForEventArgs(encoder, args);
  return buffer;
}

export function writewaitForEventArgs(
  writer: Write,
  args: Args_waitForEvent
): void {
  writer.writeMapLength(5);
  writer.context().push("address", "string", "writing property");
  writer.writeString("address");
  writer.writeString(args.address);
  writer.context().pop();
  writer.context().push("event", "string", "writing property");
  writer.writeString("event");
  writer.writeString(args.event);
  writer.context().pop();
  writer.context().push("args", "Array<string> | null", "writing property");
  writer.writeString("args");
  writer.writeOptionalArray(args.args, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("timeout", "Option<u32>", "writing property");
  writer.writeString("timeout");
  writer.writeOptionalUInt32(args.timeout);
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializewaitForEventResult(buffer: ArrayBuffer): Types.Ethereum_EventNotification {
  const context: Context = new Context("Deserializing imported module-type: waitForEvent");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("waitForEvent", "Types.Ethereum_EventNotification", "reading function output");
  const object = Types.Ethereum_EventNotification.read(reader);
  const res: Types.Ethereum_EventNotification =  object;
  reader.context().pop();

  return res;
}

export class Args_getNetwork {
  connection: Types.Ethereum_Connection | null;
}

export function serializegetNetworkArgs(args: Args_getNetwork): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: getNetwork");
  const sizer = new WriteSizer(sizerContext);
  writegetNetworkArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: getNetwork");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetNetworkArgs(encoder, args);
  return buffer;
}

export function writegetNetworkArgs(
  writer: Write,
  args: Args_getNetwork
): void {
  writer.writeMapLength(1);
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializegetNetworkResult(buffer: ArrayBuffer): Types.Ethereum_Network {
  const context: Context = new Context("Deserializing imported module-type: getNetwork");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("getNetwork", "Types.Ethereum_Network", "reading function output");
  const object = Types.Ethereum_Network.read(reader);
  const res: Types.Ethereum_Network =  object;
  reader.context().pop();

  return res;
}

export class Args_requestAccounts {
  connection: Types.Ethereum_Connection | null;
}

export function serializerequestAccountsArgs(args: Args_requestAccounts): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: requestAccounts");
  const sizer = new WriteSizer(sizerContext);
  writerequestAccountsArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: requestAccounts");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writerequestAccountsArgs(encoder, args);
  return buffer;
}

export function writerequestAccountsArgs(
  writer: Write,
  args: Args_requestAccounts
): void {
  writer.writeMapLength(1);
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializerequestAccountsResult(buffer: ArrayBuffer): Array<string> {
  const context: Context = new Context("Deserializing imported module-type: requestAccounts");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("requestAccounts", "Array<string>", "reading function output");
  const res: Array<string> = reader.readArray((reader: Read): string => {
    return reader.readString();
  });
  reader.context().pop();

  return res;
}

export class Args_callContractMethod {
  address: string;
  method: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
  txOverrides: Types.Ethereum_TxOverrides | null;
}

export function serializecallContractMethodArgs(args: Args_callContractMethod): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: callContractMethod");
  const sizer = new WriteSizer(sizerContext);
  writecallContractMethodArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: callContractMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writecallContractMethodArgs(encoder, args);
  return buffer;
}

export function writecallContractMethodArgs(
  writer: Write,
  args: Args_callContractMethod
): void {
  writer.writeMapLength(5);
  writer.context().push("address", "string", "writing property");
  writer.writeString("address");
  writer.writeString(args.address);
  writer.context().pop();
  writer.context().push("method", "string", "writing property");
  writer.writeString("method");
  writer.writeString(args.method);
  writer.context().pop();
  writer.context().push("args", "Array<string> | null", "writing property");
  writer.writeString("args");
  writer.writeOptionalArray(args.args, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
  writer.context().push("txOverrides", "Types.Ethereum_TxOverrides | null", "writing property");
  writer.writeString("txOverrides");
  if (args.txOverrides) {
    Types.Ethereum_TxOverrides.write(writer, args.txOverrides as Types.Ethereum_TxOverrides);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializecallContractMethodResult(buffer: ArrayBuffer): Types.Ethereum_TxResponse {
  const context: Context = new Context("Deserializing imported module-type: callContractMethod");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("callContractMethod", "Types.Ethereum_TxResponse", "reading function output");
  const object = Types.Ethereum_TxResponse.read(reader);
  const res: Types.Ethereum_TxResponse =  object;
  reader.context().pop();

  return res;
}

export class Args_callContractMethodAndWait {
  address: string;
  method: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
  txOverrides: Types.Ethereum_TxOverrides | null;
}

export function serializecallContractMethodAndWaitArgs(args: Args_callContractMethodAndWait): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: callContractMethodAndWait");
  const sizer = new WriteSizer(sizerContext);
  writecallContractMethodAndWaitArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: callContractMethodAndWait");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writecallContractMethodAndWaitArgs(encoder, args);
  return buffer;
}

export function writecallContractMethodAndWaitArgs(
  writer: Write,
  args: Args_callContractMethodAndWait
): void {
  writer.writeMapLength(5);
  writer.context().push("address", "string", "writing property");
  writer.writeString("address");
  writer.writeString(args.address);
  writer.context().pop();
  writer.context().push("method", "string", "writing property");
  writer.writeString("method");
  writer.writeString(args.method);
  writer.context().pop();
  writer.context().push("args", "Array<string> | null", "writing property");
  writer.writeString("args");
  writer.writeOptionalArray(args.args, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
  writer.context().push("txOverrides", "Types.Ethereum_TxOverrides | null", "writing property");
  writer.writeString("txOverrides");
  if (args.txOverrides) {
    Types.Ethereum_TxOverrides.write(writer, args.txOverrides as Types.Ethereum_TxOverrides);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializecallContractMethodAndWaitResult(buffer: ArrayBuffer): Types.Ethereum_TxReceipt {
  const context: Context = new Context("Deserializing imported module-type: callContractMethodAndWait");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("callContractMethodAndWait", "Types.Ethereum_TxReceipt", "reading function output");
  const object = Types.Ethereum_TxReceipt.read(reader);
  const res: Types.Ethereum_TxReceipt =  object;
  reader.context().pop();

  return res;
}

export class Args_sendTransaction {
  tx: Types.Ethereum_TxRequest;
  connection: Types.Ethereum_Connection | null;
}

export function serializesendTransactionArgs(args: Args_sendTransaction): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: sendTransaction");
  const sizer = new WriteSizer(sizerContext);
  writesendTransactionArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: sendTransaction");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesendTransactionArgs(encoder, args);
  return buffer;
}

export function writesendTransactionArgs(
  writer: Write,
  args: Args_sendTransaction
): void {
  writer.writeMapLength(2);
  writer.context().push("tx", "Types.Ethereum_TxRequest", "writing property");
  writer.writeString("tx");
  Types.Ethereum_TxRequest.write(writer, args.tx);
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializesendTransactionResult(buffer: ArrayBuffer): Types.Ethereum_TxResponse {
  const context: Context = new Context("Deserializing imported module-type: sendTransaction");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("sendTransaction", "Types.Ethereum_TxResponse", "reading function output");
  const object = Types.Ethereum_TxResponse.read(reader);
  const res: Types.Ethereum_TxResponse =  object;
  reader.context().pop();

  return res;
}

export class Args_sendTransactionAndWait {
  tx: Types.Ethereum_TxRequest;
  connection: Types.Ethereum_Connection | null;
}

export function serializesendTransactionAndWaitArgs(args: Args_sendTransactionAndWait): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: sendTransactionAndWait");
  const sizer = new WriteSizer(sizerContext);
  writesendTransactionAndWaitArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: sendTransactionAndWait");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesendTransactionAndWaitArgs(encoder, args);
  return buffer;
}

export function writesendTransactionAndWaitArgs(
  writer: Write,
  args: Args_sendTransactionAndWait
): void {
  writer.writeMapLength(2);
  writer.context().push("tx", "Types.Ethereum_TxRequest", "writing property");
  writer.writeString("tx");
  Types.Ethereum_TxRequest.write(writer, args.tx);
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializesendTransactionAndWaitResult(buffer: ArrayBuffer): Types.Ethereum_TxReceipt {
  const context: Context = new Context("Deserializing imported module-type: sendTransactionAndWait");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("sendTransactionAndWait", "Types.Ethereum_TxReceipt", "reading function output");
  const object = Types.Ethereum_TxReceipt.read(reader);
  const res: Types.Ethereum_TxReceipt =  object;
  reader.context().pop();

  return res;
}

export class Args_deployContract {
  abi: string;
  bytecode: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
}

export function serializedeployContractArgs(args: Args_deployContract): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: deployContract");
  const sizer = new WriteSizer(sizerContext);
  writedeployContractArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: deployContract");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writedeployContractArgs(encoder, args);
  return buffer;
}

export function writedeployContractArgs(
  writer: Write,
  args: Args_deployContract
): void {
  writer.writeMapLength(4);
  writer.context().push("abi", "string", "writing property");
  writer.writeString("abi");
  writer.writeString(args.abi);
  writer.context().pop();
  writer.context().push("bytecode", "string", "writing property");
  writer.writeString("bytecode");
  writer.writeString(args.bytecode);
  writer.context().pop();
  writer.context().push("args", "Array<string> | null", "writing property");
  writer.writeString("args");
  writer.writeOptionalArray(args.args, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializedeployContractResult(buffer: ArrayBuffer): string {
  const context: Context = new Context("Deserializing imported module-type: deployContract");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("deployContract", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Args_signMessage {
  message: string;
  connection: Types.Ethereum_Connection | null;
}

export function serializesignMessageArgs(args: Args_signMessage): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: signMessage");
  const sizer = new WriteSizer(sizerContext);
  writesignMessageArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: signMessage");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesignMessageArgs(encoder, args);
  return buffer;
}

export function writesignMessageArgs(
  writer: Write,
  args: Args_signMessage
): void {
  writer.writeMapLength(2);
  writer.context().push("message", "string", "writing property");
  writer.writeString("message");
  writer.writeString(args.message);
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializesignMessageResult(buffer: ArrayBuffer): string {
  const context: Context = new Context("Deserializing imported module-type: signMessage");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("signMessage", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Args_sendRPC {
  method: string;
  params: Array<string>;
  connection: Types.Ethereum_Connection | null;
}

export function serializesendRPCArgs(args: Args_sendRPC): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: sendRPC");
  const sizer = new WriteSizer(sizerContext);
  writesendRPCArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: sendRPC");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesendRPCArgs(encoder, args);
  return buffer;
}

export function writesendRPCArgs(
  writer: Write,
  args: Args_sendRPC
): void {
  writer.writeMapLength(3);
  writer.context().push("method", "string", "writing property");
  writer.writeString("method");
  writer.writeString(args.method);
  writer.context().pop();
  writer.context().push("params", "Array<string>", "writing property");
  writer.writeString("params");
  writer.writeArray(args.params, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (args.connection) {
    Types.Ethereum_Connection.write(writer, args.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializesendRPCResult(buffer: ArrayBuffer): string | null {
  const context: Context = new Context("Deserializing imported module-type: sendRPC");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("sendRPC", "string | null", "reading function output");
  const res: string | null = reader.readOptionalString();
  reader.context().pop();

  return res;
}
