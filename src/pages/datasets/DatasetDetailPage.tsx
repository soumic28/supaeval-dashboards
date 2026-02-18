import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Download, Filter, Search, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/use-toast';
import { TraceDetailModal } from './components/TraceDetailModal';
import { datasetService } from "@/services/datasets";
import { promptService } from "@/services/prompts";

// Mock data for all datasets
const MOCK_DATASETS: Record<string, any> = {
    // My Datasets (1-100)
    "1": {
        title: "Customer Support Logs Q4",
        desc: "Logs from Q4 customer support interactions.",
        author: "Me",
        price: "Private",
        rating: 4.5,
        category: "Support",
        created: "2 days ago",
        size: "4.2 MB",
        type: "JSON",
        insights: { ambiguity: 80, noise: 50, memoryDepth: 70, toolChains: 60 }
    },
    "2": { title: "Product Reviews 2023", desc: "Aggregated product reviews from 2023.", author: "Me", price: "Private", rating: 4.2, category: "Reviews", created: "1 week ago", size: "15.8 MB", type: "CSV", insights: { ambiguity: 65, noise: 40, memoryDepth: 30, toolChains: 20 } },
    "3": { title: "Legal Document Corpus", desc: "Collection of legal documents for analysis.", author: "Me", price: "Private", rating: 4.8, category: "Legal", created: "2 weeks ago", size: "128 MB", type: "PDF", insights: { ambiguity: 90, noise: 20, memoryDepth: 85, toolChains: 10 } },
    "4": { title: "Medical QA Pairs", desc: "Question-answer pairs from medical forums.", author: "Me", price: "Private", rating: 4.7, category: "Medical", created: "3 weeks ago", size: "2.1 MB", type: "JSON", insights: { ambiguity: 40, noise: 60, memoryDepth: 50, toolChains: 30 } },
    "5": { title: "Code Snippets (Python)", desc: "Python code snippets for training.", author: "Me", price: "Private", rating: 4.6, category: "Code", created: "1 month ago", size: "8.4 MB", type: "TXT", insights: { ambiguity: 20, noise: 10, memoryDepth: 40, toolChains: 90 } },
    "6": { title: "Red Teaming Prompts", desc: "Prompts designed for red teaming models.", author: "Me", price: "Private", rating: 4.9, category: "Security", created: "1 day ago", size: "1.5 MB", type: "Security", insights: { ambiguity: 95, noise: 80, memoryDepth: 60, toolChains: 70 } },
    "7": { title: "GDPR Compliance Set", desc: "Data set for GDPR compliance testing.", author: "Me", price: "Private", rating: 4.5, category: "Compliance", created: "3 days ago", size: "500 KB", type: "Compliance", insights: { ambiguity: 55, noise: 30, memoryDepth: 20, toolChains: 10 } },

    // Marketplace Datasets (201-300)
    "201": { title: "Common Crawl Subset", desc: "A curated subset of web crawl data for general language modeling.", author: "OpenData", price: "Free", rating: 4.8, category: "Benchmarking", created: "2023-01-15", size: "50 GB", type: "JSON", insights: { ambiguity: 75, noise: 85, memoryDepth: 40, toolChains: 0 } },
    // ... maps to defaults for others if needed
};

