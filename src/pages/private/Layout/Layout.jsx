import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}