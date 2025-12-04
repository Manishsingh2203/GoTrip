// Enhanced ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log('🔄 Route changed, scrolling to top...');
    
    // Method 1: Instant scroll
    window.scrollTo(0, 0);
    
    // Method 2: DOM element scroll
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Method 3: Multiple fallbacks with delays
    const scrollAttempts = [
      () => window.scrollTo(0, 0),
      () => document.documentElement.scrollTop = 0,
      () => document.body.scrollTop = 0,
      () => window.scrollTo({ top: 0, behavior: 'instant' }),
      () => window.scrollTo(0, 1) // Sometimes needed for mobile
    ];

    scrollAttempts.forEach((attempt, index) => {
      setTimeout(attempt, index * 10);
    });

    // Final check and force scroll
    const finalCheck = setTimeout(() => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScroll > 0) {
        console.log('⚠️ Still scrolled, forcing to top...');
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
      }
    }, 100);

    return () => clearTimeout(finalCheck);
  }, [pathname]);

  return null;
};