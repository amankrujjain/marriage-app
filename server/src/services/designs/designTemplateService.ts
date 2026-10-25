import { NotFoundError } from '../../errors/NotFoundError';
import { BadRequestError } from '../../errors/BadRequestError';
import { DesignTemplateConfigModel } from '../../models/DesignTemplateConfig';
import { DESIGN_TEMPLATE_DEFAULTS } from './designTemplateDefaults';

const CATS = new Set(['Traditional', 'Royal', 'Floral', 'Modern']);
const TIERS = new Set(['Free', 'Premium']);
const FAITHS = new Set(['Hindu', 'Muslim', 'Sikh', 'Christian']);

export async function ensureDesignTemplatesSeeded(): Promise<void> {
  const count = await DesignTemplateConfigModel.countDocuments();
  if (count > 0) {
    // Upsert any new defaults that appear later without overwriting admin edits.
    for (const d of DESIGN_TEMPLATE_DEFAULTS) {
      await DesignTemplateConfigModel.updateOne(
        { slug: d.slug },
        {
          $setOnInsert: {
            name: d.name,
            tier: d.tier,
            cat: d.cat,
            faith: d.faith,
            blurb: d.blurb,
            active: d.active,
          },
        },
        { upsert: true },
      );
    }
    return;
  }

  await DesignTemplateConfigModel.insertMany(
    DESIGN_TEMPLATE_DEFAULTS.map((d) => ({ ...d })),
    { ordered: false },
  );
}

function toPublic(doc: {
  slug: string;
  name: string;
  tier: string;
  cat: string;
  faith: string[];
  blurb: string;
  active: boolean;
  updatedAt?: Date;
}) {
  return {
    slug: doc.slug,
    name: doc.name,
    tier: doc.tier as 'Free' | 'Premium',
    cat: doc.cat as 'Traditional' | 'Royal' | 'Floral' | 'Modern',
    faith: doc.faith ?? [],
    blurb: doc.blurb ?? '',
    active: Boolean(doc.active),
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : null,
  };
}

/** Public catalog: active templates only (for gallery / editor). */
export async function listPublicDesignTemplates() {
  await ensureDesignTemplatesSeeded();
  const items = await DesignTemplateConfigModel.find({ active: true })
    .sort({ name: 1 })
    .lean();
  return { items: items.map(toPublic) };
}

/** Admin catalog: all templates. */
export async function listAdminDesignTemplates() {
  await ensureDesignTemplatesSeeded();
  const items = await DesignTemplateConfigModel.find().sort({ name: 1 }).lean();
  return { items: items.map(toPublic) };
}

export async function updateAdminDesignTemplate(
  slug: string,
  input: {
    tier?: string;
    cat?: string;
    active?: boolean;
    name?: string;
    blurb?: string;
    faith?: string[];
  },
) {
  await ensureDesignTemplatesSeeded();
  const existing = await DesignTemplateConfigModel.findOne({ slug });
  if (!existing) {
    throw new NotFoundError('Template not found', 'TEMPLATE_NOT_FOUND');
  }

  if (input.tier !== undefined) {
    if (!TIERS.has(input.tier)) {
      throw new BadRequestError('Invalid tier', 'INVALID_TIER');
    }
    existing.tier = input.tier as 'Free' | 'Premium';
  }
  if (input.cat !== undefined) {
    if (!CATS.has(input.cat)) {
      throw new BadRequestError('Invalid category', 'INVALID_CATEGORY');
    }
    existing.cat = input.cat as 'Traditional' | 'Royal' | 'Floral' | 'Modern';
  }
  if (input.active !== undefined) existing.active = Boolean(input.active);
  if (input.name !== undefined) existing.name = input.name.trim() || existing.name;
  if (input.blurb !== undefined) existing.blurb = input.blurb;
  if (input.faith !== undefined) {
    const faith = [...new Set(input.faith.map((f) => String(f).trim()).filter(Boolean))];
    if (!faith.length || faith.some((f) => !FAITHS.has(f))) {
      throw new BadRequestError('Invalid community', 'INVALID_FAITH');
    }
    existing.faith = faith;
  }

  await existing.save();
  return toPublic(existing);
}
