import Header from "./partials/Header";

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <main className="flex-1 max-w-6xl mx-auto w-full md:px-6">
                {children}
            </main>
            <footer className="text-center text-gray-500 text-sm py-4 border-t">
                © {new Date().getFullYear()} MiniBlog — All rights reserved.
            </footer>
        </div>
    );
}
