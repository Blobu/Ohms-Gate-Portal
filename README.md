# Ohm’s Gate Portal

Ohm’s Gate Portal is the official web platform for **Ohm’s Gate**, designed to provide a public-facing presentation website and a protected access area for educational users.

The platform serves two main purposes:

- **Public access** for anyone who wants to learn about the project and install the standard version of Ohm’s Gate
- **Authenticated access** for teachers or institutional users who need access to restricted resources such as **Teacher Mode**

Teacher Mode is a separate PC application that acts as a classroom control server. VR users connect to it individually, each inside their own sandbox environment, while the teacher can monitor, navigate between users, identify problems, and manage the session.

## Features

### Public area
- Landing page for project presentation
- Overview of Ohm’s Gate and its purpose
- Download/install access for the standard version
- Clean product-style interface

### Authenticated area
- Login and registration system
- Protected teacher-only pages
- Access to restricted downloads and Teacher Mode resources
- Role-based separation between public users and educational users

### Admin / teacher-oriented functionality
- Management interface for restricted builds or installation packages
- Searchable and sortable data table
- Create, edit, and delete entries through modal forms
- Structured dashboard for institutional use

## Project Goal

This website is built as an Angular application that combines:

- product presentation
- authenticated access control
- restricted resource distribution
- management features for educational deployment


## Tech Stack

- **Angular**
- **TypeScript**
- **NgZorro**
- **RxJS**
- **Angular Signals**
- **Lazy Loaded Feature Modules**
- **Fake API or backend API integration**

## Core Requirements Covered

This project is designed to satisfy the main Angular course requirements, including:

- Login and Register pages
- Form validation with at least one custom validator
- Remember Me support
- Route protection for authenticated pages
- Fully lazy loaded structure
- Use of `input()`, `output()`, and services
- Searchable, sortable, editable table/list
- Modal-based create and update flows
- Signal usage
- UI library integration with NgZorro
- Clean component-based architecture

## Vision

Ohm’s Gate Portal is more than a simple landing page. It is meant to become the web entry point of the wider Ohm’s Gate ecosystem, connecting public users, teachers, and educational deployments through a structured and scalable Angular application.
