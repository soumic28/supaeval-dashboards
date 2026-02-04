import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, Eye, Edit, Trash2, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";

interface Dataset {
    id: number;
    name: string;
    type: string;
    layersCovered: string;
    prompts: number;
    complexity: 'Low' | 'Medium' | 'High' | 'Critical';
    runs: number;
    humanReviewed: boolean;
    turnType: string;
    persona: string;
}

const initialDatasets: Dataset[] = [
    { id: 1, name: "ITSM_User_Baseline", type: "Custom", layersCovered: "Intent, RAG, Gen", prompts: 2000, complexity: "Low", runs: 15, humanReviewed: true, turnType: "Single + Multi", persona: "End User" },
    { id: 2, name: "ITSM_Admin_Baseline", type: "Custom", layersCovered: "Intent, RAG, Tool, Gen", prompts: 1500, complexity: "Medium", runs: 12, humanReviewed: true, turnType: "Single + Multi", persona: "IT Admin" },
    { id: 3, name: "ITSM_Engineer_Tickets", type: "Custom", layersCovered: "RAG, Tool, Memory", prompts: 1200, complexity: "High", runs: 10, humanReviewed: true, turnType: "Multi", persona: "L2/L3 Engineer" },
    { id: 4, name: "Incident_Triage_Set", type: "Synthetic", layersCovered: "Intent, Plan, Tool", prompts: 1000, complexity: "High", runs: 18, humanReviewed: false, turnType: "Single", persona: "Service Desk Lead" },
    { id: 5, name: "RAG_Knowledge_Gaps", type: "Synthetic", layersCovered: "Retrieval, Context", prompts: 900, complexity: "High", runs: 20, humanReviewed: false, turnType: "Single", persona: "Support Agent" },
    { id: 6, name: "Tool_Failure_Sim", type: "Synthetic", layersCovered: "Tool, Plan", prompts: 800, complexity: "Medium", runs: 25, humanReviewed: false, turnType: "Single + Multi", persona: "IT Ops" },
    { id: 7, name: "Multi_Turn_Context", type: "Custom", layersCovered: "Context, Memory", prompts: 700, complexity: "High", runs: 14, humanReviewed: true, turnType: "Multi", persona: "End User" },
    { id: 8, name: "Memory_Drift_ITSM", type: "Synthetic", layersCovered: "Memory", prompts: 600, complexity: "Medium", runs: 16, humanReviewed: false, turnType: "Multi", persona: "All Personas" },
    { id: 9, name: "Escalation_Handling", type: "Custom", layersCovered: "Intent, Gen, Policy", prompts: 750, complexity: "Medium", runs: 11, humanReviewed: true, turnType: "Multi", persona: "End User / Manager" },
    { id: 10, name: "SLA_Compliance_Set", type: "Custom", layersCovered: "Custom, Tool, Policy", prompts: 500, complexity: "High", runs: 9, humanReviewed: true, turnType: "Single", persona: "Compliance Officer" },
    { id: 11, name: "Privacy_Stress_Test", type: "Synthetic", layersCovered: "Security, Gen", prompts: 600, complexity: "High", runs: 22, humanReviewed: false, turnType: "Single", persona: "Malicious / Insider" },
    { id: 12, name: "PII_Leak_Detection", type: "Synthetic", layersCovered: "Security, RAG", prompts: 550, complexity: "Critical", runs: 19, humanReviewed: true, turnType: "Single", persona: "Auditor" },
    { id: 13, name: "SOC2_GDPR_Set", type: "Custom", layersCovered: "Governance, Security", prompts: 450, complexity: "Critical", runs: 8, humanReviewed: true, turnType: "Multi", persona: "Legal / Risk Officer" },
    { id: 14, name: "Prompt_Injection_ITSM", type: "Synthetic", layersCovered: "Security, Intent", prompts: 700, complexity: "High", runs: 21, humanReviewed: false, turnType: "Single", persona: "Attacker" },
    { id: 15, name: "Enterprise_Custom_KPI", type: "Custom", layersCovered: "Custom, Analytics", prompts: 400, complexity: "Medium", runs: 7, humanReviewed: true, turnType: "Single + Multi", persona: "Business Owner" },
];

