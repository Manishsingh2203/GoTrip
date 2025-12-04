import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

import { 
  MapPin, 
  Plane, 
  Map, 
  User,
  LogOut,
  Menu,
  Home,
  X,
  ClipboardList,
  Train,
  Hotel,
  Phone,
  HeadphonesIcon,
  Gift,
  Shield,
  IndianRupee,
  ChevronDown,
  Search,
  Calendar,
  Users
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Flights', href: '/flights-search', icon: Plane },
    { name: 'Hotels', href: '/hotels-search', icon: Hotel },
    { name: 'Trains', href: '/trains-search', icon: Train },
    { name: 'Home', href: '/', icon: Home },
    { name: 'Places', href: '/places', icon: Map },
    { name: 'PlanTrip', href: '/plan-trip', icon: Map },
    { name: 'Checklist', href: '/checklist', icon: ClipboardList },
  ];

  // Filter out items that appear in Quick Actions for mobile drawer only
  const mobileNavigation = navigation.filter(item => 
    !['Flights', 'Hotels', 'Trains', 'PlanTrip'].includes(item.name)
  );
   
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10); 
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleQuickSearch = (type) => {
    switch(type) { 
      case 'flights': navigate('/flights-search'); break;
      case 'hotels': navigate('/hotels-search'); break;
      case 'trains': navigate('/trains-search'); break;
      default: break;
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* MAIN NAVBAR */}
      <nav 
        className="backdrop-blur-xl bg-gradient-to-r from-[#FFF7F0] via-white to-[#EAF3FF] border-b border-[#E2E8F0] sticky top-0 z-[1500] transition-all duration-300"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 mr-8">
              <span
                className="text-2xl font-extrabold tracking-tight font-[Nunito_Sans] bg-gradient-to-r from-[#FF7A32] via-[#FF9F4A] to-[#FF7A32] bg-clip-text text-transparent"
              >
                Go.Trip
              </span>
            </Link>
             
            {/* Desktop Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold text-[15px]
                      transition-all duration-300
                      ${
                        isActive(item.href)
                          ? "bg-[#FF7A32]/10 text-[#FF7A32] border-b-2 border-[#FF7A32] shadow-sm"
                          : "text-[#475569] hover:text-[#FF7A32] hover:bg-[#FFF1E8]"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* RIGHT SECTION */}
            <div className="hidden lg:flex items-center space-x-4">

              {/* Support */}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-3 py-2 text-[#484848] hover:text-[#FF7A32] transition-all duration-300 rounded-lg hover:bg-[#F7F7F7]"
                   onClick={() => navigate('/contact')}>
                  <HeadphonesIcon className="h-4 w-4 text-[#767676]" />
                  <span className="text-sm font-medium">Support</span>
                </button>

                <div className="absolute top-full right-0 w-64 bg-white shadow-xl rounded-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-200">
                  <div className="space-y-3">

                    <div className="flex items-center space-x-3 p-2 hover:bg-[#F7F7F7] rounded-lg cursor-pointer transition-all">
                      <Phone className="h-4 w-4 text-[#767676]" />
                      <div>
                        <div className="font-semibold text-sm text-[#222222]">24/7 Support</div>
                        <div className="text-xs text-[#767676]">+91-7317084444</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-2 hover:bg-[#F7F7F7] rounded-lg cursor-pointer transition-all">
                      <Shield className="h-4 w-4 text-[#767676]" />
                      <div>
                        <div className="font-semibold text-sm text-[#222222]">Safe & Secure</div>
                        <div className="text-xs text-[#767676]">Your safety first</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Offers */}
              <button 
              onClick={()=>navigate('/explore-deals')}
              className="flex items-center space-x-1 px-3 py-2 text-[#484848] hover:text-[#FF7A32] transition-all duration-300 rounded-lg hover:bg-[#F7F7F7]">
                <Gift className="h-4 w-4 text-[#767676]" />
                <span className="text-sm font-medium">Offers</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-[#767676] hover:text-[#FF7A32] transition-all duration-300 rounded-lg hover:bg-[#F7F7F7]"
              >

              </button> 

              {/* USER MENU */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-full px-4 py-2 hover:bg-white transition-all duration-300 shadow-sm"
                  >
                    <User className="h-5 w-5 text-[#484848]" />
                    <span className="text-sm font-semibold text-[#222222]">{user.name}</span>
                    <ChevronDown className="h-4 w-4 text-[#484848]" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute top-full right-0 w-64 bg-white shadow-2xl rounded-2xl p-3 mt-2 border border-gray-200">
                      <div className="space-y-1">
                        <div className="px-3 py-2 text-sm text-[#767676] border-b border-gray-100">Welcome, {user.name}</div>


                        <div className="border-t border-gray-100 pt-1">
                          <button
                            onClick={() => {
                              logout();
                              setIsUserMenuOpen(false);
                            }}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-[#FF7A32] hover:bg-[#FF7A32]/5 rounded-lg transition-all"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="text-sm font-semibold text-[#484848] hover:text-[#FF7A32] transition-all duration-300">
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="bg-[#FF7A32] text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    SignUp
                  </Link>
                </div>
              )}

            </div>

            {/* Mobile buttons */}
            <div className="lg:hidden flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 text-[#767676] hover:text-[#FF7A32] transition-all duration-300"
              >
               
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-[#484848] hover:text-[#FF7A32] transition-all duration-300 rounded-lg border border-gray-300"
              >
                {isOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
              </button>
            </div>

          </div>
        </div>

        {/* Quick Book Bar */}
        {/* <div className="hidden lg:block border-t border-gray-200 bg-[#F7F7F7] backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

            <div className="flex items-center space-x-6 text-sm">
              <span className="font-semibold text-[#222222]">Quick Book:</span>

              <button onClick={() => handleQuickSearch('/flights-search')} className="flex items-center space-x-2 text-[#484848] hover:text-[#FF7A32] transition-all duration-300 hover:bg-white/50 px-3 py-1 rounded-lg">
                <Plane className="h-4 w-4 text-[#767676]" />
                <span>Flights</span>
              </button>

              <button onClick={() => handleQuickSearch('/hotels-search')} className="flex items-center space-x-2 text-[#484848] hover:text-[#FF7A32] transition-all duration-300 hover:bg-white/50 px-3 py-1 rounded-lg">
                <Hotel className="h-4 w-4 text-[#767676]" />
                <span>Hotels</span>
              </button>

              <button onClick={() => handleQuickSearch('/trains-search')} className="flex items-center space-x-2 text-[#484848] hover:text-[#FF7A32] transition-all duration-300 hover:bg-white/50 px-3 py-1 rounded-lg">
                <Train className="h-4 w-4 text-[#767676]" />
                <span>Trains</span>
              </button>
            </div>

            <div className="flex items-center space-x-4 text-sm text-[#767676]">
              <div className="flex items-center space-x-1 bg-white/50 px-3 py-1 rounded-lg">
                <IndianRupee className="h-4 w-4 text-[#767676]"/>
                <span>Best Price Guaranteed</span>
              </div>

              <div className="w-px h-4 bg-gray-300"></div>

              <div className="flex items-center space-x-1 bg-white/50 px-3 py-1 rounded-lg">
                <Shield className="h-4 w-4 text-[#767676]"/>
                <span>Safe & Secure</span>
              </div>
            </div>

          </div>
        </div> */}
      </nav>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl overflow-y-auto">

            <div className="p-6">
 
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-8">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#FF7A32] rounded-xl flex items-center justify-center shadow-lg">
                    <Plane className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-[#FF7A32]">
                    GoTrip 
                  </span>
                </Link>
      
                <button onClick={() => setIsOpen(false)} className="p-2 text-[#484848] hover:text-[#FF7A32] transition-all duration-300">
                  <X className="h-6 w-6"/>
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {/* Flights */}
                <button 
                  onClick={() => handleQuickSearch('flights')}
                  className="flex flex-col items-center p-4 border border-gray-300 rounded-xl hover:border-[#FF7A32] hover:bg-[#FF7A32]/5 transition-all duration-300"
                >
                  <Plane className="h-6 w-6 text-[#FF7A32] mb-2"/>
                  <span className="text-sm font-semibold text-[#484848]">Flights</span>
                </button>

                {/* Hotels */}
                <button 
                  onClick={() => handleQuickSearch('hotels')}
                  className="flex flex-col items-center p-4 border border-gray-300 rounded-xl hover:border-[#FF7A32] hover:bg-[#FF7A32]/5 transition-all duration-300"
                >
                  <Hotel className="h-6 w-6 text-[#FF7A32] mb-2"/>
                  <span className="text-sm font-semibold text-[#484848]">Hotels</span>
                </button>

                {/* Trains */}
                <button 
                  onClick={() => handleQuickSearch('trains')}
                  className="flex flex-col items-center p-4 border border-gray-300 rounded-xl hover:border-[#FF7A32] hover:bg-[#FF7A32]/5 transition-all duration-300"
                >
                  <Train className="h-6 w-6 text-[#FF7A32] mb-2"/>
                  <span className="text-sm font-semibold text-[#484848]">Trains</span>
                </button>

                {/* Plan Trip */}
                <Link 
                  to="/plan-trip"
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col items-center p-4 border border-gray-300 rounded-xl hover:border-[#FF7A32] hover:bg-[#FF7A32]/5 transition-all duration-300"
                >
                  <Map className="h-6 w-6 text-[#FF7A32] mb-2"/>
                  <span className="text-sm font-semibold text-[#484848]">Plan Trip</span>
                </Link>
              </div>

              {/* Navigation Links - Filtered for mobile to avoid duplicates */}
              <div className="space-y-2 mb-8">
                {mobileNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300
                        ${
                          isActive(item.href)
                            ? "text-[#FF7A32] bg-[#FF7A32]/10 border-l-4 border-[#FF7A32]"
                            : "text-[#484848] hover:text-[#FF7A32] hover:bg-[#F7F7F7]"
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* USER SECTION */}
              {user ? (
                <div className="border-t border-gray-200 pt-6">

                  <div className="flex items-center space-x-3 px-4 py-3 bg-[#F7F7F7] rounded-lg mb-4">
                    <User className="h-6 w-6 text-[#FF7A32]"/>
                    <div>
                      <div className="font-semibold text-[#222222]">{user.name}</div>
                     
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-[#FF7A32] hover:bg-[#FF7A32]/5 rounded-lg transition-all duration-300"
                  >
                    <LogOut className="h-5 w-5"/>
                    <span>Sign Out</span>
                  </button>

                </div>
              ) : (
                <div className="border-t border-gray-200 pt-6 space-y-3">
                  <Link 
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-[#FF7A32] text-white py-3 rounded-xl font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#FF8A42]"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block w-full border-2 border-[#FF7A32] text-[#FF7A32] py-3 rounded-xl font-semibold text-center hover:bg-[#FF7A32] hover:text-white transition-all duration-300"
                  >
                    Create Account
                  </Link>
                </div>
              )}

              {/* Support */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="space-y-3">

                  <div className="flex items-center space-x-3 text-sm text-[#484848] p-2 bg-[#F7F7F7] rounded-lg">
                    <HeadphonesIcon className="h-4 w-4 text-[#767676]"/>
                    <span>24/7 Support: +91-73170-84444</span>
                  </div>

                  <div className="flex items-center space-x-3 text-sm text-[#484848] p-2 bg-[#F7F7F7] rounded-lg">
                    <Shield className="h-4 w-4 text-[#767676]"/>
                    <span>Safe & Secure Bookings</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Navbar;