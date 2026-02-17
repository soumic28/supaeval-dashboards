import { Building2, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Tenant } from '@/types/models';

interface TenantCardProps {
    tenant: Tenant;
    isSelected?: boolean;
    onSelect?: (tenantId: string) => void;
    onEdit?: (tenantId: string) => void;
    onDelete?: (tenantId: string) => void;
}

export function TenantCard({ tenant, isSelected, onSelect, onEdit, onDelete }: TenantCardProps) {
    return (
        <Card
            className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-indigo-600 bg-indigo-500/5' : ''
                }`}
            onClick={() => onSelect?.(tenant.id)}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <Building2 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{tenant.name}</h3>
                                {tenant.is_active ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-red-600" />
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                <code className="px-1.5 py-0.5 bg-muted rounded text-xs">
                                    {tenant.slug}
                                </code>
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                <span>
                                    Created {new Date(tenant.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    {(onEdit || onDelete) && (
                        <div className="flex items-center gap-2 ml-4">
                            {onEdit && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(tenant.id);
                                    }}
                                >
                                    Edit
                                </Button>
                            )}
                            {onDelete && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(tenant.id);
                                    }}
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
