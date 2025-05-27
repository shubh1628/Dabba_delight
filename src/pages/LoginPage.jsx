import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Utensils, User, Key, Users2, ShoppingBasket, ChefHat, Bike, Settings } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/lib/supabase';

const LoginPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [userType, setUserType] = React.useState('customer');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password) {
        toast({
          title: "Login Failed",
          description: "Please enter both email and password.",
          variant: "destructive",
        });
        return;
      }

      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Get user data from our custom users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;

      // Verify user type matches
      if (userData.user_type !== userType) {
        throw new Error('Selected user type does not match your account type');
      }

      // Store session data
      localStorage.setItem('dabbaDelightUser', JSON.stringify({
        id: userData.id,
        email: userData.email,
        userType: userData.user_type,
        loginTime: new Date().toISOString()
      }));

      toast({
        title: "Login Successful!",
        description: `Welcome back! You are logged in as a ${userData.user_type}.`,
      });

      // Trigger event for UI updates
      window.dispatchEvent(new Event('dabbaUserChanged'));
      
      // Navigate based on user type
      switch (userData.user_type) {
        case 'customer':
          navigate('/dashboard/customer');
          break;
        case 'housewife':
          navigate('/dashboard/housewife');
          break;
        case 'vendor':
          navigate('/dashboard/vendor');
          break;
        case 'deliveryPartner':
          navigate('/dashboard/delivery');
          break;
        case 'admin':
          navigate('/dashboard/admin');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials or user type. Please check your details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-13rem)] bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <Utensils className="mx-auto h-16 w-auto text-orange-500" />
          <h1 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            Sign in to Dabba Delight
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-orange-600 hover:text-orange-500">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <Label htmlFor="userType" className="flex items-center text-gray-700 font-medium mb-1">
              <Users2 className="h-5 w-5 mr-2 text-orange-500" />
              I am a...
            </Label>
            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">
                  <div className="flex items-center">
                    <ShoppingBasket className="h-4 w-4 mr-2 text-blue-500" /> Customer
                  </div>
                </SelectItem>
                <SelectItem value="housewife">
                  <div className="flex items-center">
                    <ChefHat className="h-4 w-4 mr-2 text-green-500" /> Housewife
                  </div>
                </SelectItem>
                <SelectItem value="vendor">
                  <div className="flex items-center">
                    <Utensils className="h-4 w-4 mr-2 text-purple-500" /> Vendor
                  </div>
                </SelectItem>
                <SelectItem value="deliveryPartner">
                  <div className="flex items-center">
                    <Bike className="h-4 w-4 mr-2 text-teal-500" /> Delivery Partner
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 mr-2 text-gray-600" /> Admin
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="email-address" className="flex items-center text-gray-700 font-medium mb-1">
              <User className="h-5 w-5 mr-2 text-orange-500" />
              Email address
            </Label>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>

          <div>
            <Label htmlFor="password" className="flex items-center text-gray-700 font-medium mb-1">
              <Key className="h-5 w-5 mr-2 text-orange-500" />
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </Label>
            </div>

            <div className="text-sm">
              <Link to="#" className="font-medium text-orange-600 hover:text-orange-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform transition-transform hover:scale-102"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;