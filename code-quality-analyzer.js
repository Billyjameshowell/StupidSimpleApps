#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Configuration
const ROOT_DIR = './client/src';
const REPORT_FILE = 'code-quality.json';

// Issue counters
const issues = {
  console_logs: {
    count: 0,
    files: []
  },
  missing_memo: {
    count: 0,
    files: []
  },
  key_prop_issues: {
    count: 0,
    files: []
  },
  react_anti_patterns: {
    count: 0,
    files: []
  },
  unnecessary_rerenders: {
    count: 0,
    files: []
  },
  failed_analysis: []
};

// Helper function to recursively get all files with specific extensions
function getAllFiles(dir, extensions = ['.jsx', '.tsx']) {
  let files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(getAllFiles(fullPath, extensions));
      } else if (extensions.includes(path.extname(fullPath))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    issues.failed_analysis.push(dir);
  }
  
  return files;
}

// Find console.logs
function findConsoleLogs(fileContent, filePath) {
  const regex = /console\.(log|warn|error|info|debug)\(/g;
  let match;
  let count = 0;
  
  while ((match = regex.exec(fileContent)) !== null) {
    count++;
  }
  
  if (count > 0) {
    issues.console_logs.count += count;
    issues.console_logs.files.push({
      path: filePath,
      count: count
    });
  }
  
  return count;
}

// Find missing memoization
function findMissingMemo(fileContent, filePath) {
  // Check for component functions that could benefit from memoization
  const componentRegex = /function\s+([A-Z][A-Za-z0-9]*)\s*\([^)]*\)\s*{/g;
  const arrowComponentRegex = /const\s+([A-Z][A-Za-z0-9]*)\s*=\s*(?:\([^)]*\)|[A-Za-z0-9_]+)\s*=>\s*{/g;
  
  // Check if the file already uses memo
  const usesMemo = fileContent.includes('React.memo') || 
                  fileContent.includes('memo(') || 
                  fileContent.includes('useMemo(') ||
                  fileContent.includes('useCallback(');
  
  let componentCount = 0;
  let match;
  
  // Count regular function components
  while ((match = componentRegex.exec(fileContent)) !== null) {
    componentCount++;
  }
  
  // Count arrow function components
  while ((match = arrowComponentRegex.exec(fileContent)) !== null) {
    componentCount++;
  }
  
  // If there are components but no memoization is used
  if (componentCount > 0 && !usesMemo) {
    // Check if the component renders lists or has props that could benefit from memoization
    const hasList = fileContent.includes('.map(') && fileContent.includes('return');
    const hasProps = fileContent.includes('props.') || fileContent.includes('{ ');
    
    if (hasList || hasProps) {
      issues.missing_memo.count += componentCount;
      issues.missing_memo.files.push({
        path: filePath,
        count: componentCount
      });
      return componentCount;
    }
  }
  
  return 0;
}

// Find key prop issues
function findKeyPropIssues(fileContent, filePath) {
  // Look for .map() calls that might be missing keys
  const mapRegex = /\.map\(\s*(?:\([^)]*\)|[A-Za-z0-9_]+)\s*=>\s*(?:{[\s\S]*?<[^>]*>|<[^>]*>)/g;
  const keyRegex = /key={/;
  
  let match;
  let count = 0;
  
  while ((match = mapRegex.exec(fileContent)) !== null) {
    const mapCall = match[0];
    // Check if there's a key prop in this map call
    if (!keyRegex.test(mapCall)) {
      count++;
    }
  }
  
  if (count > 0) {
    issues.key_prop_issues.count += count;
    issues.key_prop_issues.files.push({
      path: filePath,
      count: count
    });
  }
  
  return count;
}

// Find React anti-patterns
function findReactAntiPatterns(fileContent, filePath) {
  let count = 0;
  const antiPatterns = [
    // State updates in loops
    { regex: /for\s*\([^)]*\)\s*{\s*[\s\S]*?set[A-Z]/g, name: "state update in loop" },
    
    // Inline object creation in props or JSX
    { regex: /<[A-Za-z]+\s+style={{/g, name: "inline style object" },
    
    // Direct DOM manipulation
    { regex: /document\.getElementById|document\.querySelector/g, name: "direct DOM manipulation" },
    
    // setState in componentDidMount without condition
    { regex: /componentDidMount\(\)\s*{\s*[\s\S]*?this\.setState\(/g, name: "setState in componentDidMount" },
    
    // Using index as key in loops
    { regex: /key={index}|key={\$?i}|key={idx}/g, name: "index as key" },
    
    // Mutating state directly
    { regex: /this\.state\.[A-Za-z0-9_]+ =/g, name: "direct state mutation" },
    
    // Async setState without function form
    { regex: /\.then\([^)]*setState\({/g, name: "async setState without function form" },
    
    // Derived state from props without memoization
    { regex: /const\s+[a-z][A-Za-z0-9_]*\s*=\s*props\.[a-z][A-Za-z0-9_]*\s*\+\s*/g, name: "derived state without memo" },
  ];
  
  for (const pattern of antiPatterns) {
    let patternMatch;
    let patternCount = 0;
    
    while ((patternMatch = pattern.regex.exec(fileContent)) !== null) {
      patternCount++;
    }
    
    count += patternCount;
  }
  
  if (count > 0) {
    issues.react_anti_patterns.count += count;
    issues.react_anti_patterns.files.push({
      path: filePath,
      count: count
    });
  }
  
  return count;
}

// Find potential unnecessary re-renders
function findUnnecessaryRerenders(fileContent, filePath) {
  let count = 0;
  
  // Check for inline function definitions in JSX
  const inlineFunctionRegex = /<[A-Za-z]+[^>]*\s+on[A-Z][A-Za-z]*={(?!\s*[a-zA-Z0-9_]+\s*(?:\([^)]*\))?\s*=>|[a-zA-Z0-9_]+\s*\()/g;
  
  // Check for inline object creation in JSX
  const inlineObjectRegex = /<[A-Za-z]+[^>]*\s+[a-z][A-Za-z]*={(?!\s*[a-zA-Z0-9_]+\s*(?:\([^)]*\))?\s*=>|[a-zA-Z0-9_]+\s*\()\s*{/g;
  
  // Check for state updates that could trigger unnecessary re-renders
  const stateUpdateRegex = /set[A-Z][A-Za-z0-9_]*\([^)]*\)/g;
  
  let match;
  
  // Count inline functions
  while ((match = inlineFunctionRegex.exec(fileContent)) !== null) {
    count++;
  }
  
  // Count inline objects
  while ((match = inlineObjectRegex.exec(fileContent)) !== null) {
    count++;
  }
  
  // Check for frequent state updates
  const stateUpdates = [];
  while ((match = stateUpdateRegex.exec(fileContent)) !== null) {
    stateUpdates.push(match[0]);
  }
  
  // If there are multiple state updates close to each other
  if (stateUpdates.length > 3) {
    count++;
  }
  
  if (count > 0) {
    issues.unnecessary_rerenders.count += count;
    issues.unnecessary_rerenders.files.push({
      path: filePath,
      count: count
    });
  }
  
  return count;
}

// Main analysis function
function analyzeFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Run all checks
    findConsoleLogs(fileContent, filePath);
    findMissingMemo(fileContent, filePath);
    findKeyPropIssues(fileContent, filePath);
    findReactAntiPatterns(fileContent, filePath);
    findUnnecessaryRerenders(fileContent, filePath);
    
  } catch (error) {
    console.error(`Error analyzing file ${filePath}:`, error);
    issues.failed_analysis.push(filePath);
  }
}

// Main execution
console.log('Starting code quality analysis...');

// Get all React files
const reactFiles = getAllFiles(ROOT_DIR);
console.log(`Found ${reactFiles.length} React files to analyze.`);

// Analyze each file
reactFiles.forEach((file, index) => {
  console.log(`Analyzing file ${index + 1}/${reactFiles.length}: ${file}`);
  analyzeFile(file);
});

// Generate report
const report = {
  summary: {
    total_files_analyzed: reactFiles.length,
    total_files_failed: issues.failed_analysis.length,
    total_issues_found: 
      issues.console_logs.count + 
      issues.missing_memo.count + 
      issues.key_prop_issues.count + 
      issues.react_anti_patterns.count + 
      issues.unnecessary_rerenders.count
  },
  issues: issues
};

// Write report to file
fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

console.log('Analysis complete!');
console.log(`Found ${report.summary.total_issues_found} issues in ${reactFiles.length} files.`);
console.log(`Report saved to ${REPORT_FILE}`);

// Print summary
console.log('\nSummary:');
console.log(`- Console logs: ${issues.console_logs.count}`);
console.log(`- Missing memoization: ${issues.missing_memo.count}`);
console.log(`- Key prop issues: ${issues.key_prop_issues.count}`);
console.log(`- React anti-patterns: ${issues.react_anti_patterns.count}`);
console.log(`- Unnecessary re-renders: ${issues.unnecessary_rerenders.count}`);
console.log(`- Failed to analyze: ${issues.failed_analysis.length} files`);

