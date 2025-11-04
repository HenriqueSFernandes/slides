---
marp: true
theme: default
paginate: true
_class: lead
---

# 🚀 Introduction to Laravel

### A PHP Framework for Web Artisans

---

## 🧭 Agenda

1. What is Laravel?
2. Why Choose Laravel?
3. Core Features
4. Installation & Setup
5. Application Structure
6. Routing & Controllers
7. Blade Templating
8. Eloquent ORM & Migrations
9. Artisan CLI
10. Summary

---

## 🤔 What is Laravel?

- A **free, open-source PHP web framework** created by Taylor Otwell.
- Follows the **Model-View-Controller (MVC)** architectural pattern.
- Designed for developing web applications with an **expressive, elegant syntax**.
- Aims to make development an enjoyable and creative experience.

---

## 👍 Why Choose Laravel?

- **Developer Experience:** Elegant syntax, powerful tools, and great documentation.
- **Robust Features:** Comes with authentication, routing, sessions, and caching out-of-the-box.
- **Scalability:** Suitable for both small projects and large-scale enterprise applications.
- **Large Community:** A massive, active community provides support, packages, and resources.
- **Security:** Helps secure applications by protecting against common vulnerabilities like SQL injection and cross-site scripting (XSS).

---

## ✨ Core Features

- **Routing Engine:** Simple and powerful way to define application routes.
- **Eloquent ORM:** An advanced PHP implementation of the active record pattern, making database interactions a breeze.
- **Blade Templating Engine:** A simple, yet powerful templating engine.
- **Artisan CLI:** A command-line interface that provides helpful commands for development.
- **Middleware:** Provides a convenient mechanism for filtering HTTP requests entering your application.

---

## ⚙️ Installation via Composer

The primary way to install Laravel is using **Composer**.

```bash
composer global require laravel/installer
laravel new example-app
```

This command creates a new directory `example-app` with a fresh Laravel installation.

---

## 📁 Application Structure

A quick look at the most important directories:

- `app/` - Core application code (Models, Controllers, etc.).
- `bootstrap/` - Framework bootstrapping scripts.
- `config/` - Application configuration files.
- `database/` - Database migrations and seeders. (You cannot use migrations for LBAW)
- `public/` - The web server's document root.
- `resources/` - Views (Blade templates), CSS, and JS.
- `routes/` - All application route definitions.
- `storage/` - Compiled templates, session files, and caches.

---

## 🛣️ Routing

Routes define how your application responds to URL requests. They are typically defined in `routes/web.php`.

```php
use Illuminate\Support\Facades\Route;

// Responds to GET requests for the homepage
Route::get('/', function () {
    return 'Hello, World!';
});

// Using a controller
use App\Http\Controllers\PostController;

Route::get('/posts', [PostController::class, 'index']);
```

---

## 🕹️ Controllers

Controllers are used to group related request handling logic into a single class.

- Generate a controller with Artisan:

  ```bash
  php artisan make:controller PostController
  ```

- A simple controller method:

  ```php
  namespace App\Http\Controllers;

  class PostController extends Controller
  {
      public function index()
      {
          return view('posts.index');
      }
  }
  ```

---

## 🍃 Blade Templating

Blade is Laravel's powerful templating engine. It lets you use plain PHP in your views.

```blade
<!-- resources/views/greeting.blade.php -->

<html>
    <body>
        <h1>Hello, {{ $name }}</h1>
    </body>
</html>
```

Blade files use the `.blade.php` extension and are stored in `resources/views`.

---

## 🧩 Blade Layouts

Blade also allows you to create a master layout and extend it in other views.

**Layout file (`layout.blade.php`):**

```blade
<html>
<head>
    <title>@yield('title')</title>
</head>
<body>
    <div class="container">
        @yield('content')
    </div>
</body>
</html>
```

---

## 🧩 Blade Layouts (continued)

**Child view (`home.blade.php`):**

```blade
@extends('layout')

@section('title', 'Home Page')

@section('content')
    <p>This is the home page content.</p>
@endsection
```

---

## 💾 Eloquent ORM

Eloquent is an **Object-Relational Mapper (ORM)** that makes it easy to interact with your database. Each database table has a corresponding "Model".

- Generate a model:

  ```bash
  php artisan make:model Post
  ```

- Example usage:

  ```php
  // Get all posts
  $posts = App\Models\Post::all();

  // Create a new post
  $post = new App\Models\Post;
  $post->title = 'New Post';
  $post->save();
  ```

---

## 🏗️ Migrations

Migrations are like version control for your database, allowing you to easily modify and share the application's database schema.

**Don't forget that you CANNOT use migrations for LBAW**

- Generate a migration:

  ```bash
  php artisan make:migration create_posts_table
  ```

---

## 🏗️ Migrations (continued)

- Define the schema:

  ```php
  // database/migrations/YYYY_MM_DD_HHMMSS_create_posts_table.php
  public function up()
  {
      Schema::create('posts', function (Blueprint $table) {
          $table->id();
          $table->string('title');
          $table->text('content');
          $table->timestamps();
      });
  }
  ```

- Run migrations:
  ```bash
  php artisan migrate
  ```

---

## 🛠️ Artisan CLI

Artisan is the command-line interface included with Laravel. It provides a number of helpful commands.

Some common commands:

```bash
# List all available commands
php artisan list

# Start the local development server
php artisan serve

# Create a new controller
php artisan make:controller MyController

# Run database migrations
php artisan migrate
```

---

## 📚 Learning Resources

- **Official Documentation:** [laravel.com/docs/12.x](https://laravel.com/docs/12.x)
- **Laracasts:** [laracasts.com](https://laracasts.com) (The best place to learn Laravel)
- **Laravel News:** [laravel-news.com](https://laravel-news.com) (Tutorials and news)

---

## 🤔 Don't Reinvent the Wheel

Some common problems were already solved by someone else. It's ok to take inspiration from projects from previous years, but **don't copy and paste**, since you may get flagged for plagiarism.

---

## 🎬 30 Days to Learn Laravel - Complete 8 Hour Course

<div style="text-align: center;">
<iframe width="800" height="450" src="https://www.youtube.com/embed/SqTdHCTWqks" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

---

## Or, if you are lazy:

<div style="text-align: center;">
<iframe width="800" height="450" src="https://www.youtube.com/embed/e7z6KJkGhmg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

---

## ✅ Summary

- Laravel is a powerful and elegant PHP framework with the MVC pattern.
- It has a rich feature set and a massive ecosystem.
- **Eloquent ORM** and **Blade** simplify database and view logic.
- **Artisan CLI** streamline development workflows.
- The community and learning resources are excellent for getting started.

---

## 💬 Questions?
