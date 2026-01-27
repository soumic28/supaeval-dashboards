
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FileText, Database, MoreHorizontal, Plus, Shield, Scale, Gavel, BrainCircuit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

const MyDatasetsPage = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadData, setUploadData] = useState({
        name: '',
        type: 'Security',
        description: '',
        file: null as File | null
    });

    const datasets = [
        { id: 1, name: "Customer Support Logs Q4", type: "JSON", rows: "12,500", size: "4.2 MB", created: "2 days ago", status: "Ready" },
        { id: 2, name: "Product Reviews 2023", type: "CSV", rows: "45,000", size: "15.8 MB", created: "1 week ago", status: "Ready" },
        { id: 3, name: "Legal Document Corpus", type: "PDF", rows: "1,200", size: "128 MB", created: "2 weeks ago", status: "Processing" },
        { id: 4, name: "Medical QA Pairs", type: "JSON", rows: "5,000", size: "2.1 MB", created: "3 weeks ago", status: "Ready" },
        { id: 5, name: "Code Snippets (Python)", type: "TXT", rows: "8,500", size: "8.4 MB", created: "1 month ago", status: "Ready" },
        // Demo of new types
        { id: 6, name: "Red Teaming Prompts", type: "Security", rows: "2,000", size: "1.5 MB", created: "1 day ago", status: "Ready" },
        { id: 7, name: "GDPR Compliance Set", type: "Compliance", rows: "500", size: "500 KB", created: "3 days ago", status: "Ready" },
    ];

    const handleUpload = () => {
        setIsUploadOpen(true);
    };

    const handleUploadSubmit = () => {
        toast({
            title: "Upload Started",
            description: `Uploading ${uploadData.name} as ${uploadData.type}...`,
        });
        setIsUploadOpen(false);
        setUploadData({ name: '', type: 'Security', description: '', file: null });
    };

    const handleMoreOptions = (name: string) => {
        toast({
            title: "Options",
            description: `More options for ${name} are not yet implemented.`,
        });
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'JSON': return <Database className="w-4 h-4" />;
            case 'Security': return <Shield className="w-4 h-4" />;
            case 'Compliance': return <Scale className="w-4 h-4" />;
            case 'Governance': return <Gavel className="w-4 h-4" />;
            case 'Prompt Reasoning Complexity L0':
            case 'Prompt Reasoning Complexity L1':
            case 'Prompt Reasoning Complexity L2': return <BrainCircuit className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Datasets</h1>
                    <p className="text-muted-foreground">Manage your personal datasets here.</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-muted p-1 rounded-lg flex">
                        <Button variant="ghost" size="sm" className="bg-background shadow-sm" onClick={() => { }}>Custom</Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/datasets/marketplace')}>Public</Button>
                    </div>
                    <Button onClick={handleUpload} className="ml-2">
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Dataset
                    </Button>
                </div>
            </div>

            <div className="border rounded-lg overflow-hidden bg-card">
                <table className="w-full text-sm text-left">
                    <tbody className="divide-y divide-border">
                        {datasets.map((dataset) => (
                            <tr
                                key={dataset.id}
                                className="hover:bg-muted/50 transition-colors cursor-pointer"
                                onClick={() => navigate(`/datasets/${dataset.id}`, { state: { datasetName: dataset.name } })}
                            >
                                <td className="px-6 py-4 font-medium flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                        {getIconForType(dataset.type)}
                                    </div>
                                    {dataset.name}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{dataset.type}</td>
                                <td className="px-6 py-4 text-muted-foreground">{dataset.rows}</td>
                                <td className="px-6 py-4 text-muted-foreground">{dataset.size}</td>
                                <td className="px-6 py-4 text-muted-foreground">{dataset.created}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dataset.status === 'Ready'
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {dataset.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMoreOptions(dataset.name);
                                        }}
                                    >
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Upload Dataset</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={uploadData.name}
                                onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                                placeholder="Dataset Name"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                id="type"
                                value={uploadData.type}
                                onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
                            >
                                <option value="Security">Security</option>
                                <option value="Compliance">Compliance</option>
                                <option value="Governance">Governance</option>
                                <option value="Prompt Reasoning Complexity L0">Prompt Reasoning Complexity L0</option>
                                <option value="Prompt Reasoning Complexity L1">Prompt Reasoning Complexity L1</option>
                                <option value="Prompt Reasoning Complexity L2">Prompt Reasoning Complexity L2</option>
                                <option value="JSON">JSON</option>
                                <option value="CSV">CSV</option>
                                <option value="PDF">PDF</option>
                                <option value="TXT">TXT</option>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={uploadData.description}
                                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                                placeholder="Describe your dataset..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="file">File</Label>
                            <Input
                                id="file"
                                type="file"
                                onChange={(e) => setUploadData({ ...uploadData, file: e.target.files ? e.target.files[0] : null })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                        <Button onClick={handleUploadSubmit}>Upload</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default MyDatasetsPage;
