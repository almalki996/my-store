// src/app/layout.tsx
import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartClient from "@/components/CartClient";
import { Toaster } from 'react-hot-toast';
import WhatsAppButton from "@/components/WhatsAppButton";
import styles from './layout.module.css';

const cairo = Cairo({ subsets: ["arabic"] });

export const metadata = {
    title: "متجري الإلكتروني",
    description: "متجر إلكتروني حديث مبني بـ Next.js و Odoo",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
    return (
        //  v--v   أضف الخاصية هنا   v--v
        <html lang="ar" dir="rtl" suppressHydrationWarning> 
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            try {
                                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                                    document.documentElement.setAttribute('data-theme', 'dark')
                                } else {
                                    document.documentElement.setAttribute('data-theme', 'light')
                                }
                            } catch (_) {}
                        `,
                    }}
                />
            </head>
            <body className={`${cairo.className} ${styles.body}`}>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            document.body.classList.add('preload');
                            window.addEventListener('load', function() {
                                document.body.classList.remove('preload');
                            });
                        `,
                    }}
                />
                <ThemeProvider
                    attribute="data-theme"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange={false}
                >
                    <AuthProvider>
                        <Toaster position="bottom-center" />
                        <WhatsAppButton />
                        <div className={styles.container}>
                            <div className={styles.content}>
                                <Navbar />
                                <main className={styles.main}>{children}</main>
                                <Footer />
                            </div>
                            <CartClient />
                        </div>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}