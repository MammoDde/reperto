import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export default function SignInPage() { return <Card><CardHeader><CardTitle>Welcome to Reperto</CardTitle><CardDescription>Google authentication will be implemented in Phase 1.</CardDescription></CardHeader><CardContent><Button className="w-full" disabled><LogIn className="size-4" /> Continue with Google</Button><p className="mt-4 text-center text-xs text-muted-foreground">Foundation preview only. No authentication is active.</p></CardContent></Card>; }
