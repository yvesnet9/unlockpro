import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UnlockPro — Déblocage téléphone officiel',
  description: 'Débloquez votre téléphone en moins de 24h. Code officiel garanti, remboursement si échec.',
  verification: {
    google: ['yhMz7DCCxqfYK55WmxpZOp35JL1AUID0nx6ku2JKydU', 'ecw-a8F29EDVH6XORvgF4WgbDxEWii_UCtkrAJrA4eY'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
