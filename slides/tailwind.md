---
marp: true
title: Tailwind CSS
theme: default
paginate: true
_class: lead
---

# 🎨 Introduction to Tailwind CSS

### A Utility-First CSS Framework

---

## 🧭 Agenda

1. What is Tailwind CSS?
2. Why Choose Tailwind?
3. Setup Guide
4. How It Works: The Utility-First Approach
5. Testing Your Setup
6. Core Concepts in Action
7. Building for Production

---

## 🤔 What is Tailwind CSS?

- A **utility-first CSS framework** for rapidly building custom user interfaces.
- It provides low-level utility classes to build designs **directly in your HTML**.
- Instead of pre-styled components (like in Bootstrap), you get building blocks.
- Aims to make development faster and more consistent without forcing you into specific designs.

---

## 👍 Why Choose Tailwind?

- **Speed:** Build and prototype UIs incredibly fast without writing custom CSS.
- **Consistency:** Utility classes help maintain a consistent design system (spacing, colors, etc.).
- **Responsive Design:** Responsive variants make it trivial to build fully responsive interfaces.
- **Customizable:** Highly customizable via the `tailwind.config.js` file.
- **Tiny Production Builds:** Automatically removes unused CSS when building for production.

---

## 🛠️ Setup Guide

This guide will show you how to set up Tailwind CSS in your LBAW project.

**Topics:**
- Dependency Installation
- Vite Configuration
- Tailwind Configuration
- Running the Dev Server

---

### Setup 1: Install Dependencies

First, run `npm install` to install all project dependencies. Tailwind CSS is already included in your `package.json`.

```bash
npm install
```

This command downloads Tailwind CSS and its peer dependencies into your `node_modules` directory.

---

### Setup 2: Configure Vite

In the `<head>` section of your `resources/views/layouts/app.blade.php` file, add the following line to include the compiled Tailwind stylesheet.

```html
@vite('resources/css/app.css')
```

Vite is the build tool used by Laravel to process and bundle assets like CSS and JavaScript.

---

### Setup 3: Create `tailwind.config.js`

Create a `tailwind.config.js` file in your project's root directory with the following content:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./resources/**/*.blade.php", "./resources/**/*.js"],
  theme: {},
  plugins: [],
};
```

The `content` array tells Tailwind which files to scan for class names.

---

### Setup 4: Run the Development Servers

To start the development environment, you need two processes running:

1.  **Vite Dev Server:** Compiles your assets on-the-fly.
    ```bash
    npm run dev
    ```
2.  **Laravel Dev Server:** Runs your PHP application.
    ```bash
    php artisan serve
    ```

You can use the provided `dev.sh` script to automate this.

---

## 💡 How It Works: Utility-First

Instead of writing CSS, you apply pre-existing classes directly in your HTML.

**Traditional CSS:**
```html
<div class="chat-notification">
  <div class="chat-notification-logo-wrapper">
    <img class="chat-notification-logo" src="/img/logo.svg" alt="ChitChat Logo">
  </div>
  <div class="chat-notification-content">
    <h4 class="chat-notification-title">ChitChat</h4>
    <p class="chat-notification-message">You have a new message!</p>
  </div>
</div>
```

---

## 💡 How It Works: Utility-First (cont.)

**With Tailwind:**
```html
<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
  <div class="flex-shrink-0">
    <img class="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo">
  </div>
  <div>
    <div class="text-xl font-medium text-black">ChitChat</div>
    <p class="text-gray-500">You have a new message!</p>
  </div>
</div>
```
You build complex components from a constrained set of primitive utilities.

---

## ✅ Testing Your Setup

To test if Tailwind is working, add some utility classes to any Blade view.

For example, in `resources/views/pages/cards.blade.php`:
```html
<p class="font-bold text-red-500 text-2xl">
    This should be bold, red, and large.
</p>
```

When you save the file, `npm run dev` should automatically recompile the CSS, and your browser will reload to show the styled text.

---

## 🎨 Core Concepts in Action

Let's style a button to see how utilities combine.

```html
<button class="bg-blue-500 text-white font-bold py-2 px-4 rounded">
  Click me
</button>
```

- `bg-blue-500`: Sets the background color.
- `text-white`: Sets the text color.
- `font-bold`: Makes the text bold.
- `py-2`: Adds padding on the y-axis.
- `px-4`: Adds padding on the x-axis.
- `rounded`: Applies a border radius.

---

## ✨ Hover, Focus, and Other States

Tailwind uses modifiers to style elements on different states.

```html
<button class="
  bg-blue-500 hover:bg-blue-700
  text-white font-bold
  py-2 px-4 rounded
">
  Hover over me
</button>
```

The `hover:bg-blue-700` class changes the background color only when the button is hovered. Other common modifiers include `focus:`, `active:`, and `disabled:`.

---

## 📱 Responsive Design

Use screen-size prefixes like `sm:`, `md:`, `lg:`, and `xl:` to change styles at different breakpoints.

```html
<div class="bg-red-500 md:bg-green-500 lg:bg-blue-500">
  <!--
    This div is red on small screens,
    green on medium screens,
    and blue on large screens.
  -->
</div>
```
This makes building complex responsive layouts intuitive and fast.

---

## 📦 Building for Production

When you're ready to deploy, you need to build your final CSS file.

```bash
npm run build
```

This command will:
1.  Scan your `content` files (Blade, JS) for all Tailwind classes used.
2.  Generate a CSS file containing **only the classes you actually used**.
3.  Minify the final CSS file.

This results in a highly optimized, small file for production.

---

## 📦 Production Script Example

The `upload_image.sh` script should be updated to include the build step before creating the Docker image.

```sh
#!/usr/bin/env bash
# ... (script setup)

# Ensure dependencies are available and assets are built
composer install
php artisan config:clear
php artisan optimize
npm run build # <-- Build production assets

# Build & push image
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  # ... (rest of the script)
```

---

## ✅ Summary

- Tailwind is a **utility-first** framework for rapid UI development.
- You build designs by applying small classes directly in your HTML.
- It's highly **customizable** and supports **responsive design** out-of-the-box.
- The `npm run build` command creates a **tiny, optimized CSS file** for production by purging unused styles.
- It's a powerful tool for creating modern, bespoke web applications.

---

## 📚 Useful Resources

- **Tailwind CSS Cheat Sheet:** [nerdcave.com/tailwind-cheat-sheet](https://nerdcave.com/tailwind-cheat-sheet)
- **Official Documentation:** [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

## 💬 Questions?
