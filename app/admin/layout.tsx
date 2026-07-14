/* Admin layout — no Navbar, no Footer, full viewport */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ isolation: 'isolate' }}>{children}</div>;
}
