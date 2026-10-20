import { Module, Global } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export const STORAGE_SERVICE = 'STORAGE_SERVICE';

@Global()
@Module({
  providers: [
    {
      provide: STORAGE_SERVICE,
      useFactory: () => {
        // Minimal local storage adapter for development. Replace with S3-compatible implementation later.
        const root = process.env.STORAGE_ROOT || path.join(process.cwd(), 'storage');
        if (!fs.existsSync(root)) fs.mkdirSync(root, { recursive: true });
        return {
          root,
          async put(key: string, buffer: Buffer) {
            const p = path.join(root, key);
            await fs.promises.mkdir(path.dirname(p), { recursive: true });
            await fs.promises.writeFile(p, buffer);
            return { key };
          },
          async get(key: string) {
            const p = path.join(root, key);
            return fs.promises.readFile(p);
          }
        };
      }
    }
  ],
  exports: [STORAGE_SERVICE]
})
export class StorageModule {}
