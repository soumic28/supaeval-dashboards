import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Download, Star, Database, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyPurchasesPage = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Benchmarking", "Finance", "Healthcare", "Legal", "Education"];

    const purchasedDatasets = [
        {
            id: 101,
            title: "Financial News Sentiment",
            desc: "Headlines labeled with sentiment for market analysis.",
            price: "$199",
            rating: 4.6,
            author: "FinTech AI",
            purchasedDate: "2023-10-15",
            size: "1.2 GB",
            format: "JSON",
            category: "Finance"
        },
        {
            id: 102,
            title: "Legal Case Summaries",
            desc: "Summarized court cases for legal NLP tasks.",
            price: "$99",
            rating: 4.5,
            author: "LegalTech",
            purchasedDate: "2023-11-02",
            size: "850 MB",
            format: "CSV",
            category: "Legal"
        },
        {
            id: 103,
            title: "Medical Imaging Dataset",
            desc: "Annotated X-rays and MRI scans for diagnostic AI.",
            price: "$299",
            rating: 4.9,
            author: "MedAI Labs",
            purchasedDate: "2023-12-10",
            size: "45 GB",
            format: "DICOM",
            category: "Healthcare"
        }
    ];

    const filteredDatasets = selectedCategory === "All"
        ? purchasedDatasets
        : purchasedDatasets.filter(d => d.category === selectedCategory);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Purchases</h1>
                    <p className="text-muted-foreground">Access and manage your purchased datasets.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate('/datasets/marketplace')}>
                        Back to Marketplace
                    </Button>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="whitespace-nowrap rounded-full"
                    >
                        {category}
                    </Button>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredDatasets.map((item) => (
                    <div key={item.id} className="group border rounded-lg overflow-hidden bg-card hover:shadow-md transition-all">
                        <div className="h-40 bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center relative">
                            <Database className="w-12 h-12 text-primary/40 group-hover:scale-110 transition-transform" />
                            <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90">
                                {item.category}
                            </Badge>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg leading-tight">{item.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">by {item.author}</p>
                                </div>
                                <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                                    Purchased
                                </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.desc}
                            </p>

                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground py-2">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{item.purchasedDate}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Database className="w-3 h-3" />
                                    <span>{item.size}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    <span>{item.format}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                    <span>{item.rating}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-border/50">
                                <Button className="flex-1" size="sm">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                                <Button className="flex-1" size="sm" variant="outline" onClick={() => navigate(`/datasets/${item.id}`, { state: { datasetName: item.title } })}>View Details</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyPurchasesPage;
