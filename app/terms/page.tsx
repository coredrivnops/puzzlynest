import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service - PuzzlyNest',
    description: 'Terms of Service for PuzzlyNest. Rules and guidelines for using our gaming platform.',
};

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
                <h1 className="text-3xl font-bold mb-8 text-indigo-400">Terms of Service</h1>

                <div className="space-y-6 text-slate-300">
                    <p className="text-sm text-slate-400">Last Updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-white">1. Agreement to Terms</h2>
                        <p>By accessing or using PuzzlyNest, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not access the service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-white">2. Use License</h2>
                        <p>Permission is granted to temporarily access the materials (games and content) on PuzzlyNest's website for personal, non-commercial transitory viewing only.</p>
                        <p className="mt-2">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Modify or copy the materials;</li>
                            <li>Use the materials for any commercial purpose;</li>
                            <li>Attempt to decompile or reverse engineer any software contained on PuzzlyNest's website;</li>
                            <li>Remove any copyright or other proprietary notations from the materials.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-white">3. Disclaimer</h2>
                        <p>The materials on PuzzlyNest's website are provided on an 'as is' basis. PuzzlyNest makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-white">4. Limitations</h2>
                        <p>In no event shall PuzzlyNest or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on PuzzlyNest's website.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-white">5. Governing Law</h2>
                        <p>These terms and conditions are governed by and construed in accordance with applicable laws. You agree that any disputes will be resolved in accordance with the laws of the jurisdiction in which the website operator resides.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-white">6. Contact Info</h2>
                        <p>If you have any questions about these Terms, please contact us at:</p>
                        <p className="mt-2">Email: <a href="mailto:hello@puzzlynest.com" className="text-indigo-400 hover:underline">hello@puzzlynest.com</a></p>
                    </section>
                </div>
            </div>
        </div>
    );
}
