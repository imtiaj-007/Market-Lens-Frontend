'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
    BarChart4, Users, TrendingUp, Upload, Zap,
    AlertTriangle, BarChart, ArrowRight,
    LineChart, Download, Mail, Lightbulb
} from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";


const HomePage: React.FC = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    return (
        <PageLayout>
            {/* Hero Section */}
            <section className="py-8">
                <motion.div
                    className="grid gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                        <motion.div variants={fadeInUp}>
                            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                                Welcome to <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Market Lens</span>
                            </h1>
                            <p className="mt-2 text-muted-foreground">
                                Advanced analytics dashboard for e-commerce businesses
                            </p>
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                            <Button asChild size="lg" className="w-full md:w-auto">
                                <Link href="/upload" className="flex items-center gap-2">
                                    <Upload className="h-4 w-4" />
                                    Upload your data
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Overview Section */}
            <section className="py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold mb-2">Overview</h2>
                    <div className="h-1 w-20 bg-primary rounded-full"></div>
                </motion.div>

                <motion.div
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} >
                        <Card className="h-full border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart4 className="h-5 w-5 text-blue-500" />
                                    Sales Forecasting
                                </CardTitle>
                                <CardDescription>Predict future sales with advanced ML models</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Use Prophet and XGBoost to forecast sales trends with high accuracy.</p>
                                <div className="mt-4 flex justify-end">
                                    <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700">
                                        Learn more <ArrowRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} >
                        <Card className="h-full border-t-4 border-t-purple-500 shadow-sm hover:shadow-md transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-purple-500" />
                                    Customer Segmentation
                                </CardTitle>
                                <CardDescription>Identify customer groups and behavior patterns</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Leverage K-Means clustering to segment customers based on RFM metrics.</p>
                                <div className="mt-4 flex justify-end">
                                    <Button variant="ghost" size="sm" className="text-purple-500 hover:text-purple-700">
                                        Learn more <ArrowRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} >
                        <Card className="h-full border-t-4 border-t-amber-500 shadow-sm hover:shadow-md transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-amber-500" />
                                    Product Trends
                                </CardTitle>
                                <CardDescription>Visualize top-performing products</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Track and analyze product performance over time with interactive charts.</p>
                                <div className="mt-4 flex justify-end">
                                    <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-700">
                                        Learn more <ArrowRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 rounded-xl my-6 p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold mb-2">Key Features</h2>
                    <div className="h-1 w-20 bg-primary rounded-full"></div>
                </motion.div>

                <motion.div
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} className="flex flex-col">
                        <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart className="h-5 w-5 text-primary" />
                                    Interactive Dashboards
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Filter and drill down into your data with intuitive controls.</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} className="flex flex-col">
                        <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-primary" />
                                    What-if Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Model different business scenarios to aid decision making.</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} className="flex flex-col">
                        <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-primary" />
                                    Anomaly Detection
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Automatically flag unusual sales patterns for investigation.</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} className="flex flex-col">
                        <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Upload className="h-5 w-5 text-primary" />
                                    Easy Data Upload
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Upload CSV/XLS/JSON files to start analyzing your data immediately.</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} className="flex flex-col">
                        <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <LineChart className="h-5 w-5 text-primary" />
                                    Trend Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Discover seasonal patterns and long-term market trends.</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} className="flex flex-col">
                        <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Download className="h-5 w-5 text-primary" />
                                    Export & Reporting
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Generate PDF reports and export data in multiple formats.</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} className="flex flex-col">
                        <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-primary" />
                                    Scheduled Alerts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Set up customizable email alerts for important metrics.</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} className="flex flex-col">
                        <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-primary" />
                                    AI Recommendations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Get intelligent insights and action recommendations.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </section>

            {/* Getting Started Section */}
            <section className="py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold mb-2">Getting Started</h2>
                    <div className="h-1 w-20 bg-primary rounded-full"></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
                        <CardHeader>
                            <CardTitle>How to get started</CardTitle>
                            <CardDescription>Follow these simple steps to unlock insights from your data</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-8 md:grid-cols-2">
                                <div>
                                    <ol className="space-y-6 my-4">
                                        {[
                                            {
                                                step: 1,
                                                title: "Upload Your Data",
                                                description: "Click the 'Upload Data' button to upload your e-commerce data in CSV, Excel, or JSON format."
                                            },
                                            {
                                                step: 2,
                                                title: "Choose Analysis",
                                                description: "Select the type of analysis you want to perform (forecasting, segmentation, trend analysis, etc.)"
                                            },
                                            {
                                                step: 3,
                                                title: "Explore Insights",
                                                description: "Interact with your dashboard to discover patterns and insights in your business data."
                                            },
                                            {
                                                step: 4,
                                                title: "Take Action",
                                                description: "Export findings, schedule reports, or implement recommended strategies."
                                            }
                                        ].map((item, i) => (
                                            <motion.li
                                                key={i}
                                                className="flex gap-4 items-start"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.2 }}
                                            >
                                                <div className="flex items-center justify-center bg-primary text-primary-foreground rounded-full h-8 w-8 shrink-0 mt-1">
                                                    {item.step}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-lg">{item.title}</h3>
                                                    <p className="text-muted-foreground">{item.description}</p>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </ol>
                                </div>
                                <div className="flex items-center justify-center">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.7, delay: 0.3 }}
                                        className="bg-gradient-to-br from-primary/10 to-indigo-500/10 p-8 rounded-xl border border-primary/20 w-full max-w-md"
                                    >
                                        <h3 className="text-center font-semibold text-lg mb-4">Ready to transform your business data?</h3>
                                        <div className="text-center">
                                            <Button size="lg" className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90">
                                                <Link href="/upload" className="flex items-center gap-2">
                                                    <Upload className="h-4 w-4" />
                                                    Start Now
                                                </Link>
                                            </Button>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </section>

            {/* Testimonials Section */}
            <section className="py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold mb-2">Success Stories</h2>
                    <div className="h-1 w-20 bg-primary rounded-full"></div>
                </motion.div>

                <motion.div
                    className="grid gap-6 md:grid-cols-3"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    {[
                        {
                            name: "Sarah Johnson",
                            role: "E-commerce Director",
                            company: "Fashion Forward",
                            content: "Market Lens helped us identify seasonal trends and optimize our inventory, resulting in a 27% increase in revenue."
                        },
                        {
                            name: "David Chen",
                            role: "Marketing Manager",
                            company: "Tech Gadgets Inc.",
                            content: "The customer segmentation revolutionized our marketing approach. We've seen a 35% improvement in campaign performance."
                        },
                        {
                            name: "Emma Rodriguez",
                            role: "CEO",
                            company: "Organic Home Goods",
                            content: "The sales forecasting was spot on! We were able to prepare for demand spikes and avoid stockouts during our busiest season."
                        }
                    ].map((testimonial, i) => (
                        <motion.div key={i} variants={fadeInUp} whileHover={{ scale: 1.03 }} >
                            <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300 border-slate-200">
                                <CardHeader>
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gradient-to-br from-primary to-indigo-600 h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{testimonial.name}</CardTitle>
                                            <CardDescription>
                                                {testimonial.role}, {testimonial.company}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="italic">&ldquo;{testimonial.content}&rdquo;</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* CTA Section */}
            <section className="py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="bg-gradient-to-r from-indigo-800 via-indigo-400 to-indigo-600 rounded-xl p-8 text-white text-center"
                >
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your E-commerce Analytics?</h2>
                    <p className="mb-6 max-w-2xl mx-auto">Join hundreds of successful businesses leveraging data-driven insights with Market Lens</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" className="font-semibold">
                            <Link href="/demo">Watch Demo</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                            <Link href="/contact">Contact Sales</Link>
                        </Button>
                    </div>
                </motion.div>
            </section>
        </PageLayout>
    );
};

export default HomePage;