import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Download, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

const DatasetDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const datasetName = location.state?.datasetName || `Dataset ${id}`;

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Generate 50 mock prompts
    const allPrompts = Array.from({ length: 50 }, (_, i) => ({
        id: `P-${1000 + i}`,
        prompt: `Explain the concept of ${['quantum entanglement', 'machine learning', 'photosynthesis', 'blockchain', 'relativity'][i % 5]} to a ${['5-year-old', 'high school student', 'PhD candidate'][i % 3]}.`,
        completion: `Here is a simple explanation: ${['Imagine two magic dice...', 'It is a method where computers learn...', 'Plants use sunlight to make food...', 'A digital ledger that is secure...', 'Time and space are linked...'][i % 5]}`,
        complexity: ['L0', 'L1', 'L2'][i % 3],
        category: ['Science', 'Technology', 'Philosophy', 'History'][i % 4],
        created: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleDateString()
    }));

    const totalPages = Math.ceil(allPrompts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPrompts = allPrompts.slice(startIndex, startIndex + itemsPerPage);

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
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/datasets/my-datasets')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{datasetName} Details</h1>
                    <p className="text-muted-foreground">Viewing {allPrompts.length} prompts from this dataset.</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button>Add Prompt</Button>
                </div>
            </div>

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
                    Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + itemsPerPage, allPrompts.length)}</strong> of <strong>{allPrompts.length}</strong> results
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
    );
};

export default DatasetDetailPage;
