import { dlopen, FFIType } from "bun:ffi";
import { checkReturnValue, cstr, decodeCStrContinusArray } from "../utils";

const { symbols: NativeAPI } = dlopen("libc.so.6", {
  getxattr: {
    args: [FFIType.cstring, FFIType.cstring, FFIType.pointer, FFIType.u64_fast],
    returns: FFIType.i64_fast,
  },
  fgetxattr: {
    args: [FFIType.i32, FFIType.cstring, FFIType.pointer, FFIType.u64_fast],
    returns: FFIType.i64_fast,
  },
  setxattr: {
    args: [
      FFIType.cstring,
      FFIType.cstring,
      FFIType.pointer,
      FFIType.u64_fast,
      FFIType.i32,
    ],
    returns: FFIType.i32,
  },
  fsetxattr: {
    args: [
      FFIType.i32,
      FFIType.cstring,
      FFIType.pointer,
      FFIType.u64_fast,
      FFIType.i32,
    ],
    returns: FFIType.i32,
  },
  listxattr: {
    args: [FFIType.cstring, FFIType.cstring, FFIType.u64_fast],
    returns: FFIType.i64_fast,
  },
  flistxattr: {
    args: [FFIType.i32, FFIType.cstring, FFIType.u64_fast],
    returns: FFIType.i64_fast,
  },
  removexattr: {
    args: [FFIType.cstring, FFIType.cstring, FFIType.i32],
    returns: FFIType.i32,
  },
  fremovexattr: {
    args: [FFIType.i32, FFIType.cstring, FFIType.i32],
    returns: FFIType.i32,
  },
});

export function getxattr(target: string | number, key: string) {
  const keyBuffer = cstr(key);
  if (typeof target === "number") {
    const size = checkReturnValue(
      NativeAPI.fgetxattr(target, keyBuffer, null, 0)
    );
    if (typeof size === "bigint")
      throw new Error("xattr is too big to fit buffer");
    const buffer = new Uint8Array(size);
    checkReturnValue(
      NativeAPI.fgetxattr(target, keyBuffer, buffer, buffer.length)
    );
    return buffer;
  } else {
    const path = cstr(target);
    const size = checkReturnValue(NativeAPI.getxattr(path, keyBuffer, null, 0));
    if (typeof size === "bigint")
      throw new Error("xattr is too big to fit buffer");
    const buffer = new Uint8Array(size);
    checkReturnValue(
      NativeAPI.getxattr(path, keyBuffer, buffer, buffer.length)
    );
    return buffer;
  }
}

export function setxattr(
  target: string | number,
  key: string,
  value: Uint8Array | string
) {
  const keyBuffer = cstr(key);
  const valueBuffer = typeof value === "string" ? cstr(value) : value;
  if (typeof target === "number") {
    checkReturnValue(
      NativeAPI.fsetxattr(target, keyBuffer, valueBuffer, valueBuffer.length, 0)
    );
  } else {
    const path = cstr(target);
    checkReturnValue(
      NativeAPI.setxattr(path, keyBuffer, valueBuffer, valueBuffer.length, 0)
    );
  }
}

export function listxattr(target: string | number) {
  if (typeof target === "number") {
    const size = checkReturnValue(NativeAPI.flistxattr(target, null, 0));
    if (typeof size === "bigint")
      throw new Error("xattr is too big to fit buffer");
    const buffer = new Uint8Array(size);
    checkReturnValue(NativeAPI.flistxattr(target, buffer, buffer.length));
    return decodeCStrContinusArray(buffer);
  } else {
    const path = cstr(target);
    const size = checkReturnValue(NativeAPI.listxattr(path, null, 0));
    if (typeof size === "bigint")
      throw new Error("xattr is too big to fit buffer");
    const buffer = new Uint8Array(size);
    checkReturnValue(NativeAPI.listxattr(path, buffer, buffer.length));
    return decodeCStrContinusArray(buffer);
  }
}

export function removexattr(target: string | number, key: string) {
  const keyBuffer = cstr(key);
  if (typeof target === "number") {
    checkReturnValue(NativeAPI.fremovexattr(target, keyBuffer, 0));
  } else {
    const path = cstr(target);
    checkReturnValue(NativeAPI.removexattr(path, keyBuffer, 0));
  }
}
