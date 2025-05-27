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

const SignupPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [userType, setUserType] = React.useState('customer');
  const [loading, setLoading] = React.useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password || !confirmPassword) {
        toast({
          title: "Signup Failed",
          description: "Please fill in all fields.",
          variant: "destructive",
        });
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Signup Failed",
          description: "Passwords do not match.",
          variant: "destructive",
        });
        return;
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser) {
        toast({
          title: "Signup Failed",
          description: "User with this email already exists.",
          variant: "destructive",
        });
        return;
      }

      // Insert new user into users table
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([
          {
            email,
            password, // Note: In a production app, you should hash the password
            user_type: userType,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Signup Successful!",
        description: "Your account has been created.",
      });

      // Navigate to login page
      navigate('/login');
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error.message || "An error occurred during signup.",
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
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div>
            <Label htmlFor="userType" className="flex items-center text-gray-700 font-medium mb-1">
              <Users2 className="h-5 w-5 mr-2 text-orange-500" />
              I want to join as...
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>

          <div>
            <Label htmlFor="confirm-password" className="flex items-center text-gray-700 font-medium mb-1">
              <Key className="h-5 w-5 mr-2 text-orange-500" />
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
              placeholder="Confirm password"
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform transition-transform hover:scale-102"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignupPage;