# bun-xattr

Bun wrapper for getting, setting, removing and listing extended attributes on files.

OS Support: macOS and Linux (I will try to add support for windows via NtSetEaFile/NtQueryEaFile in future)

usage:

```typescript
import { setxattr, listxattr, getxattr, removexattr } from "bun-xattr";

const file = "./path/to/file";
setxattr(file, "user.mime", "text/html");
console.log(listxattr(file));
console.log(getxattr(file, "user.mime"));
removexattr(file, "user.mime");
```