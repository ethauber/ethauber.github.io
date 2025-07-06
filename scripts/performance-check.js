/**
 * Performance Monitoring Script
 * Tracks Core Web Vitals and other performance metrics
 */

// Core Web Vitals tracking
function trackCoreWebVitals() {
  // First Contentful Paint
  const paintEntries = performance.getEntriesByType('paint');
  const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
  if (fcp) {
    console.log('First Contentful Paint:', fcp.startTime.toFixed(2), 'ms');
  }

  // Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('Largest Contentful Paint:', lastEntry.startTime.toFixed(2), 'ms');
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // Cumulative Layout Shift
  let clsScore = 0;
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
        }
      }
      console.log('Cumulative Layout Shift:', clsScore.toFixed(4));
    });
    observer.observe({ entryTypes: ['layout-shift'] });
  }

  // First Input Delay
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('First Input Delay:', entry.processingStart - entry.startTime, 'ms');
      }
    });
    observer.observe({ entryTypes: ['first-input'] });
  }
}

// Resource loading analysis
function analyzeResourceLoading() {
  const resources = performance.getEntriesByType('resource');
  const resourceStats = {
    totalResources: resources.length,
    totalSize: 0,
    slowResources: [],
    largeResources: []
  };

  resources.forEach(resource => {
    const duration = resource.responseEnd - resource.startTime;
    const size = resource.transferSize || 0;
    
    resourceStats.totalSize += size;
    
    // Flag slow resources (>1s)
    if (duration > 1000) {
      resourceStats.slowResources.push({
        name: resource.name,
        duration: duration.toFixed(2),
        type: resource.initiatorType
      });
    }
    
    // Flag large resources (>100KB)
    if (size > 100000) {
      resourceStats.largeResources.push({
        name: resource.name,
        size: (size / 1024).toFixed(2) + 'KB',
        type: resource.initiatorType
      });
    }
  });

  console.log('Resource Loading Analysis:', resourceStats);
  return resourceStats;
}

// Memory usage tracking
function trackMemoryUsage() {
  if ('memory' in performance) {
    const memory = performance.memory;
    console.log('Memory Usage:', {
      used: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB',
      total: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + 'MB',
      limit: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + 'MB'
    });
  }
}

// Navigation timing analysis
function analyzeNavigationTiming() {
  const navigation = performance.getEntriesByType('navigation')[0];
  if (navigation) {
    const timing = {
      'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
      'TCP Connection': navigation.connectEnd - navigation.connectStart,
      'Request': navigation.responseStart - navigation.requestStart,
      'Response': navigation.responseEnd - navigation.responseStart,
      'DOM Processing': navigation.domComplete - navigation.domLoading,
      'Load Complete': navigation.loadEventEnd - navigation.navigationStart
    };
    
    console.log('Navigation Timing:', timing);
    return timing;
  }
}

// Performance score calculation
function calculatePerformanceScore() {
  const navigation = performance.getEntriesByType('navigation')[0];
  if (!navigation) return null;
  
  const loadTime = navigation.loadEventEnd - navigation.navigationStart;
  const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
  
  let score = 100;
  
  // Deduct points for slow metrics
  if (loadTime > 3000) score -= 20;
  if (loadTime > 5000) score -= 30;
  if (domContentLoaded > 1500) score -= 15;
  if (domContentLoaded > 2500) score -= 25;
  
  return Math.max(0, score);
}

// Main performance monitoring function
function runPerformanceCheck() {
  console.log('=== Performance Check Started ===');
  
  // Wait for page to fully load
  if (document.readyState === 'complete') {
    executeChecks();
  } else {
    window.addEventListener('load', executeChecks);
  }
}

function executeChecks() {
  setTimeout(() => {
    console.log('Page Load Time:', performance.now().toFixed(2), 'ms');
    
    trackCoreWebVitals();
    analyzeResourceLoading();
    trackMemoryUsage();
    analyzeNavigationTiming();
    
    const score = calculatePerformanceScore();
    console.log('Performance Score:', score + '/100');
    
    console.log('=== Performance Check Complete ===');
  }, 1000);
}

// Auto-run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runPerformanceCheck);
} else {
  runPerformanceCheck();
}

// Export for manual use
window.performanceCheck = {
  run: runPerformanceCheck,
  trackCoreWebVitals,
  analyzeResourceLoading,
  trackMemoryUsage,
  analyzeNavigationTiming,
  calculatePerformanceScore
};