import { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Download, Filter, Search, ChevronLeft, ChevronRight, Star, Calendar, Database, User } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

// Mock data for all datasets
const MOCK_DATASETS: Record<string, any> = {
    // My Datasets (1-100)
    "1": { title: "Customer Support Logs Q4", desc: "Logs from Q4 customer support interactions.", author: "Me", price: "Private", rating: 4.5, category: "Support", created: "2 days ago", size: "4.2 MB", type: "JSON" },
    "2": { title: "Product Reviews 2023", desc: "Aggregated product reviews from 2023.", author: "Me", price: "Private", rating: 4.2, category: "Reviews", created: "1 week ago", size: "15.8 MB", type: "CSV" },
    "3": { title: "Legal Document Corpus", desc: "Collection of legal documents for analysis.", author: "Me", price: "Private", rating: 4.8, category: "Legal", created: "2 weeks ago", size: "128 MB", type: "PDF" },
    "4": { title: "Medical QA Pairs", desc: "Question-answer pairs from medical forums.", author: "Me", price: "Private", rating: 4.7, category: "Medical", created: "3 weeks ago", size: "2.1 MB", type: "JSON" },
    "5": { title: "Code Snippets (Python)", desc: "Python code snippets for training.", author: "Me", price: "Private", rating: 4.6, category: "Code", created: "1 month ago", size: "8.4 MB", type: "TXT" },
    "6": { title: "Red Teaming Prompts", desc: "Prompts designed for red teaming models.", author: "Me", price: "Private", rating: 4.9, category: "Security", created: "1 day ago", size: "1.5 MB", type: "Security" },
    "7": { title: "GDPR Compliance Set", desc: "Data set for GDPR compliance testing.", author: "Me", price: "Private", rating: 4.5, category: "Compliance", created: "3 days ago", size: "500 KB", type: "Compliance" },

    // Marketplace Datasets (201-300)
    "201": { title: "Common Crawl Subset", desc: "A curated subset of web crawl data for general language modeling.", author: "OpenData", price: "Free", rating: 4.8, category: "Benchmarking", created: "2023-01-15", size: "50 GB", type: "JSON" },
    "202": { title: "Medical Dialogues", desc: "Doctor-patient conversations annotated with medical entities.", author: "MedCorp", price: "$49", rating: 4.9, category: "Healthcare", created: "2023-03-10", size: "2.5 GB", type: "JSON" },
    "203": { title: "StackOverflow Code", desc: "High-quality code snippets with accepted answers.", author: "DevCommunity", price: "Free", rating: 4.7, category: "Education", created: "2023-02-20", size: "15 GB", type: "XML" },
    "204": { title: "Financial News Sentiment", desc: "Headlines labeled with sentiment for market analysis.", author: "FinTech AI", price: "$199", rating: 4.6, category: "Finance", created: "2023-04-05", size: "1.2 GB", type: "JSON" },
    "205": { title: "Legal Case Summaries", desc: "Summarized court cases for legal NLP tasks.", author: "LegalTech", price: "$99", rating: 4.5, category: "Legal", created: "2023-05-12", size: "850 MB", type: "CSV" },
    "206": { title: "Customer Support Emails", desc: "Anonymized support threads for intent classification.", author: "SupportAI", price: "Free", rating: 4.4, category: "Benchmarking", created: "2023-06-01", size: "5 GB", type: "JSON" },

    // My Purchases (101-200)
    "101": { title: "Financial News Sentiment", desc: "Headlines labeled with sentiment for market analysis.", author: "FinTech AI", price: "$199", rating: 4.6, category: "Finance", created: "2023-10-15", size: "1.2 GB", type: "JSON" },
    "102": { title: "Legal Case Summaries", desc: "Summarized court cases for legal NLP tasks.", author: "LegalTech", price: "$99", rating: 4.5, category: "Legal", created: "2023-11-02", size: "850 MB", type: "CSV" },
    "103": { title: "Medical Imaging Dataset", desc: "Annotated X-rays and MRI scans for diagnostic AI.", author: "MedAI Labs", price: "$299", rating: 4.9, category: "Healthcare", created: "2023-12-10", size: "45 GB", type: "DICOM" }
};

const DatasetDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Fallback to location state if ID not found in mock (though it should be)
    const datasetInfo = MOCK_DATASETS[id || ""] || {
        title: location.state?.datasetName || `Dataset ${id}`,
        desc: "Description not available.",
        author: "Unknown",
        price: "Unknown",
        rating: 0,
        category: "Unknown",
        created: "Unknown",
        size: "Unknown",
        type: "Unknown"
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Generate mock prompts based on category/type
    const prompts = useMemo(() => {
        const category = datasetInfo.category || "General";
        const count = 50;
        return Array.from({ length: count }, (_, i) => {
            let promptText = "";
            let completionText = "";

            if (category === "Healthcare" || category === "Medical") {
                promptText = `Patient presents with symptoms of ${['headache', 'fever', 'nausea', 'fatigue'][i % 4]}. Diagnosis?`;
                completionText = `Possible conditions include ${['migraine', 'flu', 'food poisoning', 'anemia'][i % 4]}. Recommend further tests.`;
            } else if (category === "Finance") {
                promptText = `Analyze the sentiment of this headline: "${['Market crashes', 'Stocks soar', 'Inflation rises', 'Tech boom'][i % 4]} due to recent events."`;
                completionText = `Sentiment: ${['Negative', 'Positive', 'Negative', 'Positive'][i % 4]}. Confidence: ${(0.8 + Math.random() * 0.2).toFixed(2)}.`;
            } else if (category === "Legal") {
                promptText = `Summarize the precedent set by case ${1000 + i} regarding ${['contract law', 'intellectual property', 'torts', 'criminal liability'][i % 4]}.`;
                completionText = `The court ruled that ${['contracts must be explicit', 'copyright applies to software', 'negligence requires duty of care', 'intent is key'][i % 4]}...`;
            } else if (category === "Code") {
                promptText = `Write a Python function to ${['sort a list', 'calculate fibonacci', 'parse JSON', 'connect to DB'][i % 4]}.`;
                completionText = `def ${['sort_list', 'fib', 'parse_json', 'db_connect'][i % 4]}(args):\n    # Implementation...`;
            } else {
                promptText = `Explain ${['quantum entanglement', 'machine learning', 'photosynthesis', 'blockchain'][i % 4]} to a ${['child', 'student', 'expert'][i % 3]}.`;
                completionText = `Here is an explanation: ${['Imagine two magic dice...', 'Computers learning from data...', 'Plants using sunlight...', 'A secure digital ledger...'][i % 4]}`;
            }

            return {
                id: `P-${1000 + i}`,
                prompt: promptText,
                completion: completionText,
                complexity: ['L0', 'L1', 'L2'][i % 3],
                category: category,
                created: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleDateString()
            };
        });
    }, [datasetInfo.category]);

    const totalPages = Math.ceil(prompts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPrompts = prompts.slice(startIndex, startIndex + itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">{datasetInfo.title}</h1>
                            <Badge variant="outline">{datasetInfo.category}</Badge>
                            {datasetInfo.price !== "Private" && (
                                <Badge variant={datasetInfo.price === "Free" ? "secondary" : "default"}>
                                    {datasetInfo.price}
                                </Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground mt-1">{datasetInfo.desc}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                        <Button>Add Prompt</Button>
                    </div>
                </div>

                {/* Metadata Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-card p-4 rounded-lg border flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                            <User className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Author</p>
                            <p className="font-medium text-sm">{datasetInfo.author}</p>
                        </div>
                    </div>
                    <div className="bg-card p-4 rounded-lg border flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/10 rounded-full text-yellow-500">
                            <Star className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Rating</p>
                            <p className="font-medium text-sm">{datasetInfo.rating} / 5.0</p>
                        </div>
                    </div>
                    <div className="bg-card p-4 rounded-lg border flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-full text-blue-500">
                            <Database className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Size</p>
                            <p className="font-medium text-sm">{datasetInfo.size}</p>
                        </div>
                    </div>
                    <div className="bg-card p-4 rounded-lg border flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-full text-green-500">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Created</p>
                            <p className="font-medium text-sm">{datasetInfo.created}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Prompts Table Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search prompts..."
                            className="pl-8"
                        />
                    </div>
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </div>

                <div className="border rounded-lg overflow-hidden bg-card">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3 w-1/3">Prompt</th>
                                <th className="px-6 py-3 w-1/3">Completion</th>
                                <th className="px-6 py-3">Complexity</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {currentPrompts.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs">{item.id}</td>
                                    <td className="px-6 py-4">
                                        <p className="line-clamp-2" title={item.prompt}>{item.prompt}</p>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        <p className="line-clamp-2" title={item.completion}>{item.completion}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={item.complexity === 'L2' ? 'destructive' : item.complexity === 'L1' ? 'default' : 'secondary'}>
                                            {item.complexity}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{item.category}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{item.created}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + itemsPerPage, prompts.length)}</strong> of <strong>{prompts.length}</strong> results
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        <div className="text-sm font-medium">
                            Page {currentPage} of {totalPages}
                        </div>
                        <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatasetDetailPage;
