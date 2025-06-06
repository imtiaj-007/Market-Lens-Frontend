import React from 'react'
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet, FileText, FileJson, FileCheck2 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { colorMap } from '@/types/upload';
import { cn } from '@/lib/utils';
import { FileType } from '@/types/enum';


const SupportedFormats: React.FC = () => {

    const productData = [
        { id: 'PROD_001', name: 'Smart TV', category: 'Electronics', price: 17000 },
        { id: 'PROD_002', name: 'Smart Phone', category: 'Electronics', price: 14000 },
        { id: 'PROD_003', name: 'Smart Watch', category: 'Electronics', price: 4000 }
    ];

    const salesData = [
        { id: 'TXN_001', cust_id: 'CUST_001', prod_id: 'PROD_001', date: '2024-01-01' },
        { id: 'TXN_002', cust_id: 'CUST_002', prod_id: 'PROD_002', date: '2024-01-02' },
        { id: 'TXN_003', cust_id: 'CUST_003', prod_id: 'PROD_003', date: '2024-01-03' }
    ];

    return (
        <motion.div
            className="mt-8 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
        >
            <div className="file-support space-y-6">
                <div className="flex items-center gap-2">
                    <FileCheck2 className="size-6 text-purple-500" />
                    <h3 className="text-lg font-medium">Supported File Formats & Requirements</h3>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className={cn("border-2", colorMap[FileType.SALES_DATA]?.border)}>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileSpreadsheet className="size-6 text-green-500" />
                                CSV Files
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="text-muted-foreground">Comma-separated values with headers in first row</p>
                            <Table className='text-xs'>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Prod_id</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                {productData.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className={cn("border-2", colorMap[FileType.CUSTOMER_DATA]?.border)}>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="size-6 text-blue-500" />
                                Excel Files
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="text-muted-foreground">.xlsx or .xls with single sheet and header row</p>
                            <Table className='text-xs'>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Txn_id</TableHead>
                                        <TableHead>Cust_id</TableHead>
                                        <TableHead>Prod_id</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                {salesData.map((sale) => (
                                    <TableRow key={sale.id}>
                                        <TableCell>{sale.id}</TableCell>
                                        <TableCell>{sale.cust_id}</TableCell>
                                        <TableCell>{sale.prod_id}</TableCell>
                                        <TableCell>{sale.date}</TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className={cn("border-2", colorMap[FileType.PRODUCT_DATA]?.border)}>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileJson className="size-6 text-purple-500" />
                                JSON Files
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="text-muted-foreground">Array of objects with consistent structure</p>
                            <pre className="rounded-md bg-muted p-4 text-xs">
                                {`[
    {
        "id": "CUST_001",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "purchases": 12
    }
]`}
                            </pre>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    )
}

export default SupportedFormats;
