import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Utensils, Users, MessageSquare, Phone, ShieldCheck, Menu, X, LogIn, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loggedInUser, setLoggedInUser] = React.useState(null);

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('dabbaDelightUser'));
    setLoggedInUser(user);

    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('dabbaDelightUser'));
      setLoggedInUser(updatedUser);
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dabbaUserChanged', handleStorageChange); 
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dabbaUserChanged', handleStorageChange);
    }
  }, [location.pathname]);


  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About Us', path: '/about', icon: Users },
    { name: 'Products', path: '/products', icon: Utensils },
    { name: 'Feedback', path: '/feedback', icon: MessageSquare },
    { name: 'Contact Us', path: '/contact', icon: Phone },
    { name: 'Terms & Conditions', path: '/terms', icon: ShieldCheck },
  ];

  const handleLogout = () => {
    localStorage.removeItem('dabbaDelightUser');
    setLoggedInUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    window.dispatchEvent(new Event('dabbaUserChanged'));
    navigate('/');
    setIsOpen(false);
  };
  
  const getDashboardPath = () => {
    if (!loggedInUser) return '/login';
    switch (loggedInUser.userType) {
      case 'customer': return '/dashboard/customer';
      case 'housewife': return '/dashboard/housewife';
      case 'vendor': return '/dashboard/vendor';
      case 'deliveryPartner': return '/dashboard/delivery';
      case 'admin': return '/dashboard/admin';
      default: return '/login';
    }
  };


  return (
    <nav className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <Utensils className="h-10 w-10 text-white" />
            <span className="text-3xl font-bold text-white tracking-tight">Dabba Delight</span>
          </Link>
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Button
                key={link.name}
                variant={location.pathname === link.path ? 'secondary' : 'ghost'}
                asChild
                className={`text-white hover:bg-white/20 ${location.pathname === link.path ? 'bg-white/30 font-semibold' : ''}`}
              >
                <Link to={link.path} className="flex items-center space-x-1 px-3 py-2 rounded-md">
                  <link.icon className="h-5 w-5" />
                  <span>{link.name}</span>
                </Link>
              </Button>
            ))}
            {loggedInUser ? (
              <>
                <Button
                  variant={location.pathname.startsWith('/dashboard') ? 'secondary' : 'ghost'}
                  asChild
                  className={`text-white hover:bg-white/20 ${location.pathname.startsWith('/dashboard') ? 'bg-white/30 font-semibold' : ''}`}
                >
                  <Link to={getDashboardPath()} className="flex items-center space-x-1 px-3 py-2 rounded-md">
                    {loggedInUser.userType === 'admin' ? <Settings className="h-5 w-5" /> : <LayoutDashboard className="h-5 w-5" />}
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Button
                variant={location.pathname === '/login' ? 'secondary' : 'ghost'}
                asChild
                className={`text-white hover:bg-white/20 ${location.pathname === '/login' ? 'bg-white/30 font-semibold' : ''}`}
              >
                <Link to="/login" className="flex items-center space-x-1 px-3 py-2 rounded-md">
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
              </Button>
            )}
          </div>
          <div className="md:hidden">
            <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon" className="text-white hover:bg-white/20">
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </Button>
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-orange-500/95 backdrop-blur-sm pb-3"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Button
                key={link.name}
                variant={location.pathname === link.path ? 'secondary' : 'ghost'}
                asChild
                className={`w-full justify-start text-white hover:bg-white/20 ${location.pathname === link.path ? 'bg-white/30 font-semibold' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Link to={link.path} className="flex items-center space-x-2 px-3 py-2 rounded-md">
                  <link.icon className="h-5 w-5" />
                  <span>{link.name}</span>
                </Link>
              </Button>
            ))}
            {loggedInUser ? (
              <>
                <Button
                  variant={location.pathname.startsWith('/dashboard') ? 'secondary' : 'ghost'}
                  asChild
                  className={`w-full justify-start text-white hover:bg-white/20 ${location.pathname.startsWith('/dashboard') ? 'bg-white/30 font-semibold' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Link to={getDashboardPath()} className="flex items-center space-x-2 px-3 py-2 rounded-md">
                     {loggedInUser.userType === 'admin' ? <Settings className="h-5 w-5" /> : <LayoutDashboard className="h-5 w-5" />}
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/20"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Button
                variant={location.pathname === '/login' ? 'secondary' : 'ghost'}
                asChild
                className={`w-full justify-start text-white hover:bg-white/20 ${location.pathname === '/login' ? 'bg-white/30 font-semibold' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Link to="/login" className="flex items-center space-x-2 px-3 py-2 rounded-md">
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;