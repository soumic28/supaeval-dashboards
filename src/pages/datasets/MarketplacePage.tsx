

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Download, Star, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketplacePage = () => {
    const navigate = useNavigate();
    const datasets = [
        { id: 1, title: "Common Crawl Subset", desc: "A curated subset of web crawl data for general language modeling.", price: "Free", rating: 4.8, author: "OpenData", downloads: "12k" },
        { id: 2, title: "Medical Dialogues", desc: "Doctor-patient conversations annotated with medical entities.", price: "$49", rating: 4.9, author: "MedCorp", downloads: "2.3k" },
        { id: 3, title: "StackOverflow Code", desc: "High-quality code snippets with accepted answers.", price: "Free", rating: 4.7, author: "DevCommunity", downloads: "45k" },
        { id: 4, title: "Financial News Sentiment", desc: "Headlines labeled with sentiment for market analysis.", price: "$199", rating: 4.6, author: "FinTech AI", downloads: "800" },
        { id: 5, title: "Legal Case Summaries", desc: "Summarized court cases for legal NLP tasks.", price: "$99", rating: 4.5, author: "LegalTech", downloads: "1.2k" },
        { id: 6, title: "Customer Support Emails", desc: "Anonymized support threads for intent classification.", price: "Free", rating: 4.4, author: "SupportAI", downloads: "5k" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
                    <p className="text-muted-foreground">Explore high-quality datasets from the community.</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-muted p-1 rounded-lg flex">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/datasets/my-datasets')}>Custom</Button>
                        <Button variant="ghost" size="sm" className="bg-background shadow-sm" onClick={() => { }}>Public</Button>
                    </div>
                    <Button variant="outline">My Purchases</Button>
                    <Button>Publish Dataset</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {datasets.map((item) => (
                    <div key={item.id} className="group border rounded-lg overflow-hidden bg-card hover:shadow-md transition-all">
                        <div className="h-40 bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
                            <Database className="w-12 h-12 text-primary/40 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg leading-tight">{item.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">by {item.author}</p>
                                </div>
                                <Badge variant={item.price === 'Free' ? 'secondary' : 'default'}>
                                    {item.price}
                                </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.desc}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                        <span>{item.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Download className="w-4 h-4" />
                                        <span>{item.downloads}</span>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost">View Details</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketplacePage;
