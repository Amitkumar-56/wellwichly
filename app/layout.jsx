import './globals.css'

export const metadata = {
  title: 'Wellwichly - Fresh Sandwiches, Every Day',
  description: 'Order fresh and delicious sandwiches online. Fast delivery available. Franchise opportunities available.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

