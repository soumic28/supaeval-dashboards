import { Plus, Download, AlertTriangle, Building, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useAuth } from '@/contexts/AuthContext';

export function BillingSettings() {
    const { user } = useAuth();

    const invoices = [
        { id: 'inv_1', date: 'Mar 1, 2026', amount: '$49.00', status: 'Paid', period: 'Feb 1 - Mar 1, 2026' },
        { id: 'inv_2', date: 'Feb 1, 2026', amount: '$49.00', status: 'Paid', period: 'Jan 1 - Feb 1, 2026' },
        { id: 'inv_3', date: 'Jan 1, 2026', amount: '$49.00', status: 'Paid', period: 'Dec 1 - Jan 1, 2026' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Billing Settings</h3>
                <p className="text-sm text-muted-foreground">Manage payment methods, billing details, and invoices.</p>
            </div>

            <div className="grid gap-6">
                {/* Payment Methods */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription>Manage your payment cards and billing preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/20 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-8 bg-zinc-800 rounded flex items-center justify-center">
                                    <div className="w-8 h-4 bg-zinc-600 rounded-sm" />
                                </div>
                                <div>
                                    <div className="font-medium flex items-center gap-2">
                                        Visa ending in 4242
                                        <Badge variant="outline" className="text-xs font-normal">Default</Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">Expires 12/28</div>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Edit</Button>
                        </div>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Payment Method
                        </Button>
                    </CardContent>
                </Card>

                {/* Billing Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Billing Information</CardTitle>
                        <CardDescription>This information will appear on your invoices.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="company">Company Name</Label>
                            <div className="relative">
                                <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input id="company" defaultValue="Acme Corp" className="pl-9" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Billing Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input id="email" defaultValue={user?.email || "billing@example.com"} className="pl-9" />
                            </div>
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="address">Billing Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input id="address" defaultValue="123 Innovation Dr, Tech City, TC 94043" className="pl-9" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t bg-muted/20 px-6 py-4">
                        <Button>Save Changes</Button>
                    </CardFooter>
                </Card>

                {/* Invoice History */}
                <Card>
                    <CardHeader>
                        <CardTitle>Invoice History</CardTitle>
                        <CardDescription>Download past invoices and view payment status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <div className="grid grid-cols-4 gap-4 p-4 border-b bg-muted/40 font-medium text-sm text-muted-foreground">
                                <div>Date</div>
                                <div>Period</div>
                                <div>Amount</div>
                                <div className="text-right">Status</div>
                            </div>
                            <div className="divide-y">
                                {invoices.map((invoice) => (
                                    <div key={invoice.id} className="grid grid-cols-4 gap-4 p-4 text-sm items-center hover:bg-muted/20 transition-colors">
                                        <div className="font-medium">{invoice.date}</div>
                                        <div className="text-muted-foreground text-xs md:text-sm">{invoice.period}</div>
                                        <div>{invoice.amount}</div>
                                        <div className="flex justify-end items-center gap-3">
                                            <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                                                {invoice.status}
                                            </Badge>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Download className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200 dark:border-red-900/50">
                    <CardHeader>
                        <CardTitle className="text-red-600 dark:text-red-500 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Danger Zone
                        </CardTitle>
                        <CardDescription>
                            Actions that affect your subscription status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="font-medium">Cancel Subscription</div>
                            <div className="text-sm text-muted-foreground">
                                Your plan will be downgraded to Starter at the end of the billing period.
                            </div>
                        </div>
                        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:hover:bg-red-950/40">
                            Cancel Subscription
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
