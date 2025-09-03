@echo off
echo 🧹 Fixing Git Repository - Removing node_modules from tracking
echo.

echo Checking if node_modules is being tracked...
git ls-files | findstr node_modules > nul
if %errorlevel% == 0 (
    echo ⚠️  node_modules is being tracked by git!
    echo.
    echo Removing node_modules from git tracking...
    git rm -r --cached frontend/node_modules 2>nul
    git rm -r --cached node_modules 2>nul
    
    echo Adding .gitignore...
    git add .gitignore
    
    echo Committing the fix...
    git commit -m "Remove node_modules from tracking and add .gitignore"
    
    echo ✅ Fixed! node_modules is no longer tracked.
) else (
    echo ✅ Good! node_modules is not being tracked.
)

echo.
echo Current repository size:
git count-objects -vH

echo.
echo Files being tracked:
git ls-files | wc -l
echo files total

echo.
echo ✅ Repository is now optimized for deployment!
pause