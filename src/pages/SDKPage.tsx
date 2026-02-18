
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Copy, Terminal, Code, Server, Plus, Trash2, Key, Loader2, Calendar } from 'lucide-react';
import { useApiKeys, useCreateApiKey, useDeleteApiKey } from '@/hooks/queries/use-api-keys';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Select } from '@/components/ui/Select';

export default function SDKPage() {
    const [copied, setCopied] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [expiration, setExpiration] = useState("never");
    const [createdKey, setCreatedKey] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const { apiKeys, isLoading: isLoadingKeys } = useApiKeys();
    const { mutateAsync: createApiKey, isPending: isCreating } = useCreateApiKey();
    const { mutateAsync: deleteApiKey, isPending: isDeleting } = useDeleteApiKey();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleCreateKey = async () => {
        try {
            let expiresAt: string;
            if (expiration === "never") {
                // Set to 100 years in the future for "never"
                const date = new Date();
                date.setFullYear(date.getFullYear() + 100);
                expiresAt = date.toISOString();
            } else {
                const date = new Date();
                const days = parseInt(expiration);
                date.setDate(date.getDate() + days);
                expiresAt = date.toISOString();
            }

            const result = await createApiKey({ name: newKeyName, expires_at: expiresAt });
            setCreatedKey(result.api_key || "Key created but not returned"); // Fallback if key missing
            setNewKeyName("");
            setExpiration("never");
        } catch (error) {
            console.error("Failed to create API key", error);
        }
    };

    const handleCloseCreate = () => {
        setIsCreateOpen(false);
        setCreatedKey(null);
    }

    const CodeBlock = ({ code, language, id }: { code: string, language: string, id: string }) => (
        <div className="relative mt-4 rounded-md bg-muted p-4">
            <div className="absolute right-4 top-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => copyToClipboard(code, id)}
                >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy</span>
                </Button>
            </div>
            <pre className="overflow-x-auto">
                <code className={`language-${language} text-sm`}>
                    {code}
                </code>
            </pre>
            {copied === id && (
                <div className="absolute right-14 top-5 text-xs text-muted-foreground animate-in fade-in slide-in-from-right-2">
                    Copied!
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">SDK & API Integration</h1>
                <p className="text-muted-foreground mt-2">
                    Integrate SupaEval into your application using our SDKs or directly via the API.
                </p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-xl">My API Keys</CardTitle>
                            <CardDescription>Manage your secret keys for API access.</CardDescription>
                        </div>
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create New Key
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Create API Key</DialogTitle>
                                    <DialogDescription>
                                        Create a new secret key to access the SupaEval API.
                                    </DialogDescription>
                                </DialogHeader>
                                {!createdKey ? (
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Key Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="e.g. Production App"
                                                value={newKeyName}
                                                onChange={(e) => setNewKeyName(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="expiration">Expiration</Label>
                                            <Select
                                                id="expiration"
                                                value={expiration}
                                                onChange={(e) => setExpiration(e.target.value)}
                                            >
                                                <option value="never">Never</option>
                                                <option value="30">30 Days</option>
                                                <option value="60">60 Days</option>
                                                <option value="90">90 Days</option>
                                            </Select>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                            <Button onClick={handleCreateKey} disabled={!newKeyName || isCreating}>
                                                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Create Key
                                            </Button>
                                        </DialogFooter>
                                    </div>
                                ) : (
                                    <div className="space-y-4 py-4">
                                        <div className="rounded-md bg-green-50 p-4 border border-green-200">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <Key className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-green-800">API Key Created</h3>
                                                    <div className="mt-2 text-sm text-green-700">
                                                        <p>Please copy your API key now. You won't be able to see it again!</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <Input readOnly value={createdKey} className="pr-12 font-mono" />
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="absolute right-1 top-1 h-8 w-8"
                                                onClick={() => copyToClipboard(createdKey, 'new-key')}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            {copied === 'new-key' && (
                                                <span className="absolute right-10 top-2 text-xs text-green-600">Copied!</span>
                                            )}
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleCloseCreate}>Done</Button>
                                        </DialogFooter>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        {isLoadingKeys ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : apiKeys && apiKeys.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Prefix</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead>Last Used</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(isExpanded ? apiKeys : apiKeys.slice(0, 2)).map((key) => (
                                        <TableRow key={key.id}>
                                            <TableCell className="font-medium">{key.name}</TableCell>
                                            <TableCell className="font-mono text-xs">{key.prefix}...</TableCell>
                                            <TableCell>
                                                <div className="flex items-center text-muted-foreground text-sm">
                                                    <Calendar className="mr-2 h-3 w-3" />
                                                    {formatDate(key.created_at)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {key.last_used_at ? formatDate(key.last_used_at) : 'Never'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to revoke this API key?')) {
                                                            deleteApiKey(key.id);
                                                        }
                                                    }}
                                                    disabled={isDeleting}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground">
                                No API keys found. Create one to get started.
                            </div>
                        )}
                        {apiKeys && apiKeys.length > 2 && (
                            <div className="flex justify-center mt-4 border-t pt-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    {isExpanded ? (
                                        <>Show Less</>
                                    ) : (
                                        <>Show {apiKeys.length - 2} More</>
                                    )}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Tabs defaultValue="typescript" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
                        <TabsTrigger value="typescript">Typescript</TabsTrigger>
                        <TabsTrigger value="python">Python</TabsTrigger>
                        <TabsTrigger value="api">API</TabsTrigger>
                    </TabsList>

                    <TabsContent value="typescript" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Terminal className="h-5 w-5" />
                                    Installation
                                </CardTitle>
                                <CardDescription>
                                    Install the TypeScript SDK using your preferred package manager.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CodeBlock
                                    id="ts-install"
                                    language="bash"
                                    code="npm install @supaeval/sdk"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Code className="h-5 w-5" />
                                    Usage
                                </CardTitle>
                                <CardDescription>
                                    Initialize the client and start logging events.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CodeBlock
                                    id="ts-usage"
                                    language="typescript"
                                    code={`import { SupaEval } from '@supaeval/sdk';

const client = new SupaEval({
  apiKey: process.env.SUPAEVAL_API_KEY,
});

// Log an event
await client.log({
  project: "my-project",
  event: "user_signup",
  data: {
    userId: "user_123",
    method: "email"
  }
});`}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="python" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Terminal className="h-5 w-5" />
                                    Installation
                                </CardTitle>
                                <CardDescription>
                                    Install the Python SDK using pip.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CodeBlock
                                    id="py-install"
                                    language="bash"
                                    code="pip install supaeval"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Code className="h-5 w-5" />
                                    Usage
                                </CardTitle>
                                <CardDescription>
                                    Initialize the client and start logging events.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CodeBlock
                                    id="py-usage"
                                    language="python"
                                    code={`from supaeval import SupaEval
import os

client = SupaEval(
    api_key=os.environ.get("SUPAEVAL_API_KEY")
)

# Log an event
client.log(
    project="my-project",
    event="user_signup",
    data={
        "user_id": "user_123",
        "method": "email"
    }
)`}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="api" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Server className="h-5 w-5" />
                                    API Reference
                                </CardTitle>
                                <CardDescription>
                                    Direct HTTP API integration.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <h3 className="text-sm font-medium">Base URL</h3>
                                    <div className="rounded-md bg-muted px-4 py-2 font-mono text-sm">
                                        https://api.supaeval.com/v1
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <h3 className="text-sm font-medium">Authentication</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Include your API key in the Authorization header.
                                    </p>
                                    <CodeBlock
                                        id="api-auth"
                                        language="bash"
                                        code={`curl -X POST https://api.supaeval.com/v1/events \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "project": "my-project",
    "event": "user_signup",
    "data": { "userId": "user_123" }
  }'`}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
