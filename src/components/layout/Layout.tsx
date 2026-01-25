
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
    return (
        <div className="min-h-screen bg-background font-sans antialiased flex">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-64 min-h-screen transition-all duration-300 ease-in-out">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
