import * as React from 'npm:react@18.3.1'
import { template as contactNotification } from './contact-notification.tsx'

export interface TemplateEntry {
  component: (props: any) => React.ReactElement
  subject: string | ((data: any) => string)
  displayName?: string
  previewData?: Record<string, unknown>
  to?: string | ((data: any) => string)
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'contact-notification': contactNotification,
}
