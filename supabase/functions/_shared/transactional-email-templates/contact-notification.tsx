import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  email?: string
  phone?: string
  message?: string
}

const Email = ({ name, email, phone, message }: Props) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Nuevo mensaje de contacto desde el sitio web</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Nuevo mensaje de contacto</Heading>
        <Text style={subtitle}>
          Has recibido una nueva consulta desde franconarettopropiedades.cl
        </Text>
        <Hr style={hr} />
        <Section>
          <Text style={label}>Nombre</Text>
          <Text style={value}>{name || '—'}</Text>

          <Text style={label}>Correo electrónico</Text>
          <Text style={value}>{email || '—'}</Text>

          <Text style={label}>Teléfono</Text>
          <Text style={value}>{phone || '—'}</Text>

          <Text style={label}>Mensaje</Text>
          <Text style={messageStyle}>{message || '—'}</Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          Franco Naretto Propiedades Agrícolas
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Props) =>
    `Nueva consulta de ${data?.name || 'contacto web'}`,
  displayName: 'Notificación de contacto',
  to: 'contacto@franconarettopropiedades.cl',
  previewData: {
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+56 9 1234 5678',
    message: 'Estoy interesado en una parcela en la zona central.',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, Arial, sans-serif',
}
const container = {
  padding: '32px 28px',
  maxWidth: '560px',
  margin: '0 auto',
}
const h1 = {
  color: '#3d5a32',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 8px',
  fontFamily: 'Playfair Display, Georgia, serif',
}
const subtitle = {
  color: '#6b6b6b',
  fontSize: '14px',
  margin: '0',
}
const label = {
  color: '#6b6b6b',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '16px 0 4px',
  fontWeight: '600',
}
const value = {
  color: '#2a2a2a',
  fontSize: '15px',
  margin: '0',
}
const messageStyle = {
  color: '#2a2a2a',
  fontSize: '15px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
  lineHeight: '1.5',
}
const hr = {
  borderColor: '#e5e0d5',
  margin: '24px 0',
}
const footer = {
  color: '#8a8a8a',
  fontSize: '12px',
  textAlign: 'center' as const,
}
