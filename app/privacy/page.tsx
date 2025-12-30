import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - PuzzlyNest',
    description: 'Privacy Policy for PuzzlyNest. Learn how we protect your data and ensure a safe gaming environment for kids and seniors.',
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
                <h1 className="text-3xl font-bold mb-8 text-indigo-400">Privacy Policy</h1>

                <div className="space-y-6 text-slate-300">
                    <p className="text-sm text-slate-400">Last Updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-white">1. Introduction</h2>
                        <p>Welcome to PuzzlyNest. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-white">2. Children&apos;s Privacy</h2>
                        <p>PuzzlyNest offers games suitable for children. We do not require user accounts and do not knowingly collect personal information directly from children under the age of 13. Our games do not include chat features or external links.</p>
                        <p className="mt-2">Please note that our website uses third-party services (Google Analytics and AdSense) that may use cookies and collect technical data. We recommend parents supervise their children&apos;s online activities. If you are a parent or guardian and have concerns, please contact us.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-white">3. Information We Collect</h2>
                        <p>We collect and process the following data:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Usage Data:</strong> Information about how you use our website, games, and services.</li>
                            <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
                            <li><strong>Cookies:</strong> We use cookies to improve your experience and analyze traffic.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-white">4. How We Use Information</h2>
                        <p>We use your data to:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Provide and improve our games and services.</li>
                            <li>Analyze usage trends to enhance user experience.</li>
                            <li>Serve advertisements (which may be personalized based on your browsing history).</li>
                            <li>Maintain the security of our platform.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-white">5. Third-Party Services</h2>
                        <p>We use trusted third-party services that may collect data:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior.</li>
                            <li><strong>Google AdSense:</strong> To serve advertisements.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-white">6. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                        <p className="mt-2">Email: <a href="mailto:solutions@coredrivn.com" className="text-indigo-400 hover:underline">solutions@coredrivn.com</a></p>
                    </section>
                </div>
            </div>
        </div>
    );
}
