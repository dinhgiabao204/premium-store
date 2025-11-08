#!/bin/bash

# Build script for the landing page project

# Define directories
CSS_DIR="./css"
JS_DIR="./js"
ASSETS_DIR="./assets"
BUILD_DIR="./build"

# Create build directory if it doesn't exist
mkdir -p $BUILD_DIR

# Minify CSS files
echo "Minifying CSS files..."
for file in $CSS_DIR/*.css; do
    cssnano $file -o $BUILD_DIR/$(basename $file)
done

# Minify JavaScript files
echo "Minifying JavaScript files..."
for file in $JS_DIR/*.js; do
    terser $file -o $BUILD_DIR/$(basename $file)
done

# Copy assets to build directory
echo "Copying assets..."
cp -r $ASSETS_DIR/* $BUILD_DIR/

echo "Build completed successfully!"