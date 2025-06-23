Your task is to publish the comfyui_frontend_package to PyPI with version $ARGUMENTS.

<context>
You are managing the release of the ComfyUI frontend package, a critical component of the ComfyUI ecosystem. This package needs to be published to PyPI so users can install it via pip. The publication process requires careful attention to versioning, authentication, and build artifacts.
</context>

<important_prerequisites>
- You MUST be in the root directory of the ComfyUI_frontend repository
- The PyPI API token MUST be available as environment variable `COMFYUI_FRONTEND_PYPI_TOKEN`
- The target version is: $ARGUMENTS
- Node.js and npm must be installed and available
- Python 3.x must be installed (the `python3` command will be used)
- If you do not have sufficient information or encounter errors, say "I need clarification on..." and ask for help
</important_prerequisites>

<instructions>
Execute the following steps sequentially to publish the package:

1. **Setup Python environment**
   - Create a virtual environment if it doesn't exist: `python3 -m venv venv`
   - Activate it: `source venv/bin/activate`
   - Install required tools: `pip install build twine`
   - Verify tools installed correctly

2. **Build the frontend (CRITICAL STEP)**
   - Ensure you're in the root directory
   - Install dependencies: `npm ci`
   - Build the frontend: `npm run build`
   - Verify the `dist/` directory exists and contains built files
   - Expected directories in dist/: assets/, cursor/, extensions/, fonts/, scripts/, templates/
   - Expected files in dist/: index.html, materialdesignicons.min.css

3. **Setup PyPI package structure**
   - Clean any previous build artifacts: `rm -rf comfyui_frontend_package/dist/`
   - Create package directory structure: `mkdir -p comfyui_frontend_package/comfyui_frontend_package/static/`
   - Copy built frontend files: `cp -r dist/* comfyui_frontend_package/comfyui_frontend_package/static/`
   - Verify files were copied correctly: `ls -la comfyui_frontend_package/comfyui_frontend_package/static/`

4. **Build the package with correct version**
   - Navigate to package directory: `cd comfyui_frontend_package`
   - Set version: `export COMFYUI_FRONTEND_VERSION=$ARGUMENTS`
   - Build package: `python3 -m build`
   - Return to root: `cd ..`

5. **Verify build artifacts**
   - Check that files exist in `comfyui_frontend_package/dist/`:
     - `comfyui_frontend_package-$ARGUMENTS-py3-none-any.whl`
     - `comfyui_frontend_package-$ARGUMENTS.tar.gz`
   - Verify file sizes are reasonable (should be ~50-60MB each)
   - If files don't match expected version or are suspiciously small, STOP and report the issue

6. **Upload to PyPI**
   - Ensure you're in the root directory
   - Activate the virtual environment if not already active: `source venv/bin/activate`
   - Run: `TWINE_USERNAME=__token__ TWINE_PASSWORD=$COMFYUI_FRONTEND_PYPI_TOKEN python3 -m twine upload comfyui_frontend_package/dist/comfyui_frontend_package-$ARGUMENTS*`
   - Monitor output for success or errors
   - The upload will show progress bars and should complete with a success message

7. **Verify publication**
   - Twine will output the URL after successful upload
   - Check PyPI URL: `https://pypi.org/project/comfyui-frontend-package/$ARGUMENTS/`
   - Confirm the package appears with correct version
   - Optional: Test installation in a clean environment: `pip install comfyui-frontend-package==$ARGUMENTS`
</instructions>

<critical_warnings>
- NEVER hardcode the PyPI token in commands - always use the environment variable
- The package directory uses underscores (comfyui_frontend_package) but PyPI name uses hyphens (comfyui-frontend-package)
- Multiple dist/ directories exist - use only `comfyui_frontend_package/dist/` for PyPI uploads
- If the COMFYUI_FRONTEND_VERSION environment variable is not set, the package will build with default version 0.1.0
- Always use `python3` command explicitly (not `python`) to avoid Python 2.x issues
- The frontend MUST be built before packaging - missing this step results in empty packages
- Clean previous build artifacts to avoid version conflicts
</critical_warnings>

<version_format>
Version should follow PEP 440 conventions:
- Production: `1.22.3`
- Alpha: `1.22.3a1`, `1.22.3a2`
- Beta: `1.22.3b1`, `1.22.3b2`
- Release Candidate: `1.22.3rc1`, `1.22.3rc2`
</version_format>

<error_handling>
If you encounter errors:
- "Invalid distribution file": Version mismatch - rebuild with correct COMFYUI_FRONTEND_VERSION
- "Authentication failed": Check COMFYUI_FRONTEND_PYPI_TOKEN environment variable
- "Version already exists": This version was already published - use a different version number
- Small package size (<1MB): Frontend build was likely skipped - ensure npm run build completed successfully
- "python: command not found": Use python3 instead of python
- "No such file or directory" during cp: Ensure npm run build completed and dist/ directory exists
- Build warnings about npm vulnerabilities: Can be ignored for now, but note them
- For any other errors: Stop and report the full error message for assistance
</error_handling>

Remember: This is a production deployment. Double-check each step before proceeding, especially the version number and authentication.