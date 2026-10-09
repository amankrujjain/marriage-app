import type { ReactElement } from 'react';
import { TemplateId } from '@marriage/shared';
import type { BiodataViewModel } from '../types/viewModel';
import { TraditionalMaroonRenderer } from '../renderers/TraditionalMaroonRenderer';
import { ModernCleanRenderer } from '../renderers/ModernCleanRenderer';
import { ElegantSerifRenderer } from '../renderers/ElegantSerifRenderer';
import { MinimalLineRenderer } from '../renderers/MinimalLineRenderer';
import { RoyalGoldRenderer } from '../renderers/RoyalGoldRenderer';
import { FloralSoftRenderer } from '../renderers/FloralSoftRenderer';

export function renderTemplate(
  templateId: TemplateId,
  model: BiodataViewModel,
): ReactElement {
  switch (templateId) {
    case TemplateId.TRADITIONAL_MAROON:
      return <TraditionalMaroonRenderer model={model} />;
    case TemplateId.MODERN_CLEAN:
      return <ModernCleanRenderer model={model} />;
    case TemplateId.ELEGANT_SERIF:
      return <ElegantSerifRenderer model={model} />;
    case TemplateId.MINIMAL_LINE:
      return <MinimalLineRenderer model={model} />;
    case TemplateId.ROYAL_GOLD:
      return <RoyalGoldRenderer model={model} />;
    case TemplateId.FLORAL_SOFT:
      return <FloralSoftRenderer model={model} />;
    default:
      return <TraditionalMaroonRenderer model={model} />;
  }
}
