import { CString } from "bun:ffi";

export const encoder = new TextEncoder();
export const decoder = new TextDecoder();
const EMPTY = new Uint8Array([0]);

export function cstr(jsstr: string) {
  return (jsstr ? encoder.encode(jsstr + "\x00") : EMPTY) as unknown as CString;
}

export function checkReturnValue<T extends number | bigint>(ret: T): T {
  if (typeof ret === "number" && ret < 0) throw new NativeError();
  return ret;
}

// Unfortunately there's no way to get the errno
export class NativeError extends Error {
  constructor() {
    super("native error");
  }
}

export function decodeCStrContinusArray(buffer: Uint8Array) {
  const ret: string[] = [];
  let cursor = 0;
  while (cursor < buffer.length - 1) {
    const next = buffer.indexOf(0, cursor);
    if (next === -1) throw new Error("unexpected eof");
    const decoded = decoder.decode(buffer.subarray(cursor, next));
    ret.push(decoded);
    cursor = next + 1;
  }
  return ret;
}