const MyDatasetsPage = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [datasets, setDatasets] = useState<Dataset[]>(initialDatasets);
    const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
    const [editDataset, setEditDataset] = useState<Dataset | null>(null); // For editing
    const [datasetToDelete, setDatasetToDelete] = useState<number | null>(null); // For deletion

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modal states
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [uploadData, setUploadData] = useState({
        name: '',
        type: 'Security',
        description: '',
        file: null as File | null
    });

    const filteredDatasets = datasets.filter(dataset =>
        dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dataset.layersCovered.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredDatasets.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDatasets = filteredDatasets.slice(startIndex, startIndex + itemsPerPage);

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

    const handleDeleteClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setDatasetToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (datasetToDelete) {
            setDatasets(datasets.filter(d => d.id !== datasetToDelete));
            toast({
                title: "Dataset Deleted",
                description: "The dataset has been removed.",
            });
            setIsDeleteModalOpen(false);
            setDatasetToDelete(null);
        }
    };

    const handleReviewClick = (e: React.MouseEvent, dataset: Dataset) => {
        e.stopPropagation();
        setSelectedDataset(dataset);
        setIsReviewModalOpen(true);
    };

    const handleEditClick = (e: React.MouseEvent, dataset: Dataset) => {
        e.stopPropagation();
        setEditDataset({ ...dataset });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = () => {
        if (editDataset) {
            setDatasets(datasets.map(d => d.id === editDataset.id ? editDataset : d));
            toast({
                title: "Dataset Updated",
                description: `Changes to ${editDataset.name} have been saved.`,
            });
            setIsEditModalOpen(false);
            setEditDataset(null);
        }
    }

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

            <div className="flex items-center space-x-2">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search datasets..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Dataset Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Layers Covered</TableHead>
                            <TableHead>Prompts</TableHead>
                            <TableHead>Complexity</TableHead>
                            <TableHead>Runs</TableHead>
                            <TableHead>Human Reviewed</TableHead>
                            <TableHead>Turn Type</TableHead>
                            <TableHead>Persona</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedDatasets.map((dataset) => (
                            <TableRow
                                key={dataset.id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => navigate(`/datasets/${dataset.id}`, { state: { datasetName: dataset.name } })}
                            >
                                <TableCell className="font-medium">{dataset.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-normal">
                                        {dataset.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="max-w-[150px] truncate" title={dataset.layersCovered}>
                                    {dataset.layersCovered}
                                </TableCell>
                                <TableCell>{dataset.prompts.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={
                                            dataset.complexity === 'Critical' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                                                dataset.complexity === 'High' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
                                                    dataset.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                                                        'bg-green-100 text-green-800 hover:bg-green-100'
                                        }
                                    >
                                        {dataset.complexity}
                                    </Badge>
                                </TableCell>
                                <TableCell>{dataset.runs}</TableCell>
                                <TableCell>
                                    {dataset.humanReviewed ? (
                                        <div className="flex items-center text-green-600">
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            <span className="text-xs">Yes</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-red-500">
                                            <XCircle className="h-4 w-4 mr-1" />
                                            <span className="text-xs">No</span>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>{dataset.turnType}</TableCell>
                                <TableCell>{dataset.persona}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => handleReviewClick(e, dataset)} title="Review">
                                            <Eye className="h-4 w-4 text-blue-600" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => handleEditClick(e, dataset)} title="Edit">
                                            <Edit className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => handleDeleteClick(e, dataset.id)} title="Delete">
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDatasets.length)} of {filteredDatasets.length} entries
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <div className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Review Dataset: {selectedDataset?.name}</DialogTitle>
                        <DialogDescription>
                            Review the details and quality of the dataset prompts.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedDataset && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Type</Label>
                                <Input value={selectedDataset.type} readOnly className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Layers</Label>
                                <Input value={selectedDataset.layersCovered} readOnly className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Complexity</Label>
                                <Input value={selectedDataset.complexity} readOnly className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Persona</Label>
                                <Input value={selectedDataset.persona} readOnly className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right mt-2">Notes</Label>
                                <Textarea placeholder="Add review notes here..." className="col-span-3" />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>Cancel</Button>
                        <Button type="submit" onClick={() => {
                            setDatasets(datasets.map(d =>
                                d.id === selectedDataset?.id ? { ...d, humanReviewed: true } : d
                            ));
                            setIsReviewModalOpen(false);
                            toast({
                                title: "Review Complete",
                                description: "Dataset marked as reviewed.",
                            });
                        }}>Mark as Reviewed</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Dataset</DialogTitle>
                        <DialogDescription>
                            Update the details of your dataset.
                        </DialogDescription>
                    </DialogHeader>
                    {editDataset && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="edit-name"
                                    value={editDataset.name}
                                    onChange={(e) => setEditDataset({ ...editDataset, name: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-complexity" className="text-left ml-24">Complexity</Label>
                                <div className="ml-24 col-span-3">
                                    <Select
                                        value={editDataset.complexity}
                                        onChange={(e) => setEditDataset({ ...editDataset, complexity: e.target.value as any })}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-persona" className="text-right">
                                    Persona
                                </Label>
                                <Input
                                    id="edit-persona"
                                    value={editDataset.persona}
                                    onChange={(e) => setEditDataset({ ...editDataset, persona: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditSubmit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Dataset</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this dataset? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                                <option value="Custom">Custom</option>
                                <option value="Synthetic">Synthetic</option>
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