const InsightBar = ({ label, value }: { label: string, value: number }) => (
    <div className="grid grid-cols-[120px_1fr_50px] items-center gap-4">
        <div className="font-medium text-sm text-muted-foreground text-right">{label}</div>
        <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
            <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${value}%` }}
            />
        </div>
        <div className="text-sm font-medium text-right">{value}%</div>
    </div>
);

const DatasetDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();


    // State for data
    const [datasetInfo, setDatasetInfo] = useState<any>(null);
    const [prompts, setPrompts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const insights = datasetInfo?.insights || { ambiguity: 50, noise: 50, memoryDepth: 50, toolChains: 50 };

    // Helper for Mock Gen
    const generateMockPrompts = (datasetId: string, category: string) => {
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
                dataset_id: datasetId,
                prompt_text: promptText,
                prompt: promptText, // UI Mapping
                prompt_type: "completion",
                human_reviewed: Math.random() > 0.7,
                reviewed: Math.random() > 0.7, // UI Mapping
                healthy: true,
                expected_output: completionText,
                completion: completionText, // UI Mapping
                prompt_complexity: ['L0', 'L1', 'L2'][i % 3],
                complexity: ['L0', 'L1', 'L2'][i % 3], // UI Mapping
                category: category,
                created_at: new Date().toISOString(),
                created: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleDateString(),
                updated_at: new Date().toISOString()
            };
        });
    };

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                // Services imported statically
                // const { datasetService } = await import("@/services/datasets");
                // const { promptService } = await import("@/services/prompts");

                // Check if ID is a UUID (Real API)
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

                // 1. Load Base Mock for Fallback/Demo
                let currentDs = MOCK_DATASETS[id] || MOCK_DATASETS["1"];
                let currentPrompts: any[] = [];

                if (isUuid) {
                    try {
                        // 2. Try Fetching Real Dataset
                        const apiDs = await datasetService.getOne(id);
                        if (apiDs) {
                            // Merge API data into Mock data structure
                            currentDs = {
                                ...currentDs, // Preserves visual fields (insights, rating, etc.)
                                ...apiDs,     // Overwrites core fields (name, id, etc.)
                                title: apiDs.name,
                                desc: apiDs.description,
                                // Maintain Mock Category if API doesn't have one, or map it
                                category: apiDs.category || currentDs.category,
                                type: apiDs.type || currentDs.type,
                            };
                        }

                        // 3. Try Fetching Real Prompts
                        const apiPrompts = await promptService.getAll(id);
                        if (apiPrompts && Array.isArray(apiPrompts) && apiPrompts.length > 0) {
                            currentPrompts = apiPrompts.map(p => ({
                                ...p,
                                // Map API fields to UI fields
                                prompt: p.prompt_text,
                                completion: p.expected_output || "N/A",
                                complexity: p.prompt_complexity || "L0",
                                category: currentDs.category || "General", // UI category
                                reviewed: p.human_reviewed,
                                created: new Date(p.created_at).toLocaleDateString()
                            }));
                        } else {
                            // Fallback if API returns empty list (but success)
                            // console.warn("API returned 0 prompts, showing empty list.");
                            // currentPrompts = []; // Explicitly empty for real datasets
                        }

                    } catch (err) {
                        console.warn("API Fetch Failed (Dataset/Prompts), using Full Mock Fallback", err);
                        // Fallback completely to Mocks
                        currentPrompts = generateMockPrompts(id, currentDs.category || "General");
                    }
                } else {
                    // Non-UUID: purely mock/demo mode
                    currentPrompts = generateMockPrompts(id, currentDs.category || "General");
                }

                setDatasetInfo(currentDs);
                setPrompts(currentPrompts);

            } catch (error) {
                console.error("Critical Failure loading dataset details", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Refetch prompts from API
    const refetchPrompts = async () => {
        if (!id) return;
        try {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
            if (isUuid) {
                const apiPrompts = await promptService.getAll(id);
                if (apiPrompts && Array.isArray(apiPrompts) && apiPrompts.length > 0) {
                    const mappedPrompts = apiPrompts.map(p => ({
                        ...p,
                        prompt: p.prompt_text,
                        completion: p.expected_output || "N/A",
                        complexity: p.prompt_complexity || "L0",
                        category: datasetInfo?.category || "General",
                        reviewed: p.human_reviewed,
                        created: new Date(p.created_at).toLocaleDateString()
                    }));
                    setPrompts(mappedPrompts);
                }
            }
        } catch (error) {
            console.error("Failed to refetch prompts", error);
        }
    };

    const [editingPrompt, setEditingPrompt] = useState<any>(null);
    const [deletingPromptId, setDeletingPromptId] = useState<string | null>(null);
    const [reviewingPrompt, setReviewingPrompt] = useState<any>(null);
    const [isEditPromptOpen, setIsEditPromptOpen] = useState(false);
    const [isDeletePromptOpen, setIsDeletePromptOpen] = useState(false);
    const [isReviewPromptOpen, setIsReviewPromptOpen] = useState(false);

    const [newPrompt, setNewPrompt] = useState({ prompt: "", completion: "", complexity: "L0", category: "General" });
    const [isAddPromptOpen, setIsAddPromptOpen] = useState(false);

    // Trace View State
    const [viewingTraceId, setViewingTraceId] = useState<string | null>(null);

    // Filter prompts logic would need to apply to state `prompts` now

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    const handleEditClick = (prompt: any) => {
        setEditingPrompt({ ...prompt });
        setIsEditPromptOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeletingPromptId(id);
        setIsDeletePromptOpen(true);
    };

    const handleReviewClick = (prompt: any) => {
        setReviewingPrompt({ ...prompt });
        setIsReviewPromptOpen(true);
    };

    const savePromptEdit = async () => {
        if (editingPrompt) {
            try {
                // Check if real prompt (UUID) or force try - removing length check to ensure we hit API
                const isReal = typeof editingPrompt.id === 'string'; // && editingPrompt.id.length > 10;

                if (isReal) {
                    console.log("Updating prompt:", editingPrompt.id, {
                        human_reviewed: editingPrompt.reviewed,
                        prompt_text: editingPrompt.prompt,
                        expected_output: editingPrompt.completion,
                        prompt_complexity: editingPrompt.complexity
                    });

                    await promptService.update(editingPrompt.id, {
                        prompt_text: editingPrompt.prompt,
                        expected_output: editingPrompt.completion,
                        prompt_complexity: editingPrompt.complexity,
                        human_reviewed: editingPrompt.reviewed,
                    });

                    console.log("Update successful, refetching prompts...");

                    // Refetch prompts to get the latest data from backend
                    await refetchPrompts();

                    toast({
                        title: "Prompt Updated",
                        description: "Changes saved successfully.",
                    });
                } else {
                    // Mock update - just update local state
                    setPrompts(prompts.map(p => p.id === editingPrompt.id ? editingPrompt : p));
                }

                setIsEditPromptOpen(false);
                setEditingPrompt(null);
            } catch (error) {
                console.error("Failed to update prompt", error);
                toast({
                    title: "Update Failed",
                    description: "Failed to save changes. Check console for details.",
                    variant: "destructive"
                });
            }
        }
    };

    const confirmDeletePrompt = async () => {
        if (!deletingPromptId) {
            console.error("❌ deletingPromptId is missing/null in confirmDeletePrompt");
            return;
        }

        try {
            console.log(`[Delete Prompt] Deleting ID: ${deletingPromptId}`);
            // Always attempt API delete, let backend handle 404 if not found
            await promptService.delete(deletingPromptId);
            console.log("[Delete Prompt] API success");

            setPrompts(prompts.filter(p => p.id !== deletingPromptId));
            setIsDeletePromptOpen(false);
            setDeletingPromptId(null);

            toast({
                title: "Prompt Deleted",
                description: "Successfully deleted prompt.",
            });

        } catch (error) {
            console.error("Failed to delete prompt", error);
            // If it's a 404, maybe we should still remove it locally?
            // For now, let's assume if it fails, we keep it, or warn user.
            alert("Failed to delete prompt. Please check the console for details.");
        }
    };

    const markAsReviewed = async () => {
        if (reviewingPrompt) {
            try {
                const isReal = typeof reviewingPrompt.id === 'string';

                if (isReal) {
                    // Update via API
                    await promptService.update(reviewingPrompt.id, {
                        human_reviewed: true,
                    });

                    console.log("Marked as reviewed, refetching prompts...");

                    // Refetch prompts to get the latest data from backend
                    await refetchPrompts();

                    toast({
                        title: "Prompt Reviewed",
                        description: "Prompt marked as humanly reviewed.",
                    });
                } else {
                    // Mock update - just update local state
                    setPrompts(prompts.map(p => p.id === reviewingPrompt.id ? { ...p, reviewed: true } : p));
                }

                setIsReviewPromptOpen(false);
                setReviewingPrompt(null);
            } catch (error) {
                console.error("Failed to mark as reviewed", error);
                toast({
                    title: "Review Failed",
                    description: "Failed to mark prompt as reviewed.",
                    variant: "destructive"
                });
            }
        }
    };

    const handleAddPrompt = async () => {
        const tempId = `P-${Date.now()}`;

        // Optimistic UI
        const promptToAdd = {
            id: tempId,
            ...newPrompt,
            created: new Date().toLocaleDateString(),
            reviewed: false,
            prompt_text: newPrompt.prompt,
            expected_output: newPrompt.completion,
            human_reviewed: false,
            dataset_id: id || "temp",
            complexity: newPrompt.complexity,
            category: newPrompt.category
        };

        try {
            // Try API creation
            if (id && id.length > 10) { // Real dataset
                const created = await promptService.create({
                    dataset_id: id,
                    prompt_text: newPrompt.prompt,
                    expected_output: newPrompt.completion,
                    prompt_complexity: newPrompt.complexity as any,
                    prompt_type: "completion"
                });
                // API returns array?
                if (Array.isArray(created) && created.length > 0) {
                    const real = created[0];
                    // Replace temp with real
                    promptToAdd.id = real.id;
                    promptToAdd.created = new Date(real.created_at).toLocaleDateString();
                } else if (!Array.isArray(created) && (created as any).id) {
                    const real = created as any;
                    promptToAdd.id = real.id;
                    promptToAdd.created = new Date(real.created_at).toLocaleDateString();
                }
            }
        } catch (error) {
            console.error("Failed to create prompt on API", error);
            // Fallback to local only (already there)
        }

        setPrompts([promptToAdd, ...prompts]);
        setIsAddPromptOpen(false);
        setNewPrompt({ prompt: "", completion: "", complexity: "L0", category: "General" });
    };


    if (isLoading || !datasetInfo) {
        return <div className="p-10 flex justify-center">Loading...</div>;
    }

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto">
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
                        <Button variant="outline" size="icon" title="Edit Dataset">
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" title="Delete Dataset" className="hover:text-red-600 hover:border-red-200 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                        <Button onClick={() => setIsAddPromptOpen(true)}>Add Prompt</Button>
                    </div>
                </div>

                {/* Insights Section */}
                <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-6 tracking-tight">Dataset Insights</h3>
                    <div className="max-w-md space-y-4">
                        <InsightBar label="Ambiguity" value={insights.ambiguity} />
                        <InsightBar label="Noise" value={insights.noise} />
                        <InsightBar label="Memory Depth" value={insights.memoryDepth} />
                        <InsightBar label="Tool Chains" value={insights.toolChains} />
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
                                <th className="px-6 py-3 w-1/4">Prompt</th>
                                <th className="px-6 py-3 w-1/4">Completion</th>
                                <th className="px-6 py-3">Complexity</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3 text-center">Humanly Reviewed</th>
                                <th className="px-6 py-3">Created</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {currentPrompts.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => setViewingTraceId(item.id)}
                                >
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
                                    <td className="px-6 py-4 text-center">
                                        {item.reviewed ? (
                                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{item.created}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="flex justify-end gap-1 border-r pr-3 mr-1 border-border/50">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={(e) => { e.stopPropagation(); handleReviewClick(item); }}
                                                    title="Review Prompt"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8"
                                                    onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteClick(item.id); }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                                        </div>
                                    </td>
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

            {/* Edit Prompt Modal */}
            {isEditPromptOpen && editingPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-lg border rounded-lg shadow-lg p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Edit Prompt</h2>
                            <div className="flex items-center space-x-2">
                                <label htmlFor="human-verified" className="text-sm font-medium cursor-pointer select-none">
                                    Human Verified
                                </label>
                                <button
                                    id="human-verified"
                                    onClick={() => setEditingPrompt({ ...editingPrompt, reviewed: !editingPrompt.reviewed })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${editingPrompt.reviewed ? 'bg-green-600' : 'bg-input'
                                        }`}
                                >
                                    <span
                                        className={`${editingPrompt.reviewed ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block h-4 w-4 transform rounded-full bg-background transition-transform`}
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Prompt Text</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={editingPrompt.prompt}
                                    onChange={(e) => setEditingPrompt({ ...editingPrompt, prompt: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Completion</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={editingPrompt.completion}
                                    onChange={(e) => setEditingPrompt({ ...editingPrompt, completion: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Complexity</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={editingPrompt.complexity}
                                        onChange={(e) => setEditingPrompt({ ...editingPrompt, complexity: e.target.value })}
                                    >
                                        <option value="L0">L0</option>
                                        <option value="L1">L1</option>
                                        <option value="L2">L2</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <Input
                                        value={editingPrompt.category}
                                        onChange={(e) => setEditingPrompt({ ...editingPrompt, category: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsEditPromptOpen(false)}>Cancel</Button>
                            <Button onClick={savePromptEdit}>Save Changes</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Prompt Modal */}
            {isAddPromptOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-lg border rounded-lg shadow-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Add New Prompt</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Prompt Text</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newPrompt.prompt}
                                    onChange={(e) => setNewPrompt({ ...newPrompt, prompt: e.target.value })}
                                    placeholder="Enter prompt text here..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Completion</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newPrompt.completion}
                                    onChange={(e) => setNewPrompt({ ...newPrompt, completion: e.target.value })}
                                    placeholder="Enter expected completion..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Complexity</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={newPrompt.complexity}
                                        onChange={(e) => setNewPrompt({ ...newPrompt, complexity: e.target.value })}
                                    >
                                        <option value="L0">L0</option>
                                        <option value="L1">L1</option>
                                        <option value="L2">L2</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <Input
                                        value={newPrompt.category}
                                        onChange={(e) => setNewPrompt({ ...newPrompt, category: e.target.value })}
                                        placeholder="e.g. Healthcare"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsAddPromptOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddPrompt}>Add Prompt</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Human Review Modal */}
            {isReviewPromptOpen && reviewingPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-2xl border rounded-lg shadow-lg flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-semibold">Human Review</h2>
                            <p className="text-sm text-muted-foreground">Review the prompt and completion for quality and accuracy.</p>
                        </div>

                        <div className="p-6 space-y-6 overflow-y-auto flex-1">
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Prompt</h3>
                                <div className="p-4 bg-muted/30 rounded-lg border text-sm leading-relaxed">
                                    {reviewingPrompt.prompt}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Completion</h3>
                                <div className="p-4 bg-muted/30 rounded-lg border text-sm leading-relaxed">
                                    {reviewingPrompt.completion}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 border rounded bg-card">
                                    <span className="text-xs text-muted-foreground block mb-1">Complexity</span>
                                    <Badge variant="outline">{reviewingPrompt.complexity}</Badge>
                                </div>
                                <div className="p-3 border rounded bg-card">
                                    <span className="text-xs text-muted-foreground block mb-1">Category</span>
                                    <span className="font-medium text-sm">{reviewingPrompt.category}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t bg-muted/10 flex justify-between items-center">
                            <Button variant="outline" onClick={() => setIsReviewPromptOpen(false)}>Close</Button>
                            <div className="flex gap-2">
                                <Button variant="destructive" onClick={() => setIsReviewPromptOpen(false)}>Reject</Button>
                                <Button onClick={markAsReviewed} className="bg-green-600 hover:bg-green-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polyline points="20 6 9 17 4 12" /></svg>
                                    Approve & Mark Humanly Reviewed
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Prompt Confirmation Modal */}
            {isDeletePromptOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-md border rounded-lg shadow-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Delete Prompt</h2>
                        <p className="text-muted-foreground">Are you sure you want to delete this prompt? This action cannot be undone.</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDeletePromptOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={confirmDeletePrompt}>Delete</Button>
                        </div>
                    </div>
                </div>
            )}

            <TraceDetailModal
                isOpen={!!viewingTraceId}
                onClose={() => setViewingTraceId(null)}
                promptId={viewingTraceId}
            />
        </div>
    );
};

export default DatasetDetailPage;
