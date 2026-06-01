import { AuthProvider } from '@/lib/AuthContext';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import './globals.css';

export const metadata = {
  title: 'AyurBreath AI',
  description: 'AI-Based Personalized Ayurvedic Lifestyle Framework for Asthma Patients',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="app-global-wrapper">
            <Sidebar />
            <div className="app-main-content">
              <Navbar />
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
