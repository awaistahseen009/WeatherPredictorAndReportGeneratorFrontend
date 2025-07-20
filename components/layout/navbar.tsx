'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Cloud, User, LogOut, History, Home } from 'lucide-react';

export function Navbar() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/weather" className="flex items-center space-x-2">
              <Cloud className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">WeatherApp</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session?.user ? (
              <>
                <Link href="/weather">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <Home className="h-4 w-4 mr-2" />
                    Weather
                  </Button>
                </Link>
                <Link href="/history">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <History className="h-4 w-4 mr-2" />
                    History
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                        <AvatarFallback>
                          {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.user.name || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="sm:hidden" asChild>
                      <Link href="/weather">
                        <Home className="h-4 w-4 mr-2" />
                        Weather
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="sm:hidden" asChild>
                      <Link href="/history">
                        <History className="h-4 w-4 mr-2" />
                        History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="sm:hidden" />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}