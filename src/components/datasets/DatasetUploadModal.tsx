import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Info } from 'lucide-react';


interface DatasetUploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpload?: (data: any) => void;
}

export function DatasetUploadModal({
    open,
    onOpenChange,
    onUpload,
}: DatasetUploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [type, setType] = useState('Security');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            validateAndSetFile(selectedFile);
        }
    };

    const validateAndSetFile = (file: File) => {
        const validExtensions = ['json', 'csv'];

        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        if (!fileExtension || !validExtensions.includes(fileExtension)) {
            setError('Please upload a valid JSON or CSV file.');
            setFile(null);
            return;
        }

        setError(null);
        setFile(file);
    };

    const handleUploadClick = () => {
        if (file && name && onUpload) {
            onUpload({ file, name, type, description });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Upload Dataset</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Dataset Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="Security">Security</option>
                            <option value="Conversation">Conversation</option>
                            <option value="QA Pairs">QA Pairs</option>
                            <option value="Prompts">Prompts</option>
                            <option value="Benchmark">Benchmark</option>
                            <option value="Custom">Custom</option>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your dataset..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="file">File</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="file"
                                type="file"
                                accept=".json,.csv"
                                onChange={handleFileChange}
                                className="cursor-pointer file:cursor-pointer file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium hover:file:bg-accent/50"
                            />
                        </div>
                        {error && (
                            <div className="text-sm text-destructive">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="bg-muted/50 border border-muted rounded-lg p-3 flex items-start gap-2 text-sm text-muted-foreground mt-2">
                        <Info className="h-4 w-4 mt-0.5 text-primary" />
                        <div>
                            <p className="font-medium text-foreground">Accepted File Formats</p>
                            <p>We strictly accept <strong>.json</strong> and <strong>.csv</strong> files. Please ensuring your data includes required fields.</p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUploadClick}
                        disabled={!file || !name}
                    >
                        Upload
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
