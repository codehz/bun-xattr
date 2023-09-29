import { type } from "node:os";
const { getxattr, setxattr, listxattr, removexattr } = (await import(
  `./impl/${type()}`
)) as typeof import("./impl/Darwin");
export { getxattr, listxattr, removexattr, setxattr };
