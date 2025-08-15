import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Function to convert bytes to KB
function bytesToKB(bytes) {
  return Math.round(bytes / 1024);
}

// Function to get the size of node_modules
function getNodeModulesSize() {
  try {
    const output = execSync('du -s -k node_modules').toString();
    const size = parseInt(output.split('\t')[0]);
    return size;
  } catch (error) {
    console.error('Error getting node_modules size:', error.message);
    return null;
  }
}

// Function to get the largest dependencies
function getLargestDependencies() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    // Get the size of each dependency
    const dependencySizes = [];
    for (const [name, version] of Object.entries(dependencies)) {
      try {
        const depPath = path.join('node_modules', name);
        if (fs.existsSync(depPath)) {
          const output = execSync(`du -s -k ${depPath}`).toString();
          const size = parseInt(output.split('\t')[0]);
          dependencySizes.push({ name, version, sizeKB: size });
        }
      } catch (error) {
        console.error(`Error getting size for ${name}:`, error.message);
      }
    }
    
    // Sort by size (largest first)
    return dependencySizes.sort((a, b) => b.sizeKB - a.sizeKB);
  } catch (error) {
    console.error('Error getting largest dependencies:', error.message);
    return [];
  }
}

// Main function to analyze dependencies
async function analyzeDependencies() {
  try {
    // Get the bundle analysis
    const bundleAnalysis = JSON.parse(fs.readFileSync('bundle-analysis.json', 'utf8'));
    
    // Get the node_modules size
    const nodeModulesSize = getNodeModulesSize();
    
    // Get the largest dependencies
    const largestDependencies = getLargestDependencies();
    const top10Dependencies = largestDependencies.slice(0, 10);
    
    // Update the bundle analysis with dependency information
    const updatedAnalysis = {
      ...bundleAnalysis,
      dependencies: {
        totalNodeModulesSizeKB: nodeModulesSize,
        largestDependencies: top10Dependencies
      },
      optimizationOpportunities: []
    };
    
    // Identify optimization opportunities
    
    // 1. Large JS bundle
    if (bundleAnalysis.js.totalSizeKB > 250) {
      updatedAnalysis.optimizationOpportunities.push({
        type: 'large_js_bundle',
        description: 'The JavaScript bundle is larger than 250KB. Consider code splitting or lazy loading.',
        severity: 'high'
      });
    }
    
    // 2. Large dependencies
    const largeLibraries = top10Dependencies.filter(dep => dep.sizeKB > 100);
    if (largeLibraries.length > 0) {
      updatedAnalysis.optimizationOpportunities.push({
        type: 'large_dependencies',
        description: `Found ${largeLibraries.length} dependencies larger than 100KB. Consider alternatives or lazy loading.`,
        severity: 'medium',
        dependencies: largeLibraries.map(dep => dep.name)
      });
    }
    
    // 3. Radix UI components
    const radixDeps = top10Dependencies.filter(dep => dep.name.includes('@radix-ui'));
    if (radixDeps.length > 5) {
      updatedAnalysis.optimizationOpportunities.push({
        type: 'many_radix_components',
        description: 'Using many Radix UI components. Consider bundling only the ones you need.',
        severity: 'low',
        dependencies: radixDeps.map(dep => dep.name)
      });
    }
    
    // Write the updated analysis to the JSON file
    fs.writeFileSync('bundle-analysis.json', JSON.stringify(updatedAnalysis, null, 2));
    
    console.log('Dependency analysis complete. Results updated in bundle-analysis.json');
    console.log(`Total node_modules size: ${nodeModulesSize} KB`);
    
    console.log('\nTop 10 largest dependencies:');
    top10Dependencies.forEach(dep => {
      console.log(`- ${dep.name}: ${dep.sizeKB} KB`);
    });
    
    console.log('\nOptimization opportunities:');
    updatedAnalysis.optimizationOpportunities.forEach(opp => {
      console.log(`- [${opp.severity.toUpperCase()}] ${opp.description}`);
    });
    
    return updatedAnalysis;
  } catch (error) {
    console.error('Error analyzing dependencies:', error.message);
    return null;
  }
}

// Run the analysis
analyzeDependencies();

