import gulp from 'gulp';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Build task that runs TypeScript compilation and Vite build
gulp.task('build', async () => {
  try {
    // Run TypeScript compilation
    await execAsync('tsc');
    // Run Vite build
    await execAsync('vite build');
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
});

// Default task
gulp.task('default', gulp.series('build')); 