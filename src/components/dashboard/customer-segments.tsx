'use client';

import { useEffect, useState } from 'react';
import CustomerSegmentsPieChart from './charts/segments-pie-chart';
import RfmBarChart from './charts/rfm-bar-chart';
import RfmScatterPlot3D from './charts/rfm-scatter-plot3D';
import { SegmentData } from '@/types/analytics';

interface CustomerSegmentsProps {
    data: SegmentData | null;
}

const CustomerSegments: React.FC<CustomerSegmentsProps> = ({ data }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    const checkDarkMode = () => {
        if (typeof window !== 'undefined') {
            const isDark = document.documentElement.classList.contains('dark');
            setIsDarkMode(isDark);
        }
    };

    useEffect(() => {
        checkDarkMode();
        if (typeof window !== 'undefined') {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (
                        mutation.attributeName === 'class' &&
                        mutation.target === document.documentElement
                    ) {
                        checkDarkMode();
                    }
                });
            });
            observer.observe(document.documentElement, { attributes: true });
            return () => observer.disconnect();
        }
    }, []);

    return (
        <div className="flex flex-col gap-8">
            <div className="w-full bg-card p-4 rounded-lg shadow">
                <CustomerSegmentsPieChart data={data} isDarkMode={isDarkMode} />
            </div>

            <div className="w-full bg-card p-4 rounded-lg shadow">
                <RfmBarChart data={data} isDarkMode={isDarkMode} />
            </div>

            <div className="w-full bg-card p-4 rounded-lg shadow">
                <RfmScatterPlot3D data={data} isDarkMode={isDarkMode} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
                <div className="p-4 border rounded-md bg-card shadow-sm">
                    <div className="font-medium text-lg mb-2">Recency</div>
                    <div className="text-muted-foreground">How recently a customer made a purchase. Higher scores indicate more recent activity.</div>
                </div>
                <div className="p-4 border rounded-md bg-card shadow-sm">
                    <div className="font-medium text-lg mb-2">Frequency</div>
                    <div className="text-muted-foreground">How often a customer makes purchases. Higher scores indicate more frequent purchases.</div>
                </div>
                <div className="p-4 border rounded-md bg-card shadow-sm">
                    <div className="font-medium text-lg mb-2">Monetary</div>
                    <div className="text-muted-foreground">How much a customer spends. Higher scores indicate higher spending.</div>
                </div>
            </div>

            {data && data.segments && (
                <div className="w-full bg-card p-4 rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Segment</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Count</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Percentage</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Key Characteristics</th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {data.segments.map((segment) => (
                                <tr key={segment.segment_id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-foreground">{segment.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                        {segment.count}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                        {segment.percentage}%
                                    </td>
                                    <td className="px-6 py-4">
                                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                                            {segment.characteristics.map((char, idx) => (
                                                <li key={idx}>{char}</li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CustomerSegments;