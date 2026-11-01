/**
 * One-off migration: local uploads -> Cloudflare R2.
 * From server/: npx tsx scripts/migrate-media-to-r2.ts [--apply]
 */
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import { env } from '../src/config/env';
import { BlogPostModel } from '../src/models/BlogPost';
import { BiodataModel } from '../src/models/Biodata';
import { createStorageProvider } from '../src/providers/storage/createStorageProvider';
import { mediaKey } from '../src/providers/storage/R2StorageProvider';
import { detectImageMime } from '../src/utils/imageMagic';
import { processProfilePhoto } from '../src/services/biodata/uploadPhotoService';

const apply = process.argv.includes('--apply');

function legacyBlogFileName(url: string): string | null {
  const match = /\/api\/v1\/media\/blog\/([^/?#]+)/.exec(url);
  return match?.[1] ?? null;
}

function legacyPhotoFileName(url: string): string | null {
  const noQuery = url.split('?')[0] ?? url;
  const match =
    /\/api\/v1\/media\/photos\/([^/]+)$/.exec(noQuery) ||
    /\/uploads\/(?!exports\/)([^/]+)$/.exec(noQuery);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

async function resolvePhotoPath(fileName: string): Promise<string | null> {
  const root = path.resolve(process.cwd(), 'uploads');
  for (const candidate of [
    path.join(root, 'photos', fileName),
    path.join(root, fileName),
  ]) {
    try {
      const st = await fs.stat(candidate);
      if (st.isFile()) return candidate;
    } catch {
      // missing
    }
  }
  return null;
}

async function main(): Promise<void> {
  console.log(apply ? 'APPLY mode' : 'DRY RUN (pass --apply to write)');
  await mongoose.connect(env.MONGODB_URI);
  const storage = createStorageProvider();

  let photos = 0;
  let covers = 0;
  let inline = 0;
  let missing = 0;
  const photoCache = new Map<string, string>();

  const biodatas = await BiodataModel.find({
    'content.profilePhotoUrl': { $exists: true, $type: 'string' },
  }).lean();

  for (const doc of biodatas) {
    const old = doc.content?.profilePhotoUrl as string | undefined;
    if (!old) continue;
    const fileName = legacyPhotoFileName(old);
    if (!fileName) continue;

    const diskPath = await resolvePhotoPath(fileName);
    if (!diskPath) {
      console.log('MISSING photo', String(doc._id), old);
      missing += 1;
      continue;
    }

    const cacheKey = `${doc.userId}:${fileName}`;
    let canonical = photoCache.get(cacheKey);
    console.log('photo', String(doc._id), fileName, '->', canonical ?? '(upload)');
    photos += 1;

    if (apply) {
      if (!canonical) {
        const buffer = await fs.readFile(diskPath);
        if (!detectImageMime(buffer)) {
          throw new Error(`Invalid image magic for ${diskPath}`);
        }
        const processed = await processProfilePhoto(buffer);
        const key = mediaKey('userPhotos', 'webp', String(doc.userId));
        const stored = await storage.upload({
          buffer: processed,
          mimeType: 'image/webp',
          key,
          access: 'private',
          cacheControl: 'private, max-age=86400',
        });
        canonical = stored.url;
        photoCache.set(cacheKey, canonical);
        console.log('  uploaded', stored.key);
      }
      await BiodataModel.updateOne(
        { _id: doc._id, 'content.profilePhotoUrl': old },
        { $set: { 'content.profilePhotoUrl': canonical } },
      );
    }
  }

  const posts = await BlogPostModel.find({
    $or: [
      { coverImageUrl: { $regex: '/api/v1/media/blog/' } },
      { contentHtml: { $regex: '/api/v1/media/blog/' } },
    ],
  });

  for (const post of posts) {
    if (post.coverImageUrl && /\/api\/v1\/media\/blog\//.test(post.coverImageUrl)) {
      const fileName = post.coverImageKey || legacyBlogFileName(post.coverImageUrl);
      if (!fileName) {
        console.log('MISSING cover key', String(post._id));
        missing += 1;
      } else {
        const diskPath = path.resolve(process.cwd(), 'uploads', 'blog', fileName);
        try {
          await fs.stat(diskPath);
          console.log('cover', String(post._id), fileName);
          covers += 1;
          if (apply) {
            const buffer = await fs.readFile(diskPath);
            const key = mediaKey('blogCover', 'webp');
            const stored = await storage.upload({
              buffer,
              mimeType: 'image/webp',
              key,
              access: 'public',
              cacheControl: 'public, max-age=31536000, immutable',
            });
            console.log('  uploaded', stored.key);
            await BlogPostModel.updateOne(
              {
                _id: post._id,
                coverImageUrl: post.coverImageUrl,
              },
              {
                $set: {
                  coverImageUrl: stored.url,
                  coverImageKey: stored.key,
                },
              },
            );
          }
        } catch {
          console.log('MISSING cover file', String(post._id), fileName);
          missing += 1;
        }
      }
    }

    if (post.contentHtml && /\/api\/v1\/media\/blog\//.test(post.contentHtml)) {
      const urls = [
        ...new Set(
          [...post.contentHtml.matchAll(/https?:\/\/[^"'>\s]+\/api\/v1\/media\/blog\/[^"'>\s]+/g)].map(
            (m) => m[0],
          ),
        ),
      ];
      if (urls.length === 0) continue;

      console.log('inline', String(post._id), urls.length, 'urls');
      inline += urls.length;
      if (!apply) continue;

      let html = post.contentHtml;
      let jsonText =
        post.contentJson != null ? JSON.stringify(post.contentJson) : null;
      const replacements = new Map<string, string>();

      for (const oldUrl of urls) {
        const fileName = legacyBlogFileName(oldUrl);
        if (!fileName) {
          console.log('MISSING inline url', oldUrl);
          missing += 1;
          continue;
        }
        const diskPath = path.resolve(process.cwd(), 'uploads', 'blog', fileName);
        try {
          const buffer = await fs.readFile(diskPath);
          const key = mediaKey('blogInline', 'webp');
          const stored = await storage.upload({
            buffer,
            mimeType: 'image/webp',
            key,
            access: 'public',
            cacheControl: 'public, max-age=31536000, immutable',
          });
          replacements.set(oldUrl, stored.url);
          console.log('  uploaded', stored.key);
        } catch {
          console.log('MISSING inline file', fileName);
          missing += 1;
        }
      }

      for (const [from, to] of replacements) {
        html = html.split(from).join(to);
        if (jsonText) jsonText = jsonText.split(from).join(to);
      }

      await BlogPostModel.updateOne(
        { _id: post._id, contentHtml: post.contentHtml },
        {
          $set: {
            contentHtml: html,
            ...(jsonText != null
              ? { contentJson: JSON.parse(jsonText) }
              : {}),
          },
        },
      );
    }
  }

  console.log('totals', { photos, covers, inline, missing });
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
