
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutGrid, Users, Home, Settings, Bell, Menu, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Channels', path: '/channels', icon: LayoutGrid },
  { name: 'Subscribers', path: '/subscribers', icon: Users },
  { name: 'Settings', path: '/settings', icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    
    return (
      <Link 
        to={item.path} 
        onClick={() => setOpen(false)}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
          'hover:bg-muted',
          isActive ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/70'
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{item.name}</span>
      </Link>
    );
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <div className="container flex h-14 items-center">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center px-4 py-2">
                  <Logo />
                  <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <Separator className="mb-4" />
                <nav className="flex flex-col gap-1 px-2">
                  {navItems.map((item) => (
                    <NavLink key={item.path} item={item} />
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center">
            <Logo />
          </div>
          <div className="flex items-center ml-auto">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0 z-30">
          <div className="flex flex-col flex-grow border-r border-border/40 bg-background px-4 py-6">
            <div className="flex items-center px-2 mb-6">
              <Logo />
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </nav>
            <div className="mt-auto pt-4">
              <Separator className="mb-4" />
              <div className="flex items-center px-3 py-2">
                <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 text-primary font-medium">
                  A
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 md:pl-64">
          <div className="container py-6 md:py-8 px-4 md:px-8 max-w-screen-2xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
